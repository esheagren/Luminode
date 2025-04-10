// Import from essay data
import { availableEssays } from './essayData';

// Define static essay content for raw text fallback if needed
const essayContentMap = {
  'Vectors: Meaning in AI Systems': "This content would be loaded separately if needed.",
  'The Why and How of Vector Embeddings': "This content would be loaded separately if needed.", // Keep for backward compatibility
  'Exploring and Visualizing Vector Embeddings': "This content would be loaded separately if needed.",
  'Vector Databases and Large-Scale Retrieval': "This content would be loaded separately if needed."
};

/**
 * Get essay content by title
 * @param {string} title - The title of the essay
 * @returns {string} The content of the essay
 */
export function getEssayContent(title) {
  const content = essayContentMap[title];
  
  if (!content) {
    console.error(`Essay content not found for title: ${title}`);
    return 'Essay content not found.';
  }
  
  return content;
}

/**
 * Get list of available essays
 * @returns {string[]} Array of essay titles
 */
export function getAvailableEssays() {
  // If we have structured data available, use those essay titles
  if (availableEssays && availableEssays.length > 0) {
    return availableEssays;
  }
  // Otherwise fall back to the essayContentMap
  return Object.keys(essayContentMap);
} 