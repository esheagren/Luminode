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

  /**
   * Find a linear interpolation path between two words
   * Samples evenly-spaced points along the geometric line between two word vectors
   * @param {string} word1 - Starting word
   * @param {string} word2 - Ending word
   * @param {number} numSteps - Number of interpolation steps (default: 10)
   * @returns {Promise<Object>} Path results with interpolated points
   */
  async findLinearPath(word1, word2, numSteps = 10) {
    console.log(`[Service findLinearPath] Starting for "${word1}" and "${word2}" with ${numSteps} steps`);

    // Validate numSteps to prevent resource exhaustion
    numSteps = Math.max(1, Math.min(numSteps, 100));

    try {
      await this.initialize();

      const vector1 = await this.getWordVector(word1);
      const vector2 = await this.getWordVector(word2);

      if (!vector1 || !vector2) {
        throw new Error(`One or both word vectors not found: '${word1}', '${word2}'`);
      }

      const { cosineSimilarity } = await import('../utils/mathHelpers.js');

      const pathPoints = [];
      const visited = new Set();

      // Add starting endpoint
      pathPoints.push({
        word: word1,
        t: 0,
        similarity: 1.0,
        similarityToLine: 1.0
      });
      visited.add(word1);

      // Search for intermediate points only (exclude endpoints)
      for (let i = 1; i < numSteps; i++) {
        const t = i / numSteps;

        // Interpolate: v = v1 * (1-t) + v2 * t
        const interpolated = vector1.map((v, idx) => v * (1 - t) + vector2[idx] * t);

        // Find nearest word to the interpolated point (exclude visited words and endpoint)
        const excludeWords = [...Array.from(visited), word2];
        const neighbors = await this.findVectorNeighbors(interpolated, 1, excludeWords);

        if (neighbors.length > 0) {
          const nearestWord = neighbors[0].word;
          const nearestVector = await this.getWordVector(nearestWord);

          visited.add(nearestWord);
          pathPoints.push({
            word: nearestWord,
            t: t,
            similarity: neighbors[0].score,
            similarityToLine: nearestVector ? cosineSimilarity(interpolated, nearestVector) : null
          });
        }
      }

      // Add ending endpoint
      pathPoints.push({
        word: word2,
        t: 1.0,
        similarity: 1.0,
        similarityToLine: 1.0
      });

      console.log(`[Service findLinearPath] Found ${pathPoints.length} points along path`);

      return {
        word1,
        word2,
        numSteps,
        pathPoints
      };
    } catch (error) {
      console.error(`[Service findLinearPath] Error during calculation between '${word1}' and '${word2}':`, error);
      if (error.response) {
        console.error(`[Service findLinearPath] Error Response:`, error.response.data);
      }
      throw error;
    }
  }

  /**
   * Find a greedy path between two words by hopping through semantic neighbors
   * At each step, picks the unvisited neighbor closest to the target word
   * @param {string} word1 - Starting word
   * @param {string} word2 - Target word
   * @param {number} maxHops - Maximum number of hops (default: 20)
   * @returns {Promise<Object>} Path results with hop points
   */
  async findGreedyPath(word1, word2, maxHops = 20) {
    console.log(`[Service findGreedyPath] Starting for "${word1}" to "${word2}" with max ${maxHops} hops`);

    // Validate maxHops to prevent resource exhaustion
    maxHops = Math.max(1, Math.min(maxHops, 50));

    try {
      await this.initialize();

      const { cosineSimilarity } = await import('../utils/mathHelpers.js');

      const targetVector = await this.getWordVector(word2);
      let currentWord = word1;
      let currentVector = await this.getWordVector(word1);

      if (!currentVector || !targetVector) {
        throw new Error(`One or both word vectors not found: '${word1}', '${word2}'`);
      }

      let previousBestSimilarity = cosineSimilarity(currentVector, targetVector);

      const pathPoints = [{
        word: word1,
        hop: 0,
        similarityToTarget: previousBestSimilarity
      }];
      // Don't add word2 to visited - we want to be able to find it as a neighbor
      const visited = new Set([word1]);

      for (let hop = 1; hop <= maxHops; hop++) {
        // Get neighbors of current word
        const neighbors = await this.findWordNeighbors(currentWord, 10);

        // Find unvisited neighbor closest to target
        let bestNeighbor = null;
        let bestSimilarity = -Infinity;

        for (const neighbor of neighbors) {
          if (visited.has(neighbor.word)) continue;

          const neighborVector = await this.getWordVector(neighbor.word);
          if (!neighborVector) continue;

          const simToTarget = cosineSimilarity(neighborVector, targetVector);

          if (simToTarget > bestSimilarity) {
            bestSimilarity = simToTarget;
            bestNeighbor = { word: neighbor.word, vector: neighborVector };
          }
        }

        if (!bestNeighbor) {
          console.log(`[Service findGreedyPath] No unvisited neighbors at hop ${hop}`);
          break;
        }

        // Check if we reached the target
        if (bestNeighbor.word === word2) {
          console.log(`[Service findGreedyPath] Reached target at hop ${hop}`);
          pathPoints.push({
            word: word2,
            hop: hop,
            similarityToTarget: 1.0
          });
          return {
            word1,
            word2,
            maxHops,
            pathPoints
          };
        }

        // Check if we're making progress (prevent getting stuck in local maximum)
        if (bestSimilarity <= previousBestSimilarity * 0.999) {
          console.log(`[Service findGreedyPath] No improvement at hop ${hop}, terminating`);
          break;
        }

        visited.add(bestNeighbor.word);
        pathPoints.push({
          word: bestNeighbor.word,
          hop: hop,
          similarityToTarget: bestSimilarity
        });

        currentWord = bestNeighbor.word;
        currentVector = bestNeighbor.vector;
        previousBestSimilarity = bestSimilarity;

        // Early termination if very close to target
        if (bestSimilarity > 0.95) {
          console.log(`[Service findGreedyPath] Early termination - high similarity (${bestSimilarity})`);
          break;
        }
      }

      // Add endpoint (target word) if not already reached
      pathPoints.push({
        word: word2,
        hop: pathPoints.length,
        similarityToTarget: 1.0
      });

      console.log(`[Service findGreedyPath] Found path with ${pathPoints.length} points`);

      return {
        word1,
        word2,
        maxHops,
        pathPoints
      };
    } catch (error) {
      console.error(`[Service findGreedyPath] Error during calculation from '${word1}' to '${word2}':`, error);
      if (error.response) {
        console.error(`[Service findGreedyPath] Error Response:`, error.response.data);
      }
      throw error;
    }
  }
}

// Create a singleton instance
const vectorService = new VectorService();

export default vectorService; 