// This file is used to initialize the API in Vercel
// It ensures that proper directories exist for the API

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if we're using Pinecone
const USE_PINECONE = process.env.USE_PINECONE === 'true';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..', 'server');

// Ensure server directory exists
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
  console.log(`Created server directory at ${serverDir}`);
}

// If we're not using Pinecone (which shouldn't happen in production),
// create the embeddings directory as a fallback
if (!USE_PINECONE) {
  const embeddingsDir = path.join(serverDir, 'embeddings');
  if (!fs.existsSync(embeddingsDir)) {
    fs.mkdirSync(embeddingsDir, { recursive: true });
    console.log(`Created embeddings directory at ${embeddingsDir}`);
  }
}

console.log(`API initialization complete. Using ${USE_PINECONE ? 'Pinecone' : 'local embeddings'}`); 