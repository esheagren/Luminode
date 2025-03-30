import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { cosineSimilarity } from '../utils/mathHelpers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Print environment information (sanitized) for debugging
function logEnvironmentInfo() {
  console.log('Environment variables check:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'set (begins with ' + process.env.PINECONE_API_KEY.substring(0, 3) + '...)' : 'NOT SET'}`);
  console.log(`- Running on Vercel: ${process.env.VERCEL === '1' ? 'Yes' : 'No'}`);
  
  // List all environment variables (names only, not values) to see what's available
  console.log('Available environment variables (names only):');
  const envVars = Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET'));
  console.log(envVars.join(', '));
}

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PINECONE_INDEX_NAME = 'quickstart';
const PINECONE_NAMESPACE = 'ns1';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

class PineconeService {
  constructor() {
    this.pinecone = null;
    this.index = null;
    this.namespace = null;
    this.isInitialized = false;
    this.initialization = null;
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('Pinecone service already initialized, reusing connection');
      return Promise.resolve();
    }

    if (this.initialization) {
      console.log('Pinecone service initialization in progress, waiting...');
      return this.initialization;
    }

    // Log environment info for debugging
    logEnvironmentInfo();

    this.initialization = new Promise(async (resolve, reject) => {
      try {
        console.log('Initializing Pinecone service...');
        
        // Get API key directly from environment
        let apiKey = process.env.PINECONE_API_KEY;
        
        if (!apiKey) {
          console.error('ERROR: Pinecone API key not found in environment variables');
          throw new Error('Pinecone API key not found. Please set PINECONE_API_KEY in environment variables.');
        }
        
        const maskedKey = `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`;
        console.log(`Using Pinecone API key: ${maskedKey} (length: ${apiKey.length})`);
        
        // Initialize Pinecone client with retry logic
        let retries = 0;
        while (retries < MAX_RETRIES) {
          try {
            console.log(`Attempt ${retries + 1}/${MAX_RETRIES} to initialize Pinecone client...`);
            this.pinecone = new Pinecone({
              apiKey: apiKey,
            });
            console.log("Pinecone client created successfully");
            break;
          } catch (err) {
            retries++;
            console.error(`Failed to initialize Pinecone client (attempt ${retries}/${MAX_RETRIES}):`, err);
            console.error(`Error details: ${err.message}, Type: ${err.name}, Stack: ${err.stack}`);
            
            if (retries >= MAX_RETRIES) throw err;
            
            console.log(`Waiting ${RETRY_DELAY_MS}ms before retry...`);
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
          }
        }

        // Connect to the index and namespace
        console.log(`Connecting to index '${PINECONE_INDEX_NAME}' and namespace '${PINECONE_NAMESPACE}'...`);
        try {
          this.index = this.pinecone.index(PINECONE_INDEX_NAME);
          this.namespace = this.index.namespace(PINECONE_NAMESPACE);
          console.log(`Successfully connected to index and namespace`);
          
          // Verify connection with a simple query
          console.log(`Verifying Pinecone connection with a test query...`);
          const testResult = await this.namespace.fetch(['test']);
          console.log(`Test query successful, response contains ${Object.keys(testResult.records || {}).length} records`);
        } catch (connectionError) {
          console.error('Error connecting to Pinecone index/namespace:', connectionError);
          console.error(`Error details: ${connectionError.message}, Type: ${connectionError.name}, Stack: ${connectionError.stack}`);
          throw new Error(`Failed to connect to Pinecone index/namespace: ${connectionError.message}`);
        }
        
        this.isInitialized = true;
        console.log('Pinecone service initialized successfully');
        resolve();
      } catch (error) {
        console.error('Error initializing Pinecone service:', error);
        console.error(`Error details: ${error.message}, Type: ${error.name}, Stack: ${error.stack}`);
        this.isInitialized = false;
        this.initialization = null;
        reject(error);
      }
    });

    return this.initialization;
  }

  // Check if a word exists in the database
  async wordExists(word) {
    try {
      await this.initialize();
      
      // Use fetch to check if the word exists
      const result = await this.namespace.fetch([word]);
      return result.records && Object.keys(result.records).length > 0;
    } catch (error) {
      console.error(`Error checking if word '${word}' exists:`, error);
      return false;
    }
  }

  // Get vector for a word
  async getWordVector(word) {
    try {
      await this.initialize();
      
      console.log(`[PineconeService] Fetching vector for word: "${word}"`);
      const result = await this.namespace.fetch([word]);
      
      console.log(`[PineconeService] Raw Pinecone response:`, JSON.stringify(result, null, 2));
      
      if (!result.records || !result.records[word]) {
        console.log(`[PineconeService] No records found for word "${word}"`);
        return null;
      }
      
      const vector = result.records[word].values;
      console.log(`[PineconeService] Vector found for "${word}":`, {
        length: vector.length,
        type: typeof vector,
        isArray: Array.isArray(vector),
        sample: vector.slice(0, 3) // Show first 3 values
      });
      
      return vector;
    } catch (error) {
      console.error(`[PineconeService] Error getting vector for word '${word}':`, error);
      throw error;
    }
  }

  // Find nearest neighbors for a word
  async findWordNeighbors(word, numResults = 5) {
    try {
      await this.initialize();
      
      // Get the vector for the word
      const vector = await this.getWordVector(word);
      if (!vector) {
        throw new Error(`Word '${word}' not found`);
      }
      
      // Find nearest neighbors
      return this.findVectorNeighbors(vector, numResults, [word]);
    } catch (error) {
      console.error(`Error finding neighbors for word '${word}':`, error);
      throw error;
    }
  }

  // Find nearest neighbors for a vector
  async findVectorNeighbors(vector, numResults = 5, excludeWords = []) {
    try {
      await this.initialize();
      
      let retries = 0;
      let queryResponse;
      
      // Add minimum similarity threshold (0.5 means at least 50% similar)
      const minScore = 0.5;
      
      console.log(`[PineconeService] Finding vector neighbors with parameters:`, {
        numResults,
        excludeWords,
        minScore,
        vectorLength: vector.length
      });
      
      while (retries < MAX_RETRIES) {
        try {
          queryResponse = await this.namespace.query({
            topK: numResults + excludeWords.length, // Add extra results to account for excluded words
            includeMetadata: true,
            vector: vector,
            filter: { "text": { "$exists": true } }
          });
          
          console.log(`[PineconeService] Query response:`, {
            totalMatches: queryResponse.matches.length,
            scores: queryResponse.matches.map(m => m.score).join(', ')
          });
          
          break; // Success, exit the loop
        } catch (error) {
          retries++;
          console.error(`Error querying Pinecone (attempt ${retries}/${MAX_RETRIES}):`, error.message);
          
          if (retries >= MAX_RETRIES) {
            throw error;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
      
      // Filter out excluded words
      const filteredMatches = queryResponse.matches.filter(match => !excludeWords.includes(match.id));
      
      console.log(`[PineconeService] After filtering:`, {
        originalCount: queryResponse.matches.length,
        filteredCount: filteredMatches.length,
        excludedWords: excludeWords.join(', ')
      });
      
      // Return the top matches up to numResults
      return filteredMatches.slice(0, numResults).map(match => ({
        word: match.id,
        score: match.score,
        vector: match.values // Include the actual vector for debugging
      }));
    } catch (error) {
      console.error('Error finding vector neighbors:', error);
      throw error;
    }
  }

  // Calculate midpoint between two vectors
  calculateMidpoint(vector1, vector2) {
    if (!vector1 || !vector2 || vector1.length !== vector2.length) {
      return null;
    }

    return vector1.map((val, i) => (val + vector2[i]) / 2);
  }

  // Find the nearest words to the midpoint of two words
  async findMidpoint(word1, word2, numResults = 5) {
    try {
      await this.initialize();
      
      console.log(`[PineconeService] Finding midpoint between '${word1}' and '${word2}'`);
      
      // Get vectors for both words
      console.log(`[PineconeService] Getting vector for '${word1}'...`);
      const vector1 = await this.getWordVector(word1);
      console.log(`[PineconeService] Vector1 retrieved: ${vector1 ? 'success' : 'failed'}`);
      
      console.log(`[PineconeService] Getting vector for '${word2}'...`);
      const vector2 = await this.getWordVector(word2);
      console.log(`[PineconeService] Vector2 retrieved: ${vector2 ? 'success' : 'failed'}`);
      
      if (!vector1 || !vector2) {
        const error = new Error(`One or both words not found: '${word1}' (${!!vector1}), '${word2}' (${!!vector2})`);
        error.notFound = true;
        throw error;
      }
      
      // Calculate similarity between input words
      console.log(`[PineconeService] Calculating similarity between input words...`);
      const { cosineSimilarity } = await import('../utils/mathHelpers.js');
      const inputSimilarity = cosineSimilarity(vector1, vector2);
      
      console.log(`[PineconeService] Input words similarity: ${inputSimilarity}`);
      
      // Calculate midpoint
      console.log(`[PineconeService] Calculating midpoint...`);
      const midpoint = this.calculateMidpoint(vector1, vector2);
      console.log(`[PineconeService] Midpoint calculated successfully`);
      
      // Find nearest neighbors to midpoint
      console.log(`[PineconeService] Finding nearest neighbors to midpoint...`);
      const neighbors = await this.findVectorNeighbors(midpoint, numResults, [word1, word2]);
      console.log(`[PineconeService] Found ${neighbors.length} neighbors`);
      
      // Calculate similarities between neighbors and midpoint
      console.log(`[PineconeService] Calculating similarities for neighbors...`);
      const neighborsWithSimilarities = await Promise.all(
        neighbors.map(async (neighbor) => {
          const neighborVector = neighbor.vector;
          const similarityToMidpoint = cosineSimilarity(neighborVector, midpoint);
          const similarityToWord1 = cosineSimilarity(neighborVector, vector1);
          const similarityToWord2 = cosineSimilarity(neighborVector, vector2);
          
          return {
            ...neighbor,
            similarities: {
              toMidpoint: similarityToMidpoint,
              toWord1: similarityToWord1,
              toWord2: similarityToWord2
            }
          };
        })
      );
      
      console.log(`[PineconeService] Found ${neighbors.length} neighbors for midpoint`);
      neighborsWithSimilarities.forEach((neighbor, i) => {
        console.log(`[PineconeService] Neighbor ${i + 1}: ${neighbor.word}`, {
          similarities: neighbor.similarities
        });
      });
      
      return {
        word1,
        word2,
        inputSimilarity,
        midpoint: {
          vector: midpoint,
          truncatedView: midpoint.slice(0, 5).map(v => v.toFixed(4)) + '...' // For display
        },
        neighbors: neighborsWithSimilarities
      };
    } catch (error) {
      console.error(`[PineconeService] Error finding midpoint between '${word1}' and '${word2}':`, error);
      console.error(`[PineconeService] Error details:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
        notFound: error.notFound
      });
      throw error;
    }
  }

  // Calculate analogy: word1 is to word2 as word3 is to ?
  calculateAnalogy(vector1, vector2, vector3) {
    if (!vector1 || !vector2 || !vector3 ||
        vector1.length !== vector2.length || vector2.length !== vector3.length) {
      console.error('Invalid vectors for analogy calculation');
      return null;
    }

    // Calculate vector2 - vector1 + vector3
    const analogyVector = new Array(vector1.length);
    for (let i = 0; i < vector1.length; i++) {
      analogyVector[i] = vector2[i] - vector1[i] + vector3[i];
    }
    
    return analogyVector;
  }

  // Find analogy results
  async findAnalogy(word1, word2, word3, numResults = 5) {
    try {
      await this.initialize();
      
      // Get vectors for all words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      const vector3 = await this.getWordVector(word3);
      
      if (!vector1 || !vector2 || !vector3) {
        throw new Error(`One or more words not found: '${word1}', '${word2}', '${word3}'`);
      }
      
      // Calculate analogy vector
      const analogyVector = this.calculateAnalogy(vector1, vector2, vector3);
      
      // Find nearest neighbors to the analogy vector
      const neighbors = await this.findVectorNeighbors(analogyVector, numResults, [word1, word2, word3]);
      
      return {
        formula: `${word1}:${word2}::${word3}:?`,
        neighbors
      };
    } catch (error) {
      console.error(`Error finding analogy for '${word1}:${word2}::${word3}:?':`, error);
      throw error;
    }
  }

  // Get vector coordinates for visualization
  async getVectorCoordinates(words, dimensions = 2) {
    try {
      await this.initialize();

      // 1. Fetch vectors for all words
      console.log(`[PineconeService] Fetching vectors for coordinates:`, words);
      const vectorData = await this.namespace.fetch(words);
      if (!vectorData || !vectorData.records) {
        // Log the raw response if possible
        console.error('[PineconeService] Failed to fetch vectors from Pinecone, response:', vectorData);
        throw new Error('Failed to fetch vectors from Pinecone');
      }
      console.log(`[PineconeService] Raw fetch response for coordinates:`, Object.keys(vectorData.records));


      // Filter out words that weren't found and collect vectors
      const foundWords = [];
      const vectors = [];
      const truncatedVectorStrings = {}; // Store truncated strings here

      words.forEach(word => {
        if (vectorData.records[word]) {
          const vector = vectorData.records[word].values;
          if (vector) {
            foundWords.push(word);
            vectors.push(vector);
            // Generate and store truncated vector string
            const firstFive = vector.slice(0, 5);
            truncatedVectorStrings[word] = `[${firstFive.join(', ')}...]`;
          } else {
             console.warn(`[PineconeService] Record found for "${word}" but no vector values present.`);
             truncatedVectorStrings[word] = null; // Handle case where vector might be missing unexpectedly
          }
        } else {
          console.warn(`[PineconeService] Word "${word}" not found in fetched records.`);
          truncatedVectorStrings[word] = null; // Mark as null if word not found
        }
      });


      if (vectors.length === 0) {
        console.log('[PineconeService] No valid vectors found for any requested words.');
        return { words: [], vectors: [], coordinates: [], truncatedVectors: {} }; // No valid vectors found
      }

      // Ensure dimension consistency
      const vectorDimension = vectors[0].length;
      console.log(`[PineconeService] Fetched ${vectors.length} valid vectors (out of ${words.length} requested) with dimension ${vectorDimension}`);

      // 2. Perform PCA for dimensionality reduction
      const { performPCA } = await import('../utils/mathHelpers.js');
      // Await the result of the async performPCA function
      const coordinates = await performPCA(vectors, dimensions);
      console.log(`[PineconeService] PCA completed, generated ${coordinates ? coordinates.length : 'undefined/error'} coordinate sets.`);


      // 3. Return combined data including truncated vectors
      return {
        words: foundWords,
        // No longer sending full vectors: vectors: vectors,
        coordinates: coordinates,
        truncatedVectors: truncatedVectorStrings // Send the map of word -> truncated string
      };

    } catch (error) {
      console.error(`[PineconeService] Error in getVectorCoordinates for words: ${words.join(', ')}`, error);
      // Add more detailed error logging
      if (error.response) {
        console.error('[PineconeService] Pinecone API Response Error:', error.response.data);
      }
      throw error; // Re-throw error for the route handler
    }
  }

  // Find slice through vector space using recursive midpoint calculations
  async findSlice(word1, word2, numResults = 5, maxDepth = 20, distanceThreshold = 0.99) {
    try {
      await this.initialize();
      
      // Get vectors for both words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      
      if (!vector1 || !vector2) {
        throw new Error(`One or both word vectors not found: '${word1}', '${word2}'`);
      }
      
      // Import math helpers
      const { cosineSimilarity } = await import('../utils/mathHelpers.js');
      
      // Fixed cosine similarity threshold (0.98) - we don't use the parameter anymore
      const similarityThreshold = 0.98;
      
      // Implement the slice algorithm
      const slicePoints = [];
      const visited = new Set([word1, word2]);
      
      // Add the two endpoint words
      slicePoints.push({
        word: word1,
        isEndpoint: true,
        isMainPoint: true,
        depth: 0,
        index: 0,
        fromWords: [word1],
        path: [word1]
      });
      
      slicePoints.push({
        word: word2,
        isEndpoint: true,
        isMainPoint: true,
        depth: 0,
        index: 1,
        fromWords: [word2],
        path: [word2]
      });
      
      // Start with the first pair of endpoints
      let nodePairs = [{
        node1: { word: word1, vector: vector1, depth: 0, path: [word1] },
        node2: { word: word2, vector: vector2, depth: 0, path: [word2] }
      }];
      
      let currentIndex = 2; // Start after the two endpoints
      
      // Process pairs recursively until we're done
      while (nodePairs.length > 0 && slicePoints.length < 100 && currentIndex < maxDepth + 2) {
        const { node1, node2 } = nodePairs.shift();
        
        // Calculate the cosine similarity between the two nodes
        const similarity = cosineSimilarity(node1.vector, node2.vector);
        
        // If the similarity is above threshold, we're done with this pair
        if (similarity >= similarityThreshold) {
          continue;
        }
        
        // Calculate midpoint
        const midpointVector = this.calculateMidpoint(node1.vector, node2.vector);
        
        // Find nearest word to the midpoint
        const midpointNeighbors = await this.findVectorNeighbors(
          midpointVector, 
          numResults, 
          Array.from(visited)
        );
        
        if (midpointNeighbors.length === 0) {
          continue;
        }
        
        // Get the word closest to the midpoint
        const midpointWord = midpointNeighbors[0].word;
        visited.add(midpointWord);
        
        // Get vector for the midpoint word
        const midpointWordVector = await this.getWordVector(midpointWord);
        
        // Record this midpoint
        const midpointNode = {
          word: midpointWord,
          vector: midpointWordVector,
          depth: Math.max(node1.depth, node2.depth) + 1,
          fromWords: [node1.word, node2.word],
          path: [...new Set([...node1.path, ...node2.path, midpointWord])]
        };
        
        // Add this midpoint to the results
        slicePoints.push({
          word: midpointWord,
          isMainPoint: true,
          depth: midpointNode.depth,
          index: currentIndex++,
          fromWords: [node1.word, node2.word],
          path: midpointNode.path,
          similarity: similarity
        });
        
        // Add secondary neighbors
        midpointNeighbors.slice(1).forEach((neighbor, idx) => {
          if (!visited.has(neighbor.word)) {
            visited.add(neighbor.word);
            slicePoints.push({
              word: neighbor.word,
              isMainPoint: false,
              depth: midpointNode.depth,
              index: currentIndex++,
              fromWords: [midpointWord],
              path: [...midpointNode.path, neighbor.word]
            });
          }
        });
        
        // Add new pairs to explore
        if (midpointNode.depth < maxDepth) {
          nodePairs.push({
            node1: node1,
            node2: midpointNode
          });
          
          nodePairs.push({
            node1: midpointNode,
            node2: node2
          });
        }
      }
      
      return {
        word1,
        word2,
        similarityThreshold,
        totalPoints: slicePoints.length,
        slicePoints
      };
    } catch (error) {
      console.error(`Error finding slice between '${word1}' and '${word2}':`, error);
      throw error;
    }
  }
}

// Create a singleton instance
const pineconeService = new PineconeService();

export default pineconeService; 