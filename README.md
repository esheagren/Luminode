# Luminode - Vector Database Visualization Software

An educational application for exploring word embeddings, finding semantic relationships, and visualizing vector spaces. Luminode uses cloud-based Pinecone storage for word embeddings to ensure optimal performance!

## Features

- Find similar words using nearest neighbor search
- Calculate semantic midpoints between words to discover concepts in-between
- Solve analogy problems (e.g., "man is to woman as king is to _____")
- Explore semantic space using novel slicing technique
- Visualize word vectors in 2D or 3D space using memory-efficient PCA
- Optimized for serverless deployments with minimal memory usage

## Technical Details

The application uses:
- React with Vite for the frontend
- Vercel serverless functions (`api/*.js`) for the backend API
- Pinecone vector database for cloud-based vector storage and search
- Llama Text Embed v2 word embeddings (1024-dimensional vectors, generated via Pinecone's integrated inference)
- Memory-optimized PCA implementation for visualization
- Three.js for 3D rendering of vector spaces

### Memory Optimization Techniques

- Matrix-free operations to avoid storing full covariance matrices
- Power iteration instead of SVD for finding principal components
- In-place vector normalization to reduce memory allocations
- Periodic yielding to the JavaScript event loop for garbage collection
- Explicit clearing of references to aid garbage collection

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   ```
   Optionally set `VITE_API_URL` to point the frontend at a specific API origin. If
   omitted, the frontend uses the current origin in production and `vercel dev`'s port
   locally.

## Pinecone Setup

To use Pinecone vector database:

1. Create an account on [Pinecone](https://www.pinecone.io/)
2. Create an index named "quickstart" using the `llama-text-embed-v2` embedding model (1024 dimensions, cosine metric)
3. Add your Pinecone API key to the `.env` file
4. Load embeddings into Pinecone:
   ```
   npm run load-pinecone
   ```

## Usage

### Running the Application

The API runs as Vercel serverless functions (`api/*.js`), so local development uses
the Vercel CLI to serve the frontend and the API together:

```
vercel dev
```

This serves both the Vite frontend and the `/api/*` functions on a single local port.

To run only the frontend (e.g. against a deployed API origin set via `VITE_API_URL`):

```
npm run dev
```

### Additional Commands

- `npm run build` - Build the production frontend
- `npm run load-pinecone` - Load word embeddings into Pinecone
- `npm run generate-embeddings` - Generate embeddings locally

## Core Functionality

### 1. Nearest Neighbor Search
Finds semantically similar words based on vector proximity in the embedding space.

### 2. Semantic Midpoint Calculation
Discovers words that represent concepts between two input words by computing vector averages and finding words closest to this averaged vector.

### 3. Analogy Search
Implements the classic word analogy formula (e.g., king - man + woman = queen) to find words that complete analogies.

### 4. Semantic Slicing
A novel technique that enables exploration of the semantic space between two words through recursive traversal, creating a path of semantically related concepts.

## API Endpoints

The application provides the following API endpoints:

- `POST /api/findNeighbors` - Find nearest neighbors for a word
- `POST /api/findMidpoint` - Find the semantic midpoint between two words
- `POST /api/findAnalogy` - Solve analogy problems
- `POST /api/findSlice` - Find semantic path between two words
- `POST /api/findLinearPath` - Find a linear interpolation path between two words
- `POST /api/findGreedyPath` - Find a greedy nearest-neighbor path between two words
- `POST /api/findAxisProjection` - Project words onto a direction/axis defined by two words
- `POST /api/getVectorCoordinates` - Get 2D/3D PCA coordinates for a set of words
- `POST /api/checkWord` - Check if a word exists in the embeddings

## Deployment

This application is optimized for serverless deployments on Vercel. The configuration has been tuned for:
- Minimal memory usage (256MB or less per function)
- Shorter function timeouts (5-10 seconds)
- Efficient PCA computation for visualization

## License

[MIT](LICENSE)