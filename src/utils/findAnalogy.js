import axios from 'axios';
import { getApiUrl } from '../utils/environment';

/**
 * Finds words that complete an analogy: word1 is to word2 as word3 is to ?
 * @param {string} word1 - First word in the analogy
 * @param {string} word2 - Second word in the analogy
 * @param {string} word3 - Third word in the analogy
 * @param {number} numResults - Number of results to return
 * @returns {Promise<Object>} Promise resolving to analogy results
 */
export const findAnalogy = async (word1, word2, word3, numResults = 5) => {
  try {
    console.log(`Sending analogy request to api/findAnalogy`);
    
    const response = await axios.post(getApiUrl('/api/findAnalogy'), {
      word1,
      word2,
      word3,
      numResults,
      useExactSearch: true
    });
    
    if (response && response.data && response.data.data) {
      return response.data;
    } else {
      return { error: 'Invalid response from the server', data: null };
    }
  } catch (error) {
    console.error('Error finding analogy:', error);
    return { 
      error: error.message || 'Failed to find analogy',
      data: null
    };
  }
}; 