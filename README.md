# VectorMind - Word Embedding Explorer

An application for exploring word embeddings, finding semantic relationships, and visualizing vector spaces. VectorMind supports both local (HNSW-based) and cloud-based (Pinecone) storage of word embeddings.

## Features

- Find similar words using nearest neighbor search
- Calculate the midpoint between two words and find words in that semantic space
- Solve analogy problems (e.g., "man is to woman as king is to _____")
- Visualize word vectors in 2D or 3D space using PCA
- Support for both local and cloud-based embeddings

## Technical Details

The application uses:
- React for the frontend
- Express.js for the backend API
- HNSW (Hierarchical Navigable Small World graphs) for local nearest neighbor search
- Pinecone vector database for cloud-based vector storage and search
- GloVe word embeddings (200-dimensional vectors)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   USE_PINECONE=true_or_false
   ```

## Local Embeddings Setup

To use local embeddings:

1. Download the GloVe embeddings (glove.6B.200d.txt) from [Stanford NLP](https://nlp.stanford.edu/projects/glove/)
2. Place the file in the `server/embeddings` directory
3. Build the HNSW index:
   ```
   npm run build-index
   ```
4. Set `USE_PINECONE=false` in the `.env` file

## Pinecone Setup

To use Pinecone vector database:

1. Create an account on [Pinecone](https://www.pinecone.io/)
2. Create an index named "quickstart" with 200 dimensions and metric "cosine"
3. Add your Pinecone API key to the `.env` file
4. Load embeddings into Pinecone:
   ```
   npm run load-pinecone
   ```
5. Set `USE_PINECONE=true` in the `.env` file

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

### Switching Between Local and Pinecone Modes

To switch between local and Pinecone embeddings:

```
npm run toggle-mode
```

Or manually update the `USE_PINECONE` variable in your `.env` file.

### Additional Commands

- `npm run restart-server` - Restart the backend server
- `npm run load-pinecone` - Load word embeddings into Pinecone
- `npm run build-index` - Build HNSW index for local embeddings

## API Endpoints

The application provides the following API endpoints:

- `POST /api/findNeighbors` - Find nearest neighbors for a word
- `POST /api/findMidpoint` - Find the semantic midpoint between two words
- `POST /api/findAnalogy` - Solve analogy problems
- `POST /api/getVectorCoordinates` - Get 2D/3D coordinates for word vectors
- `POST /api/checkWord` - Check if a word exists in the embeddings

## License

[MIT](LICENSE)
