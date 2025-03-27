import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import vectorService from './services/vectorService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables with fallbacks
const env = {
  PORT: globalThis.process?.env?.PORT || 5000,
  NODE_ENV: globalThis.process?.env?.NODE_ENV || 'development',
  USE_PINECONE: globalThis.process?.env?.USE_PINECONE === 'true'
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = env.PORT;

// Get allowed origins based on environment
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:5174',
    'http://localhost:3000',  // Next.js dev server
    'http://localhost:4173',  // Vite preview
    'http://localhost:5000',  // Express server
    'http://localhost:5001'   // Express server alternate port
  ];
  
  // Add Vercel deployment URL if in production
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  // Allow all origins in development
  if (process.env.NODE_ENV !== 'production') {
    return '*';
  }
  
  return origins;
};

// Update the CORS middleware configuration
app.use(cors({
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Serve static assets in production
if (env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build/index.html'));
  });
}

// Check if embeddings directory exists (for local embedding service)
const embeddingsDir = join(__dirname, 'embeddings');
if (!fs.existsSync(embeddingsDir)) {
  fs.mkdirSync(embeddingsDir, { recursive: true });
  console.log(`Created embeddings directory at ${embeddingsDir}`);
  
  // Only show this message if not using Pinecone
  if (!env.USE_PINECONE) {
    console.log('Please place glove.6B.200d.txt file in this directory before starting the server.');
  }
}

// Function to start server with port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    // Start initializing vector service in the background
    vectorService.initialize()
      .then(() => {
        console.log('Vector service initialized successfully');
      })
      .catch(err => {
        console.error('Failed to initialize vector service:', err);
      });
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use, trying ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', error);
    }
  });
};

// Start the server
startServer(PORT); 