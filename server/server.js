import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vectorService from './services/vectorService.js';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Get environment
const env = process.env;

// Create express app
const app = express();

// CORS setup
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins, regardless of port
    if (origin.startsWith('http://localhost:') || 
        origin === 'https://luminode.vercel.app') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON
app.use(express.json());

// Logging middleware
app.use(morgan('combined'));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to API endpoints
app.use('/api', limiter);

// Use API router
app.use('/api', apiRouter);

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Check for specific error types and handle accordingly
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Bad request: Invalid JSON' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Serve static assets in production
if (env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build/index.html'));
  });
}

// Create embeddings directory if it doesn't exist (just the directory, not loading files)
const embeddingsDir = join(__dirname, 'embeddings');
if (!fs.existsSync(embeddingsDir)) {
  fs.mkdirSync(embeddingsDir, { recursive: true });
  console.log(`Created embeddings directory at ${embeddingsDir}`);
}

// Function to start server with port fallback
const startServer = (port) => {
  // Log the port we're attempting to use
  console.log(`Attempting to start server on port ${port}`);
  
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API now available at http://localhost:${port}/api`);
    
    // Start initializing vector service in the background
    // We're now ensuring we only use Pinecone, so this should be lightweight
    console.log('Initializing Pinecone vector service...');
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

// Start server with the desired port
const PORT = parseInt(process.env.PORT || '5001', 10);
console.log(`Environment PORT value: ${process.env.PORT}`);
startServer(PORT);

export default app; 