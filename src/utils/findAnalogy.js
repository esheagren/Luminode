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
    const apiUrl = getApiUrl('/api/findAnalogy');
    console.log(`Sending analogy request to ${apiUrl} with words: ${word1}, ${word2}, ${word3}`);
    
    // Log the environment API URL for debugging
    console.log('Using API server URL:', getApiUrl(''));
    
    const response = await axios.post(apiUrl, {
      word1,
      word2,
      word3,
      numResults,
      useExactSearch: true
    });
    
    if (response && response.data && response.data.data) {
      console.log('Received analogy response:', response.data);
      return response.data;
    } else {
      console.error('Invalid response structure:', response.data);
      return { 
        error: 'Invalid response from the server', 
        data: null,
        details: response.data 
      };
    }
  } catch (error) {
    console.error('Error finding analogy:', error);
    
    // Enhanced error details
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? JSON.parse(error.config?.data) : null
      }
    };
    
    console.log('Analogy error details:', errorDetails);
    
    return { 
      error: error.response?.data?.error || error.message || 'Failed to find analogy',
      data: null,
      details: errorDetails
    };
  }
}; 