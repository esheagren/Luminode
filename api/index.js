import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vectorService from '../server/services/vectorService.js';
import apiRoutes from '../server/routes/api.js';

// Load environment variables
dotenv.config();

// Setup Express for serverless
const app = express();

// Allow all origins in Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Initialize Pinecone
try {
  console.log('Initializing Pinecone...');
  vectorService.initialize()
    .then(() => {
      console.log('Pinecone initialized successfully');
    })
    .catch(err => {
      console.error('Failed to initialize Pinecone:', err);
    });
} catch (error) {
  console.error('Error initializing Pinecone:', error);
}

// Simple serverless handler for the root API endpoint
export default async function handler(req, res) {
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
  
  // Environment and request debugging
  console.log('[API:index] Request received');
  console.log(`[API:index] Method: ${req.method}`);
  console.log(`[API:index] Node version: ${process.version}`);
  console.log(`[API:index] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`[API:index] VERCEL: ${process.env.VERCEL || 'not set'}`);
  console.log(`[API:index] Has PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'Yes' : 'No'}`);
  
  try {
    // Test vector service initialization
    console.log('[API:index] Testing vector service initialization...');
    await vectorService.initialize();
    console.log('[API:index] Vector service initialized successfully');
    
    // Return basic API information
    return res.status(200).json({
      api: 'VectorMind API',
      status: 'online',
      endpoints: [
        '/api/checkWord',
        '/api/getVectorCoordinates',
        '/api/findNeighbors',
        '/api/findMidpoint',
        '/api/findAnalogy'
      ],
      environment: process.env.NODE_ENV,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API:index] Error initializing vector service:', error);
    console.error(`[API:index] Error details: ${error.message}, Type: ${error.name}`);
    console.error(`[API:index] Error stack: ${error.stack}`);
    
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