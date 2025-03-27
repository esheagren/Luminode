import vectorService from '../server/services/vectorService.js';
import { performPCA } from '../server/utils/mathHelpers.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] getVectorCoordinates called with method: ${req.method}`);
  
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
    console.log('[API] Initializing vector service...');
    
    try {
      await vectorService.initialize();
      console.log('[API] Vector service initialized successfully');
    } catch (initError) {
      console.error('[API] Vector service initialization error:', initError);
      return res.status(500).json({ 
        error: 'Vector service initialization failed', 
        message: initError.message,
        isPineconeError: true
      });
    }
    
    const { words, dimensions = 2 } = req.body;
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Invalid words array' });
    }
    
    // Limit number of words to process to prevent excessive memory usage
    const wordsToProcess = words.slice(0, 25); // Limit to 25 words maximum for serverless function
    console.log(`[API] Processing ${wordsToProcess.length} words for coordinates`);
    
    // Validate dimensions
    const projectionDimensions = dimensions === 3 ? 3 : 2;
    
    // Get vectors for all words
    const vectors = [];
    const validWords = [];
    const invalidWords = [];
    
    // Process words to reduce memory pressure
    for (const word of wordsToProcess) {
      try {
        const exists = await vectorService.wordExists(word);
        if (exists) {
          const vector = await vectorService.getWordVector(word);
          if (vector) {
            vectors.push(vector);
            validWords.push(word);
          } else {
            invalidWords.push(word);
          }
        } else {
          invalidWords.push(word);
        }
      } catch (wordError) {
        console.error(`[API] Error processing word "${word}":`, wordError);
        invalidWords.push(word);
      }
    }
    
    if (vectors.length === 0) {
      return res.status(404).json({ 
        error: 'None of the provided words were found in the vocabulary',
        invalidWords
      });
    }
    
    console.log(`[API] Found ${vectors.length} valid vectors, running PCA...`);
    
    // Perform PCA to get coordinates
    let coordinates;
    try {
      coordinates = await performPCA(vectors, projectionDimensions);
    } catch (pcaError) {
      console.error('[API] PCA calculation error:', pcaError);
      return res.status(500).json({ 
        error: 'PCA calculation failed', 
        message: pcaError.message 
      });
    }
    
    // Combine words with their coordinates
    const result = validWords.map((word, i) => {
      const point = { word };
      
      // Add coordinates based on dimensions
      if (projectionDimensions === 2) {
        point.x = coordinates[i][0];
        point.y = coordinates[i][1];
      } else {
        point.x = coordinates[i][0];
        point.y = coordinates[i][1];
        point.z = coordinates[i][2];
      }
      
      return point;
    });
    
    // Help garbage collection
    for (let i = 0; i < vectors.length; i++) {
      vectors[i] = null;
    }
    
    return res.status(200).json({
      message: `Vector coordinates calculated successfully in ${projectionDimensions}D`,
      data: result,
      dimensions: projectionDimensions,
      invalidWords: invalidWords.length > 0 ? invalidWords : undefined
    });
  } catch (error) {
    console.error('[API] Main error in getVectorCoordinates:', error);
    return res.status(500).json({ 
      error: 'Failed to calculate vector coordinates',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 