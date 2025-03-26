const embeddingService = require('../../../server/services/embeddingService.cjs');
const { performPCA } = require('../../../server/utils/mathHelpers.cjs');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { words, dimensions = 2 } = req.body;
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Invalid words array' });
    }
    
    // Validate dimensions
    const projectionDimensions = dimensions === 3 ? 3 : 2;
    
    // Get vectors for all words
    const vectors = [];
    const invalidWords = [];
    
    for (const word of words) {
      const vector = embeddingService.getWordVector(word);
      if (vector) {
        vectors.push({ word, vector });
      } else {
        invalidWords.push(word);
      }
    }
    
    if (vectors.length === 0) {
      return res.status(404).json({ 
        error: 'None of the provided words were found in the vocabulary',
        invalidWords
      });
    }
    
    // Extract just the vectors for PCA
    const vectorsOnly = vectors.map(item => item.vector);
    
    // Perform PCA to get coordinates
    const coordinates = performPCA(vectorsOnly, projectionDimensions);
    
    // Combine words with their coordinates
    const result = vectors.map((item, index) => {
      const point = {
        word: item.word,
        truncatedVector: `[${item.vector.slice(0, 5).join(', ')}...]`,
        // Include full vector for similarity calculations
        fullVector: item.vector
      };
      
      // Add coordinates based on dimensions
      if (projectionDimensions === 2) {
        point.x = coordinates[index][0];
        point.y = coordinates[index][1];
      } else {
        point.x = coordinates[index][0];
        point.y = coordinates[index][1];
        point.z = coordinates[index][2];
      }
      
      return point;
    });
    
    return res.status(200).json({
      message: `Vector coordinates calculated successfully in ${projectionDimensions}D`,
      data: result,
      dimensions: projectionDimensions,
      invalidWords: invalidWords.length > 0 ? invalidWords : undefined
    });
  } catch (error) {
    console.error('Error calculating vector coordinates:', error);
    return res.status(500).json({ error: 'Failed to calculate vector coordinates' });
  }
} 