import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from '../server/routes/api.js';
import embeddingService from '../server/services/embeddingService.js';

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

// Initialize embeddings
try {
  embeddingService.loadEmbeddings()
    .then(() => {
      console.log('Embeddings loaded successfully');
    })
    .catch(err => {
      console.error('Failed to load embeddings:', err);
    });
} catch (error) {
  console.error('Error initializing embeddings:', error);
}

// Export the Express API
export default app; 