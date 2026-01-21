import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] findGreedyPath called: ${req.method}`);

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
    const { word1, word2 } = req.body;
    // Validate and clamp maxHops to prevent resource exhaustion
    const maxHops = Math.max(1, Math.min(req.body.maxHops || 20, 50));

    console.log(`[API findGreedyPath] Body:`, { word1, word2, maxHops });

    // Validate input
    if (!word1 || !word2) {
      console.warn('[API findGreedyPath] Validation failed: Both words required.');
      return res.status(400).json({ error: 'Both words are required' });
    }

    // Initialize vector service
    await vectorService.initialize();

    // Check if words exist
    console.log(`[API findGreedyPath] Checking existence for: ${word1}, ${word2}`);
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    console.log(`[API findGreedyPath] Existence results: ${word1}=${word1Exists}, ${word2}=${word2Exists}`);

    if (!word1Exists || !word2Exists) {
      let message = '';
      if (!word1Exists && !word2Exists) {
        message = `Neither "${word1}" nor "${word2}" was found in the embeddings.`;
      } else if (!word1Exists) {
        message = `"${word1}" was not found in the embeddings.`;
      } else if (!word2Exists) {
        message = `"${word2}" was not found in the embeddings.`;
      }

      console.warn(`[API findGreedyPath] Word not found: ${message}`);
      return res.status(404).json({ error: message });
    }

    // Calculate greedy path
    console.log(`[API findGreedyPath] Calling vectorService.findGreedyPath`);
    const greedyPathResults = await vectorService.findGreedyPath(word1, word2, maxHops);
    console.log(`[API findGreedyPath] Path points count: ${greedyPathResults.pathPoints?.length}`);

    return res.status(200).json({
      message: 'Greedy path calculation completed successfully',
      data: greedyPathResults
    });

  } catch (error) {
    console.error('[API findGreedyPath] Error:', error);
    console.error(`[API findGreedyPath] Error details: Name=${error.name}, Message=${error.message}`);
    return res.status(500).json({ error: 'Failed to find greedy path: ' + error.message });
  }
}
