import dotenv from 'dotenv';
import vectorService from '../server/services/vectorService.js';

// Load environment variables
dotenv.config();

// Status endpoint for the API root (/api). The actual feature endpoints are
// individual serverless functions (api/findMidpoint.js, api/findNeighbors.js, etc.).
export default async function handler(req, res) {
  // CORS headers are set at the platform level in vercel.json
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[API:index] Request received');
  console.log(`[API:index] Method: ${req.method}`);
  console.log(`[API:index] Has PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'Yes' : 'No'}`);

  try {
    await vectorService.initialize();
    console.log('[API:index] Vector service initialized successfully');

    return res.status(200).json({
      api: 'Luminode API',
      status: 'online',
      endpoints: [
        '/api/checkWord',
        '/api/getVectorCoordinates',
        '/api/findNeighbors',
        '/api/findMidpoint',
        '/api/findAnalogy',
        '/api/findSlice',
        '/api/findLinearPath',
        '/api/findGreedyPath',
        '/api/findAxisProjection'
      ],
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('[API:index] Error initializing vector service:', error);
    return res.status(500).json({
      error: 'Failed to initialize vector service',
      message: error.message,
      details: {
        type: error.name,
        apiKeyProvided: !!process.env.PINECONE_API_KEY,
        environment: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL
      }
    });
  }
}
