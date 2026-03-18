import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  console.log(`[API] findAxisProjection called: ${req.method}`);

  // CORS headers are set at the platform level in vercel.json
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { axisWord1, axisWord2, wordsToProject } = req.body;

    console.log(`[API findAxisProjection] Body:`, { axisWord1, axisWord2, wordsToProject });

    // Validate input
    if (!axisWord1 || !axisWord2) {
      return res.status(400).json({ error: 'Both axis words are required' });
    }
    if (!wordsToProject || !Array.isArray(wordsToProject) || wordsToProject.length === 0) {
      return res.status(400).json({ error: 'At least one word to project is required' });
    }

    // Initialize vector service
    await vectorService.initialize();

    // Check if axis words exist
    const axis1Exists = await vectorService.wordExists(axisWord1);
    const axis2Exists = await vectorService.wordExists(axisWord2);

    if (!axis1Exists || !axis2Exists) {
      let message = '';
      if (!axis1Exists && !axis2Exists) {
        message = `Neither "${axisWord1}" nor "${axisWord2}" was found in the embeddings.`;
      } else if (!axis1Exists) {
        message = `"${axisWord1}" was not found in the embeddings.`;
      } else {
        message = `"${axisWord2}" was not found in the embeddings.`;
      }
      return res.status(404).json({ error: message });
    }

    // Calculate axis projection
    const results = await vectorService.findAxisProjection(axisWord1, axisWord2, wordsToProject);
    console.log(`[API findAxisProjection] Projections count: ${results.projections?.length}`);

    return res.status(200).json({
      message: 'Axis projection calculated successfully',
      data: results
    });

  } catch (error) {
    console.error('[API findAxisProjection] Error:', error);
    return res.status(500).json({ error: 'Failed to calculate axis projection: ' + error.message });
  }
}
