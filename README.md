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
- Express.js for the backend API
- Pinecone vector database for cloud-based vector storage and search
- GloVe word embeddings (200-dimensional vectors)
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
   VITE_API_URL=http://localhost:5001
   PINECONE_API_KEY=your_pinecone_api_key
   ```
4. Create a `.env` file in the `server/` directory with the following variables:
   ```
   PORT=5001
   PINECONE_API_KEY=your_pinecone_api_key
   ```

## Pinecone Setup

To use Pinecone vector database:

1. Create an account on [Pinecone](https://www.pinecone.io/)
2. Create an index named "quickstart" with 200 dimensions and metric "cosine"
3. Add your Pinecone API key to both `.env` files
4. Load embeddings into Pinecone:
   ```
   npm run load-pinecone
   ```

## Usage

### Running the Application

#### Option 1: Start both frontend and backend together (recommended)
```
npm run dev-all
```
This starts the backend server on port 5001 and the frontend development server on a free port.

#### Option 2: Start separately
1. Start the server:
   ```
   npm run start-server
   ```
   This will start the server on port 5001.

2. In a separate terminal, start the client:
   ```
   npm run dev
   ```

3. Open your browser to the URL shown in the dev terminal (typically http://localhost:5173 or another port if 5173 is in use)

### Troubleshooting Connection Issues

If you encounter `ERR_CONNECTION_REFUSED` errors:

1. Ensure the server is running on port 5001
   ```
   npm run restart-server
   ```

2. Verify that both `.env` files have consistent port configurations:
   - Root `.env`: `VITE_API_URL=http://localhost:5001`
   - Server `.env`: `PORT=5001`

3. Check the server console for port binding issues. If the server is running on a different port, update your frontend `.env` file to match.

For a detailed explanation of port configuration issues and solutions, see [PORT_ISSUES.md](docs/PORT_ISSUES.md).

### Additional Commands

- `npm run restart-server` - Restart the backend server
- `npm run stop-server` - Stop the backend server
- `npm run load-pinecone` - Load word embeddings into Pinecone

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
- `POST /api/checkWord` - Check if a word exists in the embeddings

## Deployment

This application is optimized for serverless deployments on Vercel. The configuration has been tuned for:
- Minimal memory usage (256MB or less per function)
- Shorter function timeouts (5-10 seconds)
- Efficient PCA computation for visualization

## License

[MIT](LICENSE)