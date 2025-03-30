import dotenv from 'dotenv';
import pineconeService from './pineconeService.js';

// Load environment variables
dotenv.config();

class VectorService {
  constructor() {
    this.service = pineconeService;
    console.log(`Using Pinecone embedding service exclusively`);
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

  // Find slices through vector space
  async findSlice(word1, word2, numResults = 5, maxDepth = 20, distanceThreshold = 0.99) {
    console.log(`[Service findSlice] Starting for "${word1}" and "${word2}"`); // Log entry
    // First implementation delegates to the underlying service if available
    // This check might be incorrect if pineconeService doesn't have findSlice
    // Assuming we are using the fallback implementation below
    /*
    if (this.service.findSlice) {
      console.log(`[Service findSlice] Delegating to underlying service`);
      return await this.service.findSlice(word1, word2, numResults, maxDepth);
    }
    */
    console.log(`[Service findSlice] Using vectorService implementation`);
    
    // If not available in underlying service, implement it here
    try {
      await this.initialize(); // Ensure service is initialized
      console.log(`[Service findSlice] Service initialized. Getting vectors...`);
      
      // Get vectors for both words
      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);
      
      if (!vector1 || !vector2) {
        console.error(`[Service findSlice] Vector missing: ${word1}=${!!vector1}, ${word2}=${!!vector2}`);
        throw new Error(`One or both word vectors not found: '${word1}', '${word2}'`);
      }
      console.log(`[Service findSlice] Got vectors. Vector lengths: ${vector1.length}, ${vector2.length}`);
      
      // Use cosine similarity from mathHelpers
      const { cosineSimilarity } = await import('../utils/mathHelpers.js');
      
      // Fixed cosine similarity threshold (0.98)
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
      
      console.log(`[Service findSlice] Initialized slicePoints with endpoints.`);
      // Start with the first pair of endpoints
      let nodePairs = [{
        node1: { word: word1, vector: vector1, depth: 0, path: [word1] },
        node2: { word: word2, vector: vector2, depth: 0, path: [word2] }
      }];
      
      let currentIndex = 2; // Start after the two endpoints
      
      // Process pairs recursively until we're done
      while (nodePairs.length > 0 && slicePoints.length < 100 && currentIndex < maxDepth + 2) {
        const currentPairIndex = nodePairs.length;
        const { node1, node2 } = nodePairs.shift();
        console.log(`[Service findSlice] Processing pair ${currentPairIndex}: "${node1.word}" <-> "${node2.word}" at depth ${Math.max(node1.depth, node2.depth)}`);
        
        // Calculate the cosine similarity between the two nodes
        const similarity = cosineSimilarity(node1.vector, node2.vector);
        console.log(`[Service findSlice] Pair similarity: ${similarity.toFixed(4)}`);
        
        // Calculate midpoint
        const midpointVector = this.calculateMidpoint(node1.vector, node2.vector);
        console.log(`[Service findSlice] Calculated midpoint vector.`);
        
        // Find nearest word to the midpoint
        console.log(`[Service findSlice] Finding neighbors for midpoint... Excluded: ${Array.from(visited)}`);
        const midpointNeighbors = await this.findVectorNeighbors(
          midpointVector, 
          numResults, 
          Array.from(visited)
        );
        console.log(`[Service findSlice] Found ${midpointNeighbors.length} neighbors for midpoint.`);
        
        if (midpointNeighbors.length === 0) {
          console.log(`[Service findSlice] No valid neighbors found, skipping pair.`);
          continue;
        }
        
        // Get the word closest to the midpoint
        const midpointWord = midpointNeighbors[0].word;
        visited.add(midpointWord);
        
        // Get vector for the midpoint word
        const midpointWordVector = await this.getWordVector(midpointWord);
        
        if (!midpointWordVector) {
           console.error(`[Service findSlice] Failed to get vector for midpoint word "${midpointWord}", skipping pair.`);
           visited.delete(midpointWord); // Allow retry if encountered differently
           continue;
        }
        console.log(`[Service findSlice] Got vector for midpoint word: "${midpointWord}"`);
        
        // Record this midpoint
        const midpointNode = {
          word: midpointWord,
          vector: midpointWordVector,
          depth: Math.max(node1.depth, node2.depth) + 1,
          fromWords: [node1.word, node2.word],
          path: [...new Set([...node1.path, ...node2.path, midpointWord])]
        };
        
        slicePoints.push({
          word: midpointWord,
          isMainPoint: true,
          depth: midpointNode.depth,
          index: currentIndex++,
          fromWords: [node1.word, node2.word],
          path: midpointNode.path,
          similarity: similarity
        });
        console.log(`[Service findSlice] Added main midpoint: "${midpointWord}" at index ${currentIndex - 1}`);
        
        // Add secondary neighbors
        const addedNeighbors = [];
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
            addedNeighbors.push(neighbor.word);
          }
        });
        if(addedNeighbors.length > 0) {
           console.log(`[Service findSlice] Added secondary neighbors: ${addedNeighbors.join(', ')} at index ${currentIndex - 1}`);
        }
        
        // Add new pairs to explore
        if (midpointNode.depth < maxDepth) {
          console.log(`[Service findSlice] Queueing new pairs for depth ${midpointNode.depth + 1}`);
          nodePairs.push({
            node1: node1,
            node2: midpointNode
          });
          
          nodePairs.push({
            node1: midpointNode,
            node2: node2
          });
        } else {
          console.log(`[Service findSlice] Max depth (${maxDepth}) reached for this branch.`);
        }
      }
      console.log(`[Service findSlice] Loop finished. Total points: ${slicePoints.length}`);
      
      return {
        word1,
        word2,
        similarityThreshold,
        totalPoints: slicePoints.length,
        slicePoints
      };
    } catch (error) {
      console.error(`[Service findSlice] Error during slice calculation between '${word1}' and '${word2}':`, error);
      // Log more details if available
      if (error.response) {
        console.error(`[Service findSlice] Error Response:`, error.response.data);
      }
      throw error; // Re-throw error for the route handler
    }
  }
}

// Create a singleton instance
const vectorService = new VectorService();

export default vectorService; 