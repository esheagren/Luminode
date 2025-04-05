// Import essay files
import introduction from './text/Introduction.txt?raw';
import vectorBasics from './text/Essay1.txt?raw';
import transformerModels from './text/Essay2.txt?raw';
import similarityMetrics from './text/Essay3.txt?raw';
import vectorDatabases from './text/Essay4.txt?raw';
import dimensionReduction from './text/Essay5.txt?raw';
import conclusion from './text/Essay6.txt?raw';

// Map of essay titles to their content
const essayContentMap = {
  'Introduction': introduction,
  'Vector Basics': vectorBasics,
  'Transformer Models': transformerModels,
  'Similarity & Distance': similarityMetrics,
  'Vector Databases': vectorDatabases,
  'Visualization Techniques': dimensionReduction,
  'Conclusion': conclusion
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
  return Object.keys(essayContentMap);
} 