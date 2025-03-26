// This file is used to initialize the API in Vercel
// It ensures that the embedding service is properly loaded

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..', 'server');
const embeddingsDir = path.join(serverDir, 'embeddings');

// Ensure server and embeddings directories exist
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
  console.log(`Created server directory at ${serverDir}`);
}

if (!fs.existsSync(embeddingsDir)) {
  fs.mkdirSync(embeddingsDir, { recursive: true });
  console.log(`Created embeddings directory at ${embeddingsDir}`);
  console.log('Please place glove.6B.200d.txt file in this directory before starting the server.');
}

// Create a dummy embedding file for testing if none exists
const dummyEmbeddingPath = path.join(embeddingsDir, 'dummy.txt');
if (!fs.existsSync(path.join(embeddingsDir, 'glove.6B.200d.txt')) && !fs.existsSync(dummyEmbeddingPath)) {
  fs.writeFileSync(
    dummyEmbeddingPath,
    'test 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0\n' + 
    'hello 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1\n' + 
    'world 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2\n'
  );
  console.log(`Created dummy embedding file at ${dummyEmbeddingPath}`);
}

console.log('API initialization complete'); 