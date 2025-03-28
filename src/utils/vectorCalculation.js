/**
 * Utility functions for vector calculations and midpoint finding
 */
import axios from 'axios';
import { getApiUrl } from './environment';

/**
 * Calculate the midpoint between two vectors
 * @param {number[]} vector1 - First vector
 * @param {number[]} vector2 - Second vector
 * @returns {number[]} Midpoint vector
 */
export const calculateMidpoint = (vector1, vector2) => {
  if (!vector1 || !vector2 || vector1.length !== vector2.length) {
    return null;
  }

  return vector1.map((val, i) => (val + vector2[i]) / 2);
};

/**
 * Finds the midpoint between two words
 * 
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @param {number} numResults - Number of results to return
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
    console.log(`Finding midpoint between "${word1}" and "${word2}"`);
    
    const response = await axios.post(getApiUrl('/api/findMidpoint'), {
      word1,
      word2,
      numResults,
      recursionDepth,
      useExactSearch
    });
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Error finding midpoint:', error);
    throw error;
  }
};

/**
 * Process midpoint API response into visualization-ready format
 * 
 * @param {Object} results - Midpoint results from API
 * @param {string} word1 - First source word
 * @param {string} word2 - Second source word
 * @param {number} recursionDepth - Recursion depth used
 * @returns {Object} - Formatted midpoint cluster for visualization
 */
export const processMidpointResults = (results, word1, word2, recursionDepth = 0) => {
  // Process results for visualization
  const midpointCluster = {
    type: 'midpoint',
    source: {
      word1,
      word2,
      recursionDepth
    },
    words: []
  };
  
  // Add primary midpoint
  const primaryMidpoint = results.primaryMidpoint;
  
  // Ensure we have nearestWords in the expected format
  if (!primaryMidpoint.nearestWords || !Array.isArray(primaryMidpoint.nearestWords)) {
    throw new Error('No midpoint results found');
  }
  
  // Add each primary midpoint word to the cluster
  primaryMidpoint.nearestWords.forEach((item, index) => {
    // Handle both score and distance field names
    const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
    
    midpointCluster.words.push({
      word: item.word,
      distance: distanceValue, 
      isMidpoint: true,
      midpointLevel: 'primary',
      midpointSource: {
        fromWords: [word1, word2],
        isPrimaryResult: index === 0
      }
    });
  });
  
  // Add secondary midpoints if available
  if (results.secondaryMidpoints && results.secondaryMidpoints.length > 0) {
    results.secondaryMidpoints.forEach(midpoint => {
      if (!midpoint.nearestWords || !Array.isArray(midpoint.nearestWords)) {
        console.warn('Invalid secondary midpoint structure:', midpoint);
        return;
      }
      
      midpoint.nearestWords.forEach((item, index) => {
        const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
        
        midpointCluster.words.push({
          word: item.word,
          distance: distanceValue,
          isMidpoint: true,
          midpointLevel: 'secondary',
          midpointSource: {
            fromWords: midpoint.endpoints || [word1, word2],
            isPrimaryResult: index === 0
          }
        });
      });
    });
  }
  
  // Add tertiary midpoints if available
  if (results.tertiaryMidpoints && results.tertiaryMidpoints.length > 0) {
    results.tertiaryMidpoints.forEach(midpoint => {
      if (!midpoint.nearestWords || !Array.isArray(midpoint.nearestWords)) {
        console.warn('Invalid tertiary midpoint structure:', midpoint);
        return;
      }
      
      midpoint.nearestWords.forEach((item, index) => {
        const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
        
        midpointCluster.words.push({
          word: item.word,
          distance: distanceValue,
          isMidpoint: true,
          midpointLevel: 'tertiary',
          midpointSource: {
            fromWords: midpoint.endpoints || [word1, word2],
            isPrimaryResult: index === 0
          }
        });
      });
    });
  }
  
  return midpointCluster;
}; 