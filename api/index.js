import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from '../server/routes/api.js';
import vectorService from '../server/services/vectorService.js';
import dotenv from 'dotenv';

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

// Initialize vector service if using Pinecone
const USE_PINECONE = process.env.USE_PINECONE === 'true';
if (USE_PINECONE) {
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
}

// Simple serverless handler for the root API endpoint
export default function handler(req, res) {
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
  
  // Return API info
  return res.status(200).json({
    name: 'VectorMind API',
    version: '1.0.0',
    status: 'active',
    mode: USE_PINECONE ? 'pinecone' : 'local',
    endpoints: [
      '/api/getVectorCoordinates',
      '/api/checkWord'
    ],
    message: 'Please use a specific API endpoint'
  });
} 