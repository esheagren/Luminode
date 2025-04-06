// Import essay files
import vectorBasics from './text/Essay1.txt?raw';
import transformerModels from './text/Essay2.txt?raw';
import similarityMetrics from './text/Essay3.txt?raw';
import { availableEssays } from './essayData';

// Map of essay titles to their content
const essayContentMap = {
  'The Why and How of Vector Embeddings': vectorBasics,
  'Exploring and Visualizing Vector Embeddings': transformerModels,
  'Vector Databases and Large-Scale Retrieval': similarityMetrics
  // Add more essays as they become available
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