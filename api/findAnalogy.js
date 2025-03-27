import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  // Minimal logging to reduce memory overhead
  console.log(`[API] findAnalogy called: ${req.method}`);
  
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
    const { word1, word2, word3, numResults = 5, useExactSearch = true } = req.body;
    
    // Validate input
    if (!word1 || !word2 || !word3) {
      return res.status(400).json({ error: 'All three words are required' });
    }
    
    // Initialize vector service
    await vectorService.initialize();
    
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
    
    return res.status(200).json({
      message: 'Analogy calculated successfully',
      data: {
        analogy: `${word1} is to ${word2} as ${word3} is to ?`,
        searchMode: useExactSearch ? 'exact' : 'approximate',
        results: analogyResults.neighbors
      }
    });
    
  } catch (error) {
    console.error('Error calculating analogy:', error);
    return res.status(500).json({ error: 'Failed to calculate analogy: ' + error.message });
  }
} 