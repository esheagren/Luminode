import axios from 'axios';
import { getApiUrl } from './environment';
import { euclideanDistance } from './vectorUtils';

/**
 * Finds a slice (cross-section) through the vector space using recursive midpoint calculations
 * 
 * @param {string} word1 - First word (starting point)
 * @param {string} word2 - Second word (ending point)
 * @param {number} numResults - Number of results per midpoint
 * @param {number} maxDepth - Maximum recursion depth to prevent infinite loops
 * @returns {Promise<Object>} - Slice results
 */
export const findSlice = async (
  word1,
  word2,
  numResults = 5,
  maxDepth = 20
) => {
  try {
    console.log(`Finding slice between "${word1}" and "${word2}"`);
    
    // Validate input
    if (!word1 || !word2) {
      console.error('Missing required parameters:', { word1, word2 });
      throw new Error('Both words are required for slice calculation');
    }
    
    const apiUrl = getApiUrl('/api/findSlice');
    console.log('API URL:', apiUrl);
    
    // Log detailed request information for debugging
    console.log('Sending request with data:', {
      url: apiUrl,
      method: 'POST',
      data: { word1, word2, numResults, maxDepth }
    });
    
    const response = await axios.post(apiUrl, {
      word1,
      word2,
      numResults,
      maxDepth
    });
    
    if (response.data && response.data.data) {
      console.log('Slice API response:', response.data);
      return response.data.data;
    }
    
    console.error('Invalid API response:', response.data);
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Error finding slice:', error);
    
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
      
      // Better error message for 404 errors
      if (error.response.status === 404) {
        if (error.response.data && error.response.data.error) {
          throw new Error(`Server error (404): ${error.response.data.error}`);
        } else {
          throw new Error('API endpoint not found (404). The server may not be running or the endpoint may not be registered.');
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from server. The server may be down or unreachable.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    // Add detailed debug info to the error
    const enhancedError = new Error(`Failed to find slice: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.requestDetails = {
      url: apiUrl,
      data: { word1, word2, numResults, maxDepth }
    };
    throw enhancedError;
  }
};

/**
 * Process slice API response into visualization-ready format
 * 
 * @param {Object} results - Slice results from API
 * @param {string} word1 - First source word
 * @param {string} word2 - Second source word
 * @returns {Object} - Formatted slice cluster for visualization
 */
export const processSliceResults = (results, word1, word2) => {
  // Process results for visualization
  const sliceCluster = {
    type: 'slice',
    source: {
      word1,
      word2
    },
    words: []
  };
  
  // Add endpoint words
  sliceCluster.words.push({
    word: word1,
    isSlice: true,
    isEndpoint: true,
    sliceLevel: 'endpoint'
  });
  
  sliceCluster.words.push({
    word: word2,
    isSlice: true,
    isEndpoint: true,
    sliceLevel: 'endpoint'
  });
  
  // Add slice points
  if (results.slicePoints && results.slicePoints.length > 0) {
    results.slicePoints.forEach((point, index) => {
      const isMainPoint = point.isMainPoint === true;
      // The main points are the ones along the direct path
      // Other points are neighbors of those main points
      
      sliceCluster.words.push({
        word: point.word,
        distance: point.distance || 0,
        isSlice: true,
        isMainPoint: isMainPoint,
        sliceLevel: isMainPoint ? 'main' : 'neighbor',
        sliceIndex: point.index || index,
        sliceDepth: point.depth || 0,
        sliceSource: {
          fromWords: point.fromWords || [],
          path: point.path || []
        }
      });
    });
  }
  
  return sliceCluster;
}; 