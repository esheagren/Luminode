import vectorService from '../server/services/vectorService.js';
import { cosineSimilarity } from '../server/utils/mathHelpers.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] debugSimilarity called: ${req.method}`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const { word1, word2 } = req.body;

    if (!word1 || !word2) {
      return res.status(400).json({ error: 'Both words are required' });
    }

    // Initialize vector service
    await vectorService.initialize();

    // Get vectors
    const vector1 = await vectorService.getWordVector(word1);
    const vector2 = await vectorService.getWordVector(word2);

    if (!vector1 || !vector2) {
      return res.status(404).json({ error: 'One or both words not found' });
    }

    // Compute similarity
    const similarity = cosineSimilarity(vector1, vector2);

    // Compute vector statistics
    const stats1 = {
      length: vector1.length,
      min: Math.min(...vector1),
      max: Math.max(...vector1),
      mean: vector1.reduce((a, b) => a + b, 0) / vector1.length,
      magnitude: Math.sqrt(vector1.reduce((a, b) => a + b * b, 0)),
      sample: vector1.slice(0, 10)
    };

    const stats2 = {
      length: vector2.length,
      min: Math.min(...vector2),
      max: Math.max(...vector2),
      mean: vector2.reduce((a, b) => a + b, 0) / vector2.length,
      magnitude: Math.sqrt(vector2.reduce((a, b) => a + b * b, 0)),
      sample: vector2.slice(0, 10)
    };

    // Compute dot product
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
    }

    return res.status(200).json({
      word1,
      word2,
      similarity,
      similarityPercent: (similarity * 100).toFixed(2) + '%',
      dotProduct,
      vector1Stats: stats1,
      vector2Stats: stats2
    });

  } catch (error) {
    console.error('[API debugSimilarity] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
