import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import process from 'process';

// Load environment variables
dotenv.config();

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const EMBEDDING_FILE_PATH = path.join(__dirname, '../embeddings/glove.6B.200d.txt');
const MAX_LINES = 50000;
const BATCH_SIZE = 50;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const PINECONE_INDEX_NAME = 'quickstart';
const PINECONE_NAMESPACE = 'ns1';
const EMBEDDING_MODEL = 'llama-text-embed-v2'; // Using Pinecone's embedding model

// Function to check if a string contains only ASCII characters
function isAscii(str) {
  // Check if each character code is between 0 and 127 (ASCII range)
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      return false;
    }
  }
  return true;
}

async function main() {
  // Initialize Pinecone client
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  console.log('Checking if index exists...');
  
  // Check if the index already exists
  const indexesList = await pinecone.listIndexes();
  const indexExists = indexesList.indexes.some(idx => idx.name === PINECONE_INDEX_NAME);
  
  if (!indexExists) {
    console.log(`Creating index '${PINECONE_INDEX_NAME}' with integrated embedding...`);
    
    // Create a new index with integrated embedding
    await pinecone.createIndexForModel({
      name: PINECONE_INDEX_NAME,
      waitUntilReady: true,
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: EMBEDDING_MODEL,
        fieldMap: {
          text: "text" // The field in your metadata to embed
        }
      }
    });
    
    console.log('Index created successfully!');
  } else {
    console.log(`Index '${PINECONE_INDEX_NAME}' already exists.`);
  }

  // Connect to the index and namespace
  const namespace = pinecone.index(PINECONE_INDEX_NAME).namespace(PINECONE_NAMESPACE);
  
  // Check if embedding file exists
  if (!fs.existsSync(EMBEDDING_FILE_PATH)) {
    console.error(`Embedding file not found at: ${EMBEDDING_FILE_PATH}`);
    process.exit(1);
  }

  console.log(`Starting to process first ${MAX_LINES} lines from ${EMBEDDING_FILE_PATH}`);
  console.log(`Using batch size of ${BATCH_SIZE} records`);

  let lineCount = 0;
  let processedCount = 0;
  let batch = [];
  let batchCount = 0;

  // Read and process the file
  const fileStream = fs.createReadStream(EMBEDDING_FILE_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (lineCount >= MAX_LINES) break;
    
    lineCount++;
    
    // Extract the word (first token in the line)
    const tokens = line.trim().split(' ');
    const word = tokens[0];
    
    // Only add non-empty words with ASCII characters
    if (word && isAscii(word)) {
      batch.push({
        id: word,
        text: word // This field matches the fieldMap from createIndexForModel
      });
      processedCount++;
    }

    // When batch is full, upsert to Pinecone
    if (batch.length >= BATCH_SIZE) {
      console.log(`Upserting batch ${++batchCount} (${batch.length} records)...`);
      await upsertBatch(namespace, batch);
      console.log(`Batch ${batchCount} completed. Processed ${processedCount} valid words so far (${lineCount} total lines).`);
      batch = [];
    }

    // Show progress every 1000 lines
    if (lineCount % 1000 === 0) {
      console.log(`Progress: ${lineCount}/${MAX_LINES} lines (${processedCount} valid words)`);
    }
  }

  // Upsert any remaining words
  if (batch.length > 0) {
    console.log(`Upserting final batch (${batch.length} records)...`);
    await upsertBatch(namespace, batch);
    console.log(`Final batch completed. Total processed: ${processedCount} valid words (${lineCount} total lines).`);
  }

  console.log('Processing completed successfully!');
  
  // Run a sample query to verify
  await runSampleQuery();
}

async function upsertBatch(namespace, batch) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await namespace.upsertRecords(batch);
      return; // Success, exit the function
    } catch (error) {
      retries++;
      console.error(`Error upserting batch (attempt ${retries}/${MAX_RETRIES}):`, error.message);
      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached, giving up on this batch.');
        throw error;
      }
      // Wait before retrying
      console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

/**
 * Run a sample query against the Pinecone index
 */
async function runSampleQuery() {
  console.log('Running a sample query to verify...');
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      // Using the index to query directly
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });
      
      // Target the specific namespace
      const index = pinecone.index(PINECONE_INDEX_NAME).namespace(PINECONE_NAMESPACE);
      
      // Query with a simple vector for testing that matches the index dimension of 1024
      const testVector = Array(1024).fill(0.1); 
      
      const queryResponse = await index.query({
        topK: 5,
        includeMetadata: true,
        vector: testVector,
        filter: { "text": { "$exists": true } }  // Filter for records with a text field
      });
      
      console.log('Query successful! Results:');
      console.log(`Found ${queryResponse.matches.length} matches.`);
      
      queryResponse.matches.forEach((match, i) => {
        console.log(`${i + 1}. ${match.id} (score: ${match.score.toFixed(4)})`);
      });
      
      return queryResponse;
    } catch (error) {
      retries++;
      console.log(`Error running sample query (attempt ${retries}/${MAX_RETRIES}): ${error.message}`);
      
      if (retries >= MAX_RETRIES) {
        console.log('Max retries reached, giving up on the query.');
        break;
      }
      
      console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

// Run the main function
main().catch(err => {
  console.error('Error in main execution:', err);
  process.exit(1);
}); 