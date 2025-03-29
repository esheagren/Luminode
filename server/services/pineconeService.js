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

        // Check if index exists
        console.log(`Checking if index '${PINECONE_INDEX_NAME}' exists...`);
        let indexesList;
        try {
          indexesList = await this.pinecone.listIndexes();
          console.log(`Successfully retrieved indexes list. Found ${indexesList.indexes ? indexesList.indexes.length : 0} indexes.`);
          
          if (indexesList.indexes) {
            console.log(`Available indexes: ${indexesList.indexes.map(idx => idx.name).join(', ')}`);
          }
        } catch (indexListError) {
          console.error('Error listing Pinecone indexes:', indexListError);
          console.error(`Error details: ${indexListError.message}, Type: ${indexListError.name}, Stack: ${indexListError.stack}`);
          throw new Error(`Failed to list Pinecone indexes: ${indexListError.message}`);
        }
        
        if (!indexesList || !indexesList.indexes) {
          console.error('Invalid response from Pinecone API - indexes list is empty or malformed');
          throw new Error('Failed to list Pinecone indexes - received invalid response');
        }
        
        const indexExists = indexesList.indexes.some(idx => idx.name === PINECONE_INDEX_NAME);
        
        if (!indexExists) {
          console.error(`Index '${PINECONE_INDEX_NAME}' does not exist. Please run the load-pinecone script first.`);
          throw new Error(`Pinecone index '${PINECONE_INDEX_NAME}' not found`);
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
      
      while (retries < MAX_RETRIES) {
        try {
          queryResponse = await this.namespace.query({
            topK: numResults + excludeWords.length, // Add extra results to account for excluded words
            includeMetadata: true,
            vector: vector,
            filter: { "text": { "$exists": true } }
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
      
      // Return the top matches up to numResults
      return filteredMatches.slice(0, numResults).map(match => ({
        word: match.id,
        score: match.score
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
      
      // Get vectors for both words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      
      if (!vector1 || !vector2) {
        throw new Error(`One or both words not found: '${word1}', '${word2}'`);
      }
      
      // Calculate midpoint
      const midpoint = this.calculateMidpoint(vector1, vector2);
      
      // Find nearest neighbors to midpoint
      const neighbors = await this.findVectorNeighbors(midpoint, numResults, [word1, word2]);
      
      return {
        word1,
        word2,
        midpoint: midpoint.slice(0, 5).map(v => v.toFixed(4)) + '...', // Truncated for display
        neighbors
      };
    } catch (error) {
      console.error(`Error finding midpoint between '${word1}' and '${word2}':`, error);
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

  // Get vector coordinates for visualization using PCA
  async getVectorCoordinates(words, dimensions = 2) {
    try {
      await this.initialize();
      
      // Limit number of words to process to prevent excessive memory usage
      const wordsToProcess = words.slice(0, 25); // Limit to 25 words maximum for serverless
      console.log(`[PineconeService] Processing ${wordsToProcess.length} words for coordinates`);
      
      // Get vectors for all words
      const vectors = [];
      const validWords = [];
      
      // Process words sequentially to avoid memory pressure
      for (const word of wordsToProcess) {
        try {
          console.log(`[PineconeService] Getting vector for word: "${word}"`);
          const vector = await this.getWordVector(word);
          if (vector) {
            console.log(`[PineconeService] Got vector for "${word}" (length: ${vector.length})`);
            vectors.push(vector);
            validWords.push(word);
          } else {
            console.log(`[PineconeService] No vector found for "${word}"`);
          }
        } catch (err) {
          console.error(`[PineconeService] Error fetching vector for word "${word}":`, err.message);
          // Continue with next word
        }
        
        // Release control to event loop between operations
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      if (vectors.length === 0) {
        console.log('[PineconeService] No vectors found for any words');
        return { words: [], coordinates: [], vectors: [] };
      }
      
      // Use PCA from mathHelpers to reduce dimensions
      console.log(`[PineconeService] Running PCA on ${vectors.length} vectors...`);
      const { performPCA } = await import('../utils/mathHelpers.js');
      const coordinates = await performPCA(vectors, dimensions);
      
      console.log(`[PineconeService] Successfully generated coordinates and returning ${vectors.length} vectors`);
      
      // Return both coordinates and vectors
      return {
        words: validWords,
        coordinates,
        vectors // Include the vectors in the response
      };
    } catch (error) {
      console.error('[PineconeService] Error getting vector coordinates:', error);
      throw error;
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