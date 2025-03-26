import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import embeddingService from './services/embeddingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Update the CORS middleware configuration for Vercel
app.use(cors({
  origin: true, // This will reflect the request origin as allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Check if embeddings directory exists
const embeddingsDir = join(__dirname, 'embeddings');
if (!fs.existsSync(embeddingsDir)) {
  try {
    fs.mkdirSync(embeddingsDir, { recursive: true });
    console.log(`Created embeddings directory at ${embeddingsDir}`);
  } catch (error) {
    console.error('Error creating embeddings directory:', error);
    // In serverless environments, we might not have write access
    // So we'll continue even if this fails
  }
}

// Function to start server with port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    // Start loading embeddings in the background
    embeddingService.loadEmbeddings()
      .then(() => {
        console.log('Embeddings loaded successfully');
      })
      .catch(err => {
        console.error('Failed to load embeddings:', err);
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

// Only start the server in a non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  startServer(PORT);
}

// For serverless environments like Vercel, we need to export the app
export default app; 