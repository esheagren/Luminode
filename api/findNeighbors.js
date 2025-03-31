import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  // Minimal logging to reduce memory overhead
  console.log(`[API] findNeighbors called: ${req.method}`);
  
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
    // Extract parameters from request body
    const { word, numResults = 4, useExactSearch = true } = req.body;
    
    console.log(`[API findNeighbors] Body:`, { word, numResults, useExactSearch });
    
    // Validate input
    if (!word) {
      console.warn('[API findNeighbors] Validation failed: Word required.');
      return res.status(400).json({ error: 'Word is required' });
    }
    
    // Initialize vector service
    await vectorService.initialize();
    
    // Check if word exists
    console.log(`[API findNeighbors] Checking existence for: ${word}`);
    const wordExists = await vectorService.wordExists(word);
    console.log(`[API findNeighbors] Existence result: ${word}=${wordExists}`);
    
    if (!wordExists) {
      console.warn(`[API findNeighbors] Word not found: "${word}"`);
      return res.status(404).json({ 
        error: `Word "${word}" not found in embeddings` 
      });
    }
    
    // Find nearest neighbors
    console.log(`[API findNeighbors] Finding neighbors for: ${word}`);
    const neighbors = await vectorService.findWordNeighbors(word, numResults);
    console.log(`[API findNeighbors] Found ${neighbors.length} neighbors`);
    
    return res.status(200).json({
      message: 'Nearest neighbors found successfully',
      data: {
        word,
        searchMode: useExactSearch ? 'exact' : 'approximate',
        nearestWords: neighbors
      }
    });
    
  } catch (error) {
    // Log the detailed error
    console.error('[API findNeighbors] Error finding neighbors:', error);
    console.error(`[API findNeighbors] Error details: Name=${error.name}, Message=${error.message}`);
    return res.status(500).json({ error: 'Failed to find neighbors: ' + error.message });
  }
} 