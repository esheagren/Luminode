import axios from 'axios';
import { getApiServerUrl, getApiUrl, logEnvironmentInfo } from '../utils/environment';

// Log environment information for debugging
logEnvironmentInfo();

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: getApiServerUrl(),
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    // Log the full URL being requested
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('API Request configuration error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Create a more detailed error message for debugging
    const errorInfo = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    };
    
    console.error('API Request failed:', errorInfo);
    
    return Promise.reject(error);
  }
);

/**
 * Find nearest neighbors for a word
 * @param {string} word - Word to find neighbors for
 * @param {number} numResults - Number of neighbors to return
 * @param {boolean} useExactSearch - Whether to use exact search (slower but more accurate)
 * @returns {Promise<Object>} - Nearest neighbors
 */
export const findNeighbors = async (
  word, 
  numResults = 5, 
  useExactSearch = false
) => {
  try {
    console.log(`Finding neighbors for "${word}" with ${useExactSearch ? 'exact' : 'approximate'} search`);
    
    const response = await apiClient.post('/api/findNeighbors', {
      word,
      numResults,
      useExactSearch
    });
    
    return response.data;
  } catch (error) {
    console.error('Error finding neighbors:', error);
    return {
      error: 'Failed to find neighbors',
      message: error.message,
      data: { word, nearestWords: [] }
    };
  }
};

/**
 * Find midpoint between two words and nearest words to that midpoint
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @param {number} numResults - Number of neighbors to return
 * @param {number} recursionDepth - How many levels of midpoints to find
 * @param {boolean} useExactSearch - Whether to use exact search
 * @returns {Promise<Object>} - Midpoint search results
 */
export const findMidpoint = async (
  word1,
  word2,
  numResults = 5,
  recursionDepth = 0,
  useExactSearch = true
) => {
  try {
    console.log(`Finding midpoint between "${word1}" and "${word2}" with ${useExactSearch ? 'exact' : 'approximate'} search`);
    
    const response = await apiClient.post('/api/findMidpoint', {
      word1,
      word2,
      numResults,
      recursionDepth,
      useExactSearch
    });
    
    return response.data;
  } catch (error) {
    console.error('Error finding midpoint:', error);
    return {
      error: 'Failed to find midpoint',
      message: error.message,
      data: {
        primaryMidpoint: {
          word1, word2,
          nearestWords: []
        }
      }
    };
  }
};

/**
 * Find words that complete an analogy: word1 is to word2 as word3 is to ?
 * @param {string} word1 - First word in the analogy
 * @param {string} word2 - Second word in the analogy
 * @param {string} word3 - Third word in the analogy
 * @param {number} numResults - Number of results to return
 * @param {boolean} useExactSearch - Whether to use exact search
 * @returns {Promise<Object>} - Object containing analogy formula and results
 */
export const findAnalogy = async (
  word1,
  word2,
  word3,
  numResults = 5,
  useExactSearch = true
) => {
  try {
    console.log(`Finding analogy ${word1}:${word2}::${word3}:? with ${useExactSearch ? 'exact' : 'approximate'} search`);
    
    const response = await apiClient.post('/api/findAnalogy', {
      word1,
      word2,
      word3,
      numResults,
      useExactSearch
    });
    
    return response.data;
  } catch (error) {
    console.error('Error finding analogy:', error);
    return {
      error: 'Failed to calculate analogy',
      message: error.message,
      data: {
        analogy: `${word1} is to ${word2} as ${word3} is to ?`,
        results: []
      }
    };
  }
};

/**
 * Get vector coordinates for visualization
 * @param {Array<string>} words - Words to get coordinates for
 * @param {number} dimensions - Number of dimensions (2 or 3)
 * @returns {Promise<Array>} - Coordinates for visualization
 */
export const getVectorCoordinates = async (
  words,
  dimensions = 2
) => {
  try {
    console.log(`Getting coordinates for ${words.length} words in ${dimensions}D`);
    
    // Create a copy of words array to avoid modifying the original
    const wordsToProcess = [...words].slice(0, 20); // Limit to 20 words max
    
    const response = await apiClient.post('/api/getVectorCoordinates', { 
      words: wordsToProcess, 
      dimensions 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting vector coordinates:', error);
    
    if (error.response?.status === 500 && error.response?.data?.isPineconeError) {
      return {
        error: 'Pinecone connection failed. Please check your API key configuration.',
        message: error.response.data.message || 'Pinecone service error',
        data: [],
        invalidWords: words
      };
    }
    
    // Return a standardized error response that the UI can handle
    return {
      error: 'Failed to calculate vector coordinates',
      message: error.message,
      data: [],
      invalidWords: words
    };
  }
};

/**
 * Check if a word exists and get its vector
 * @param {string} word - Word to check
 * @returns {Promise<Object>} - Word info including vector
 */
export const checkWord = async (word) => {
  try {
    console.log(`Checking word: "${word}"`);
    const response = await apiClient.post('/api/checkWord', { word });
    return response.data;
  } catch (error) {
    console.error(`Error checking word "${word}":`, error.message);
    // Return a standardized error response
    return {
      success: false,
      error: `Failed to check word: ${error.message}`,
      word: {
        exists: false,
        vector: null
      }
    };
  }
};

// Export all functions as a unified API
export default {
  findNeighbors,
  findMidpoint,
  findAnalogy,
  getVectorCoordinates,
  checkWord
}; 