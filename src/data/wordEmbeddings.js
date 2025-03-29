import suggestedWords from './suggestedWords';

/**
 * Pre-computed embeddings for suggested words
 * Format: { word: number[] }
 * Example: { "cat": [0.1, 0.2, ...] }
 */
export const wordEmbeddings = {
  // This will be populated with actual embeddings
  // We'll need to run a script to generate these from Pinecone
};

/**
 * Check if a word has a pre-computed embedding
 * @param {string} word - Word to check
 * @returns {boolean} Whether the word has a pre-computed embedding
 */
export const hasPrecomputedEmbedding = (word) => {
  return word in wordEmbeddings;
};

/**
 * Get the pre-computed embedding for a word
 * @param {string} word - Word to get embedding for
 * @returns {number[] | null} The embedding vector or null if not found
 */
export const getWordEmbedding = (word) => {
  return wordEmbeddings[word] || null;
};

/**
 * Create a word result object from a pre-computed embedding
 * @param {string} word - The word
 * @returns {Object | null} Word result object or null if not found
 */
export const createWordResult = (word) => {
  const vector = getWordEmbedding(word);
  if (!vector) return null;
  
  return {
    word,
    exists: true,
    vector
  };
}; 