# VectorMind - Word Embedding Explorer

An application for exploring word embeddings, finding semantic relationships, and visualizing vector spaces. VectorMind now exclusively uses cloud-based Pinecone storage for word embeddings to ensure optimal performance!

## Features

- Find similar words using nearest neighbor search
- Calculate the midpoint between two words and find words in that semantic space
- Solve analogy problems (e.g., "man is to woman as king is to _____")
- Visualize word vectors in 2D or 3D space using PCA
- Optimized for serverless deployments with minimal memory usage

## Technical Details

The application uses:
- React for the frontend
- Express.js for the backend API
- Pinecone vector database for cloud-based vector storage and search
- GloVe word embeddings (200-dimensional vectors)
- Memory-efficient PCA implementation for visualization

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

## Pinecone Setup

To use Pinecone vector database:

1. Create an account on [Pinecone](https://www.pinecone.io/)
2. Create an index named "quickstart" with 200 dimensions and metric "cosine"
3. Add your Pinecone API key to the `.env` file
4. Load embeddings into Pinecone:
   ```
   npm run load-pinecone
   ```

## Usage

### Running the Application

1. Start the server:
   ```
   npm run start-server
   ```
2. In a separate terminal, start the client:
   ```
   npm run dev
   ```
3. Open your browser to the URL shown in the dev terminal (typically http://localhost:5173)

### Additional Commands

- `npm run restart-server` - Restart the backend server
- `npm run load-pinecone` - Load word embeddings into Pinecone

## API Endpoints

The application provides the following API endpoints:

- `POST /api/findNeighbors` - Find nearest neighbors for a word
- `POST /api/findMidpoint` - Find the semantic midpoint between two words
- `POST /api/findAnalogy` - Solve analogy problems
- `POST /api/checkWord` - Check if a word exists in the embeddings

## Deployment

This application is optimized for serverless deployments on Vercel. The configuration has been tuned for:
- Minimal memory usage (256MB or less per function)
- Shorter function timeouts (5-10 seconds)
- Efficient PCA computation for visualization

## License

[MIT](LICENSE)
