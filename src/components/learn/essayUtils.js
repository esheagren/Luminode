// Import essay files
import introduction from './text/Introduction.txt?raw';
import essay1 from './text/Essay1.txt?raw';

// Map of essay titles to their content
const essayContentMap = {
  'Introduction': introduction,
  'Essay1': essay1,
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