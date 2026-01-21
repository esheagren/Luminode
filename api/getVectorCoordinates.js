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
    console.log(`[API] Processing ${wordsToProcess.length} words for coordinates: ${wordsToProcess.join(', ')}`);
    
    // Validate dimensions
    const projectionDimensions = dimensions === 3 ? 3 : 2;
    
    // Use the vector service to get coordinates
    const result = await vectorService.getVectorCoordinates(wordsToProcess, projectionDimensions);
    console.log(`[API] Got result with ${result.words?.length || 0} words and ${result.vectors?.length || 0} vectors`);
    
    if (!result.words || result.words.length === 0) {
      return res.status(404).json({ 
        error: 'None of the provided words were found in the vocabulary',
        invalidWords: words
      });
    }
    
    // Format the response
    const formattedResult = result.words.map((word, index) => {
      const vector = result.vectors ? result.vectors[index] : null;
      const point = {
        word: word
      };
      
      // Ensure we always have a consistent format for the vector data that can be used by the measurement tool
      if (vector) {
        // Include truncated vector in string format for display
        point.truncatedVector = `[${vector.slice(0, 5).join(', ')}...]`;

        // Include FULL vector for accurate similarity calculations
        // Using only partial vectors leads to misleading similarity values
        point.measureVector = vector;

        // Log vector information for debugging
        console.log(`[API] Vector for "${word}": ${point.truncatedVector} (${vector.length} dimensions)`);
      } else {
        console.warn(`[API] No vector available for "${word}"`);
      }
      
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
    console.log(`[API] Sending response with ${formattedResult.length} points and ${invalidWords.length} invalid words`);
    
    // Log vector presence for debugging
    const vectorStats = formattedResult.reduce((stats, point) => {
      if (point.measureVector) stats.withVector++;
      else stats.withoutVector++;
      return stats;
    }, { withVector: 0, withoutVector: 0 });
    console.log(`[API] Vector stats: ${vectorStats.withVector} points with vector, ${vectorStats.withoutVector} without`);
    
    return res.status(200).json({
      message: `Vector coordinates calculated successfully in ${projectionDimensions}D`,
      data: formattedResult,
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