import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] findLinearPath called: ${req.method}`);

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
    // Validate and clamp numSteps to prevent resource exhaustion
    const numSteps = Math.max(1, Math.min(req.body.numSteps || 10, 100));

    console.log(`[API findLinearPath] Body:`, { word1, word2, numSteps });

    // Validate input
    if (!word1 || !word2) {
      console.warn('[API findLinearPath] Validation failed: Both words required.');
      return res.status(400).json({ error: 'Both words are required' });
    }

    // Initialize vector service
    await vectorService.initialize();

    // Check if words exist
    console.log(`[API findLinearPath] Checking existence for: ${word1}, ${word2}`);
    const word1Exists = await vectorService.wordExists(word1);
    const word2Exists = await vectorService.wordExists(word2);
    console.log(`[API findLinearPath] Existence results: ${word1}=${word1Exists}, ${word2}=${word2Exists}`);

    if (!word1Exists || !word2Exists) {
      let message = '';
      if (!word1Exists && !word2Exists) {
        message = `Neither "${word1}" nor "${word2}" was found in the embeddings.`;
      } else if (!word1Exists) {
        message = `"${word1}" was not found in the embeddings.`;
      } else if (!word2Exists) {
        message = `"${word2}" was not found in the embeddings.`;
      }

      console.warn(`[API findLinearPath] Word not found: ${message}`);
      return res.status(404).json({ error: message });
    }

    // Calculate linear path
    console.log(`[API findLinearPath] Calling vectorService.findLinearPath`);
    const linearPathResults = await vectorService.findLinearPath(word1, word2, numSteps);
    console.log(`[API findLinearPath] Path points count: ${linearPathResults.pathPoints?.length}`);

    return res.status(200).json({
      message: 'Linear path calculation completed successfully',
      data: linearPathResults
    });

  } catch (error) {
    console.error('[API findLinearPath] Error:', error);
    console.error(`[API findLinearPath] Error details: Name=${error.name}, Message=${error.message}`);
    return res.status(500).json({ error: 'Failed to find linear path: ' + error.message });
  }
}
