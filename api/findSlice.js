import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  // Minimal logging to reduce memory overhead
  console.log(`[API] findSlice called: ${req.method}`);
  
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
    const { 
      word1, 
      word2, 
      numResults = 5, 
      maxDepth = 20
    } = req.body;
    
    console.log(`[API findSlice] Body:`, { word1, word2, numResults, maxDepth });
    
    // Validate input
    if (!word1 || !word2) {
      console.warn('[API findSlice] Validation failed: Both words required.');
      return res.status(400).json({ error: 'Both words are required' });
    }
    
    // Initialize vector service
    await vectorService.initialize();
    
    // Check if words exist
    console.log(`[API findSlice] Checking existence for: ${word1}, ${word2}`);
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    console.log(`[API findSlice] Existence results: ${word1}=${word1Exists}, ${word2}=${word2Exists}`);
    
    if (!word1Exists || !word2Exists) {
      let message = '';
      if (!word1Exists && !word2Exists) {
        message = `Neither "${word1}" nor "${word2}" was found in the embeddings.`;
      } else if (!word1Exists) {
        message = `"${word1}" was not found in the embeddings.`;
      } else if (!word2Exists) {
        message = `"${word2}" was not found in the embeddings.`;
      }
      
      console.warn(`[API findSlice] Word not found: ${message}`);
      return res.status(404).json({ error: message });
    }
    
    // Calculate recursive slice through vector space
    console.log(`[API findSlice] Calling vectorService.findSlice for: ${word1}, ${word2}`);
    const sliceResults = await vectorService.findSlice(
      word1, 
      word2, 
      numResults, 
      maxDepth
    );
    console.log(`[API findSlice] Received results from vectorService.findSlice:`, 
      sliceResults ? `Slice points count: ${sliceResults.slicePoints?.length}` : 'null/undefined');
    
    console.log(`[API findSlice] Sending success response`);
    return res.status(200).json({
      message: 'Slice calculation completed successfully',
      data: sliceResults
    });
    
  } catch (error) {
    // Log the detailed error
    console.error('[API findSlice] Error finding slice:', error);
    console.error(`[API findSlice] Error details: Name=${error.name}, Message=${error.message}`);
    return res.status(500).json({ error: 'Failed to find slice: ' + error.message });
  }
} 