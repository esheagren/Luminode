import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  // Minimal logging to reduce memory overhead
  console.log(`[API] checkWord called: ${req.method}`);
  
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
    // Initialize vector service
    await vectorService.initialize();
    
    const { word } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }
    
    // Check if word exists in vector service
    const wordExists = await vectorService.wordExists(word);
    
    // Get vector if word exists, but don't keep full copy in memory
    let truncatedVector = null;
    
    if (wordExists) {
      const vector = await vectorService.getWordVector(word);
      if (vector) {
        // Create truncated version directly
        const firstFive = vector.slice(0, 5);
        truncatedVector = `[${firstFive.join(', ')}...]`;
        // Help GC by removing reference to the large vector
        firstFive.length = 0;
      }
    }
    
    return res.status(200).json({
      success: true,
      data: {
        word: {
          exists: wordExists,
          vector: truncatedVector
        }
      },
      message: wordExists ? 
        `Word "${word}" found!` : 
        `Word "${word}" was not found in the embeddings.`
    });
    
  } catch (error) {
    console.error('Error checking word:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
} 