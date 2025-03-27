import vectorService from '../server/services/vectorService.js';
import { performPCA } from '../server/utils/mathHelpers.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] getVectorCoordinates called with method: ${req.method}`);
  console.log(`[API] Request origin: ${req.headers.origin || 'unknown'}`);
  
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
    
    const { words, dimensions = 2 } = req.body;
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      console.log('[API] Invalid words array:', words);
      return res.status(400).json({ error: 'Invalid words array' });
    }
    
    // Limit number of words to process to prevent excessive memory usage
    const wordsToProcess = words.slice(0, 50); // Limit to 50 words maximum
    
    console.log(`[API] Processing ${wordsToProcess.length} words`);
    
    // Validate dimensions
    const projectionDimensions = dimensions === 3 ? 3 : 2;
    
    // Get vectors for all words
    const vectors = [];
    const invalidWords = [];
    
    // Process words in batches to reduce memory pressure
    for (const word of wordsToProcess) {
      const exists = await vectorService.wordExists(word);
      if (exists) {
        const vector = await vectorService.getWordVector(word);
        if (vector) {
          vectors.push({ word, vector });
        } else {
          invalidWords.push(word);
        }
      } else {
        invalidWords.push(word);
      }
      
      // Give the event loop a chance to breathe between heavy operations
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    if (vectors.length === 0) {
      return res.status(404).json({ 
        error: 'None of the provided words were found in the vocabulary',
        invalidWords
      });
    }
    
    // Extract just the vectors for PCA (avoid creating large temporary arrays)
    const vectorsOnly = new Array(vectors.length);
    for (let i = 0; i < vectors.length; i++) {
      vectorsOnly[i] = vectors[i].vector;
    }
    
    // Perform PCA to get coordinates
    const coordinates = performPCA(vectorsOnly, projectionDimensions);
    
    // Clean up to help garbage collection
    for (let i = 0; i < vectorsOnly.length; i++) {
      vectorsOnly[i] = null;
    }
    
    // Combine words with their coordinates
    const result = [];
    for (let i = 0; i < vectors.length; i++) {
      const point = {
        word: vectors[i].word,
        // Don't include truncated vector in response to save memory
      };
      
      // Add coordinates based on dimensions
      if (projectionDimensions === 2) {
        point.x = coordinates[i][0];
        point.y = coordinates[i][1];
      } else {
        point.x = coordinates[i][0];
        point.y = coordinates[i][1];
        point.z = coordinates[i][2];
      }
      
      result.push(point);
      
      // Clear references to help GC
      vectors[i].vector = null;
    }
    
    // Final cleanup
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
    console.error('Error calculating vector coordinates:', error);
    return res.status(500).json({ error: 'Failed to calculate vector coordinates: ' + error.message });
  }
} 