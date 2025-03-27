import dotenv from 'dotenv';
import pineconeService from './pineconeService.js';

// Load environment variables
dotenv.config();

class VectorService {
  constructor() {
    this.service = pineconeService;
    console.log(`Using Pinecone embedding service`);
  }

  // Initialize the service
  async initialize() {
    return await this.service.initialize();
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
    return await this.service.findWordNeighbors(word, numResults);
  }

  // Find nearest neighbors for a vector
  async findVectorNeighbors(vector, numResults = 5, excludeWords = []) {
    return await this.service.findVectorNeighbors(vector, numResults, excludeWords);
  }

  // Calculate midpoint between two vectors
  calculateMidpoint(vector1, vector2) {
    return this.service.calculateMidpoint(vector1, vector2);
  }

  // Find the nearest words to the midpoint of two words
  async findMidpoint(word1, word2, numResults = 5) {
    return await this.service.findMidpoint(word1, word2, numResults);
  }

  // Find analogy results
  async findAnalogy(word1, word2, word3, numResults = 5) {
    return await this.service.findAnalogy(word1, word2, word3, numResults);
  }

  // Get vector coordinates for visualization
  async getVectorCoordinates(words, dimensions = 2) {
    return await this.service.getVectorCoordinates(words, dimensions);
  }
}

// Create a singleton instance
const vectorService = new VectorService();

export default vectorService; 