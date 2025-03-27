import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] checkWord called with method: ${req.method}`);
  console.log(`[API] Request origin: ${req.headers.origin || 'unknown'}`);
  console.log(`[API] Request body:`, JSON.stringify(req.body));
  
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
    console.log('[API] Responding to OPTIONS request');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    console.log(`[API] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize vector service
    console.log('[API] Initializing vector service...');
    await vectorService.initialize();
    console.log('[API] Vector service initialized successfully');
    
    const { word } = req.body;
    
    if (!word) {
      console.log('[API] Word is required but missing');
      return res.status(400).json({ error: 'Word is required' });
    }
    
    console.log(`[API] Checking word: "${word}"`);
    
    // Check if word exists in vector service
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
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
} 