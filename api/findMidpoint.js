import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function to generate response message for missing words
const generateResponseMessage = (word1, word2, word1Exists, word2Exists) => {
  if (!word1Exists && !word2Exists) {
    return `Neither "${word1}" nor "${word2}" exists in the embeddings.`;
  } else if (!word1Exists) {
    return `"${word1}" does not exist in the embeddings.`;
  } else if (!word2Exists) {
    return `"${word2}" does not exist in the embeddings.`;
  }
  return '';
};

export default async function handler(req, res) {
  // Minimal logging to reduce memory overhead
  console.log(`[API] findMidpoint called: ${req.method}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract parameters
    const { word1, word2, numResults = 5, recursionDepth = 0, useExactSearch = true } = req.body;
    
    // Validate input
    if (!word1 || !word2) {
      return res.status(400).json({ error: 'Both words are required' });
    }
    
    // Initialize vector service
    await vectorService.initialize();
    
    // Check if words exist
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    
    if (!word1Exists || !word2Exists) {
      const message = generateResponseMessage(word1, word2, word1Exists, word2Exists);
      return res.status(404).json({ error: message });
    }
    
    // Find midpoint
    const midpointResult = await vectorService.findMidpoint(word1, word2, numResults);
    
    // Format response - preserve the midpoint vector information
    const results = {
      primaryMidpoint: {
        word1,
        word2,
        nearestWords: midpointResult.neighbors
      },
      searchMode: useExactSearch ? 'exact' : 'approximate',
      secondaryMidpoints: [],
      tertiaryMidpoints: [],
      // Add these fields from the service response
      inputSimilarity: midpointResult.inputSimilarity,
      midpoint: midpointResult.midpoint
    };
    
    // Include recursive midpoint searches if requested
    if (recursionDepth > 0) {
      // Implementation for recursive midpoints could be added here
      // This would require additional recursive calls to findMidpoint
      // For now, we'll keep it simple and just return the primary midpoint
    }
    
    return res.status(200).json({
      message: 'Midpoint search completed successfully',
      data: results
    });
    
  } catch (error) {
    console.error('Error finding midpoint:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
    return res.status(500).json({ error: 'Failed to find midpoint: ' + error.message });
  }
} 