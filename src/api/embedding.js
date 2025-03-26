import axios from 'axios';
import { getApiServerUrl, getApiUrl } from '../utils/environment';

// Log the determined server URL
console.log('API Service using server URL:', getApiServerUrl());

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
    
    const response = await axios.post(getApiUrl('/api/findNeighbors'), {
      word,
      numResults,
      useExactSearch
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error finding neighbors:', error);
    throw error;
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
    
    const response = await axios.post(getApiUrl('/api/findMidpoint'), {
      word1,
      word2,
      numResults,
      recursionDepth,
      useExactSearch
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error finding midpoint:', error);
    throw error;
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
    
    const response = await axios.post(getApiUrl('/api/findAnalogy'), {
      word1,
      word2,
      word3,
      numResults,
      useExactSearch
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error finding analogy:', error);
    throw error;
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
    const response = await axios.post(getApiUrl('/api/getVectorCoordinates'), {
      words,
      dimensions
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting vector coordinates:', error);
    throw error;
  }
};

/**
 * Check if a word exists and get its vector
 * @param {string} word - Word to check
 * @returns {Promise<Object>} - Word info including vector
 */
export const checkWord = async (word) => {
  try {
    const response = await axios.post(getApiUrl('/api/checkWord'), { word });
    return response.data.data;
  } catch (error) {
    console.error(`Error checking word "${word}":`, error);
    throw error;
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