import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { cosineSimilarity } from '../utils/mathHelpers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

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

    this.initialization = new Promise(async (resolve, reject) => {
      try {
        console.log('Initializing Pinecone service...');
        
        // Get API key directly from environment or from .env file
        let apiKey = process.env.PINECONE_API_KEY;
        
        if (!apiKey) {
          console.error('Pinecone API key not found in environment variables');
          throw new Error('Pinecone API key not found. Please set PINECONE_API_KEY in environment variables.');
        }
        
        console.log(`Using Pinecone API key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
        
        // Initialize Pinecone client with retry logic
        let retries = 0;
        while (retries < MAX_RETRIES) {
          try {
            this.pinecone = new Pinecone({
              apiKey: apiKey,
            });
            break;
          } catch (err) {
            retries++;
            console.error(`Failed to initialize Pinecone client (attempt ${retries}/${MAX_RETRIES}):`, err.message);
            
            if (retries >= MAX_RETRIES) throw err;
            
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
          }
        }

        // Check if index exists
        console.log(`Checking if index '${PINECONE_INDEX_NAME}' exists...`);
        const indexesList = await this.pinecone.listIndexes();
        
        if (!indexesList || !indexesList.indexes) {
          throw new Error('Failed to list Pinecone indexes');
        }
        
        const indexExists = indexesList.indexes.some(idx => idx.name === PINECONE_INDEX_NAME);
        
        if (!indexExists) {
          console.error(`Index '${PINECONE_INDEX_NAME}' does not exist. Please run the load-pinecone script first.`);
          reject(new Error('Pinecone index not found'));
          return;
        }
        
        // Connect to the index and namespace
        console.log(`Connecting to index '${PINECONE_INDEX_NAME}' and namespace '${PINECONE_NAMESPACE}'...`);
        this.index = this.pinecone.index(PINECONE_INDEX_NAME);
        this.namespace = this.index.namespace(PINECONE_NAMESPACE);
        
        this.isInitialized = true;
        console.log('Pinecone service initialized successfully');
        resolve();
      } catch (error) {
        console.error('Error initializing Pinecone service:', error);
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
      
      const result = await this.namespace.fetch([word]);
      if (!result.records || !result.records[word]) {
        return null;
      }
      
      return result.records[word].values;
    } catch (error) {
      console.error(`Error getting vector for word '${word}':`, error);
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
      console.log(`Processing ${wordsToProcess.length} words in Pinecone service`);
      
      // Get vectors for all words
      const vectors = [];
      const validWords = [];
      
      // Process words sequentially to avoid memory pressure
      for (const word of wordsToProcess) {
        try {
          const vector = await this.getWordVector(word);
          if (vector) {
            vectors.push(vector);
            validWords.push(word);
          }
        } catch (err) {
          console.error(`Error fetching vector for word "${word}":`, err.message);
          // Continue with next word
        }
        
        // Release control to event loop between operations
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      if (vectors.length === 0) {
        return { words: [], coordinates: [] };
      }
      
      // Use PCA from mathHelpers to reduce dimensions
      console.log(`Running PCA on ${vectors.length} vectors...`);
      const { performPCA } = await import('../utils/mathHelpers.js');
      const coordinates = await performPCA(vectors, dimensions);
      
      // Clear vector references to help GC
      for (let i = 0; i < vectors.length; i++) {
        vectors[i] = null;
      }
      
      return {
        words: validWords,
        coordinates
      };
    } catch (error) {
      console.error('Error getting vector coordinates:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const pineconeService = new PineconeService();

export default pineconeService; 