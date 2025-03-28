import express from 'express';
import vectorService from '../services/vectorService.js';
import { performPCA } from '../utils/mathHelpers.js';

const router = express.Router();

// Endpoint to check if words exist and get their vectors
// router.post('/submit', async (req, res) => {
//   console.log('Received request to /submit with body:', req.body);
//   try {
//     const { word1, word2 } = req.body;
    
//     // Validate input
//     if (!word1 || !word2) {
//       return res.status(400).json({ error: 'Both words are required' });
//     }
    
//     // Make sure embeddings are loaded
//     await embeddingService.loadEmbeddings();
    
//     // Check if words exist in embeddings
//     const word1Exists = embeddingService.wordExists(word1);
//     const word2Exists = embeddingService.wordExists(word2);
    
//     // Get vectors if words exist
//     const vector1 = word1Exists ? embeddingService.getWordVector(word1) : null;
//     const vector2 = word2Exists ? embeddingService.getWordVector(word2) : null;
    
//     // Calculate midpoint if both vectors exist
//     let midpoint = null;
//     if (vector1 && vector2) {
//       midpoint = embeddingService.calculateMidpoint(vector1, vector2);
//     }
    
//     // For display, truncate vectors to 5 elements
//     const truncateVector = (vec) => {
//       if (!vec) return null;
//       const firstFive = vec.slice(0, 5);
//       return `[${firstFive.join(', ')}...]`;
//     };
    
//     return res.status(200).json({
//       success: true,
//       data: {
//         word1: {
//           exists: word1Exists,
//           vector: vector1 ? truncateVector(vector1) : null
//         },
//         word2: {
//           exists: word2Exists,
//           vector: vector2 ? truncateVector(vector2) : null
//         },
//         midpoint: midpoint ? truncateVector(midpoint) : null
//       },
//       message: generateResponseMessage(word1, word2, word1Exists, word2Exists)
//     });
    
//   } catch (error) {
//     console.error('Error processing form submission:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// Endpoint to get vector coordinates for visualization
router.post('/getVectorCoordinates', async (req, res) => {
  try {
    const { words, dimensions = 2 } = req.body;
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Invalid words array' });
    }
    
    // Validate dimensions
    const projectionDimensions = dimensions === 3 ? 3 : 2;
    
    // Use the vector service to get coordinates
    const result = await vectorService.getVectorCoordinates(words, projectionDimensions);
    
    if (result.words.length === 0) {
      return res.status(404).json({ 
        error: 'None of the provided words were found in the vocabulary',
        invalidWords: words
      });
    }
    
    // Format the response
    const formattedResult = result.words.map((word, index) => {
      const vector = result.vectors ? result.vectors[index] : null;
      const point = {
        word: word,
        truncatedVector: vector ? `[${vector.slice(0, 5).join(', ')}...]` : undefined,
        fullVector: vector
      };
      
      // Add coordinates based on dimensions
      if (projectionDimensions === 2) {
        point.x = result.coordinates[index][0];
        point.y = result.coordinates[index][1];
      } else {
        point.x = result.coordinates[index][0];
        point.y = result.coordinates[index][1];
        point.z = result.coordinates[index][2];
      }
      
      return point;
    });
    
    const invalidWords = words.filter(word => !result.words.includes(word));
    
    res.json({
      message: `Vector coordinates calculated successfully in ${projectionDimensions}D`,
      data: formattedResult,
      dimensions: projectionDimensions,
      invalidWords: invalidWords.length > 0 ? invalidWords : undefined
    });
  } catch (error) {
    console.error('Error calculating vector coordinates:', error);
    res.status(500).json({ error: 'Failed to calculate vector coordinates' });
  }
});

// Endpoint to find nearest neighbors for a word
router.post('/findNeighbors', async (req, res) => {
  try {
    const { word, numResults = 5, useExactSearch = false } = req.body;
    
    // Validate input
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }
    
    // Check if word exists
    const wordExists = await vectorService.wordExists(word);
    
    if (!wordExists) {
      return res.status(404).json({ 
        error: `Word "${word}" not found in embeddings` 
      });
    }
    
    // Find nearest neighbors
    const neighbors = await vectorService.findWordNeighbors(word, numResults);
    
    res.json({
      message: 'Nearest neighbors found successfully',
      data: {
        word,
        searchMode: useExactSearch ? 'exact' : 'approximate',
        nearestWords: neighbors
      }
    });
    
  } catch (error) {
    console.error('Error finding nearest neighbors:', error);
    res.status(500).json({ error: 'Failed to find nearest neighbors: ' + error.message });
  }
});

// Endpoint to check if a word exists and get its vector
router.post('/checkWord', async (req, res) => {
  try {
    const { word } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }
    
    // Check if word exists
    const wordExists = await vectorService.wordExists(word);
    
    // Get vector if word exists
    const vector = wordExists ? await vectorService.getWordVector(word) : null;
    
    // For display, truncate vector to 5 elements
    const truncateVector = (vec) => {
      if (!vec) return null;
      const firstFive = vec.slice(0, 5);
      return `[${firstFive.join(', ')}...]`;
    };
    
    return res.status(200).json({
      success: true,
      data: {
        word: {
          exists: wordExists,
          vector: vector ? truncateVector(vector) : null
        }
      },
      message: wordExists ? 
        `Word "${word}" found! Vector retrieved successfully.` : 
        `Word "${word}" was not found in the embeddings.`
    });
    
  } catch (error) {
    console.error('Error checking word:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to find midpoint between two words
router.post('/findMidpoint', async (req, res) => {
  try {
    const { word1, word2, numResults = 5, recursionDepth = 0, useExactSearch = true } = req.body;
    
    // Validate input
    if (!word1 || !word2) {
      return res.status(400).json({ error: 'Both words are required' });
    }
    
    // Check if words exist
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    
    if (!word1Exists || !word2Exists) {
      const message = generateResponseMessage(word1, word2, word1Exists, word2Exists);
      return res.status(404).json({ error: message });
    }
    
    // Find midpoint
    const midpointResult = await vectorService.findMidpoint(word1, word2, numResults);
    
    // Format response
    const results = {
      primaryMidpoint: {
        word1,
        word2,
        nearestWords: midpointResult.neighbors
      },
      searchMode: useExactSearch ? 'exact' : 'approximate',
      secondaryMidpoints: [],
      tertiaryMidpoints: []
    };
    
    // Include recursive midpoint searches if requested
    if (recursionDepth > 0) {
      // ... implement secondary and tertiary midpoints as in your existing code ...
    }
    
    res.json({
      message: 'Midpoint search completed successfully',
      data: results
    });
    
  } catch (error) {
    console.error('Error finding midpoint:', error);
    res.status(500).json({ error: 'Failed to find midpoint: ' + error.message });
  }
});

// Endpoint to find analogy completions
router.post('/findAnalogy', async (req, res) => {
  try {
    const { word1, word2, word3, numResults = 5, useExactSearch = true } = req.body;
    
    // Validate input
    if (!word1 || !word2 || !word3) {
      return res.status(400).json({ error: 'All three words are required' });
    }
    
    // Check if words exist
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    const word3Exists = await vectorService.wordExists(word3);
    
    if (!word1Exists || !word2Exists || !word3Exists) {
      let missingWords = [];
      if (!word1Exists) missingWords.push(word1);
      if (!word2Exists) missingWords.push(word2);
      if (!word3Exists) missingWords.push(word3);
      
      return res.status(404).json({ 
        error: `Words not found in embeddings: ${missingWords.join(', ')}` 
      });
    }
    
    // Calculate analogy
    const analogyResults = await vectorService.findAnalogy(word1, word2, word3, numResults);
    
    res.json({
      message: 'Analogy calculated successfully',
      data: {
        analogy: `${word1} is to ${word2} as ${word3} is to ?`,
        searchMode: useExactSearch ? 'exact' : 'approximate',
        results: analogyResults.neighbors
      }
    });
    
  } catch (error) {
    console.error('Error calculating analogy:', error);
    res.status(500).json({ error: 'Failed to calculate analogy: ' + error.message });
  }
});

// Endpoint to find slice (cross-section) between two words
router.post('/findSlice', async (req, res) => {
  try {
    const { 
      word1, 
      word2, 
      numResults = 5, 
      maxDepth = 20
    } = req.body;
    
    // Validate input
    if (!word1 || !word2) {
      return res.status(400).json({ error: 'Both words are required' });
    }
    
    // Check if words exist
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    
    if (!word1Exists || !word2Exists) {
      const message = generateResponseMessage(word1, word2, word1Exists, word2Exists);
      return res.status(404).json({ error: message });
    }
    
    // Get vectors for both words
    const vector1 = await vectorService.getWordVector(word1);
    const vector2 = await vectorService.getWordVector(word2);
    
    if (!vector1 || !vector2) {
      return res.status(500).json({ error: 'Failed to retrieve word vectors' });
    }
    
    // Calculate recursive slice through vector space
    const sliceResults = await vectorService.findSlice(
      word1, 
      word2, 
      numResults, 
      maxDepth
    );
    
    res.json({
      message: 'Slice calculation completed successfully',
      data: sliceResults
    });
    
  } catch (error) {
    console.error('Error finding slice:', error);
    res.status(500).json({ error: 'Failed to find slice: ' + error.message });
  }
});

// Helper function to generate appropriate response message
function generateResponseMessage(word1, word2, word1Exists, word2Exists) {
  if (!word1Exists && !word2Exists) {
    return `Neither "${word1}" nor "${word2}" was found in the embeddings.`;
  } else if (!word1Exists) {
    return `"${word1}" was not found in the embeddings.`;
  } else if (!word2Exists) {
    return `"${word2}" was not found in the embeddings.`;
  } else {
    return `Both words found! Vectors retrieved successfully.`;
  }
}

export default router; 