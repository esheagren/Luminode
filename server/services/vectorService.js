import dotenv from 'dotenv';
import embeddingService from './embeddingService.js';
import pineconeService from './pineconeService.js';

// Load environment variables
dotenv.config();

// Determine which service to use based on environment variable
const USE_PINECONE = process.env.USE_PINECONE === 'true';

class VectorService {
  constructor() {
    this.service = USE_PINECONE ? pineconeService : embeddingService;
    console.log(`Using ${USE_PINECONE ? 'Pinecone' : 'local'} embedding service`);
  }

  // Initialize the service
  async initialize() {
    if (USE_PINECONE) {
      return await this.service.initialize();
    } else {
      return await this.service.loadEmbeddings();
    }
  }

  // Check if a word exists
  async wordExists(word) {
    return await this.service.wordExists(word);
  }

  // Get vector for a word
  async getWordVector(word) {
    return await this.service.getWordVector(word);
  }

  // Find nearest neighbors for a word
  async findWordNeighbors(word, numResults = 5) {
    if (USE_PINECONE) {
      return await this.service.findWordNeighbors(word, numResults);
    } else {
      return await this.service.findWordNeighbors(word, numResults, false);
    }
  }

  // Find nearest neighbors for a vector
  async findVectorNeighbors(vector, numResults = 5, excludeWords = []) {
    if (USE_PINECONE) {
      return await this.service.findVectorNeighbors(vector, numResults, excludeWords);
    } else {
      return await this.service.findVectorNeighbors(vector, numResults, excludeWords, false);
    }
  }

  // Calculate midpoint between two vectors
  calculateMidpoint(vector1, vector2) {
    return this.service.calculateMidpoint(vector1, vector2);
  }

  // Find the nearest words to the midpoint of two words
  async findMidpoint(word1, word2, numResults = 5) {
    if (USE_PINECONE) {
      return await this.service.findMidpoint(word1, word2, numResults);
    } else {
      // Check if both words exist
      const exists1 = await this.wordExists(word1);
      const exists2 = await this.wordExists(word2);
      
      if (!exists1 || !exists2) {
        throw new Error(`One or both words not found: '${word1}', '${word2}'`);
      }
      
      // Get vectors for both words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      
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
    }
  }

  // Find analogy results
  async findAnalogy(word1, word2, word3, numResults = 5) {
    if (USE_PINECONE) {
      return await this.service.findAnalogy(word1, word2, word3, numResults);
    } else {
      // Check if all words exist
      const exists1 = await this.wordExists(word1);
      const exists2 = await this.wordExists(word2);
      const exists3 = await this.wordExists(word3);
      
      if (!exists1 || !exists2 || !exists3) {
        throw new Error(`One or more words not found: '${word1}', '${word2}', '${word3}'`);
      }
      
      // Get vectors for all words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      const vector3 = await this.getWordVector(word3);
      
      // Calculate analogy vector (word2 - word1 + word3)
      const analogyVector = this.service.calculateAnalogy(vector1, vector2, vector3);
      
      // Find nearest neighbors to the analogy vector
      const neighbors = await this.findVectorNeighbors(analogyVector, numResults, [word1, word2, word3]);
      
      return {
        formula: `${word1}:${word2}::${word3}:?`,
        neighbors
      };
    }
  }

  // Get vector coordinates for visualization
  async getVectorCoordinates(words, dimensions = 2) {
    if (USE_PINECONE) {
      return await this.service.getVectorCoordinates(words, dimensions);
    } else {
      // Get vectors for all words
      const vectors = [];
      const validWords = [];
      
      for (const word of words) {
        const vector = await this.getWordVector(word);
        if (vector) {
          vectors.push(vector);
          validWords.push(word);
        }
      }
      
      if (vectors.length === 0) {
        return { words: [], coordinates: [] };
      }
      
      // Use PCA from mathHelpers to reduce dimensions
      const { performPCA } = await import('../utils/mathHelpers.js');
      const coordinates = performPCA(vectors, dimensions);
      
      return {
        words: validWords,
        vectors,
        coordinates
      };
    }
  }
}

// Create a singleton instance
const vectorService = new VectorService();

export default vectorService; 