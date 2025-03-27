// Array of 20 words for the suggested words section
const suggestedWords = [
  "cat",
  "dog",
  "book",
  "tree",
  "house",
  "river",
  "ocean",
  "mountain",
  "happy",
  "sad",
  "love",
  "time",
  "money",
  "work",
  "play",
  "food",
  "water",
  "music",
  "friend",
  "family"
];

/**
 * Get random words from the suggested words list
 * @param {number} count - Number of words to return
 * @param {string[]} excludeWords - Words to exclude from results
 * @returns {string[]} - Array of random words
 */
export const getRandomSuggestions = (count = 8, excludeWords = []) => {
  // Create a copy of the array and filter out excluded words
  const availableWords = suggestedWords.filter(word => !excludeWords.includes(word));
  
  // If we need more words than available, just return all available words
  if (count >= availableWords.length) {
    return [...availableWords];
  }
  
  // Shuffle array and take first 'count' elements
  return [...availableWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

export default suggestedWords; 