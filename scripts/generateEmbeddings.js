import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import suggestedWords from '../src/data/suggestedWords.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_URL = process.env.VITE_API_URL || 'http://localhost:5002';
const WORDS_TO_PROCESS = 1; // Process 1 word at a time
const DELAY_BETWEEN_REQUESTS = 30000; // 30 seconds between requests
const MAX_RETRIES = 3;
const BACKOFF_FACTOR = 2;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadExistingEmbeddings() {
  try {
    const outputPath = path.join(__dirname, '../src/data/generatedEmbeddings.js');
    const content = await fs.readFile(outputPath, 'utf8');
    const match = content.match(/export const wordEmbeddings = ({[\s\S]*?});/);
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (error) {
    console.log('No existing embeddings file found, starting fresh');
  }
  return {};
}

async function processWord(word, retryCount = 0) {
  try {
    console.log(`\nProcessing "${word}"...`);
    const response = await axios.post(`${API_URL}/api/checkWord`, {
      word,
      dimensions: 2
    });
    
    if (response.data?.data?.word?.vector) {
      const vectorStr = response.data.data.word.vector;
      const vector = vectorStr
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(x => parseFloat(x.trim()))
        .filter(x => !isNaN(x));
      
      console.log(`✓ Got vector for "${word}" (length: ${vector.length})`);
      return vector;
    } else {
      console.log(`✗ No vector data for "${word}"`);
      return null;
    }
  } catch (error) {
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      const delay = DELAY_BETWEEN_REQUESTS * Math.pow(BACKOFF_FACTOR, retryCount);
      console.log(`Rate limited. Waiting ${delay/1000} seconds before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await sleep(delay);
      return processWord(word, retryCount + 1);
    }
    console.error(`Error processing "${word}":`, error.message);
    return null;
  }
}

async function generateEmbeddings() {
  console.log(`Using API URL: ${API_URL}`);
  
  // Load existing embeddings
  const embeddings = await loadExistingEmbeddings();
  const processedWords = new Set(Object.keys(embeddings));
  const remainingWords = suggestedWords.filter(word => !processedWords.has(word));
  
  console.log(`Found ${processedWords.size} existing embeddings`);
  console.log(`${remainingWords.length} words remaining to process`);
  
  // Process just the first few words
  const wordsToProcess = remainingWords.slice(0, WORDS_TO_PROCESS);
  console.log(`\nProcessing ${wordsToProcess.length} words...`);
  
  let successCount = processedWords.size;
  let failCount = 0;
  
  try {
    for (const word of wordsToProcess) {
      // Skip if we already have this word
      if (processedWords.has(word)) {
        console.log(`\nSkipping "${word}" - already have embedding`);
        continue;
      }
      
      const vector = await processWord(word);
      if (vector) {
        embeddings[word] = vector;
        processedWords.add(word);
        successCount++;
      } else {
        failCount++;
      }
      
      // Add a delay between requests
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
    
    // Generate the output file content
    const outputContent = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT DIRECTLY
// Generated on ${new Date().toISOString()}

/**
 * Pre-computed embeddings for suggested words
 * Format: { word: number[] }
 */
export const wordEmbeddings = ${JSON.stringify(embeddings, null, 2)};

/**
 * Check if a word has a pre-computed embedding
 * @param {string} word - The word to check
 * @returns {boolean} Whether the word has a pre-computed embedding
 */
export const hasPrecomputedEmbedding = (word) => {
  return word in wordEmbeddings;
};

/**
 * Get the embedding for a word
 * @param {string} word - The word to get the embedding for
 * @returns {number[] | null} The embedding or null if not found
 */
export const getWordEmbedding = (word) => {
  return wordEmbeddings[word] || null;
};

/**
 * Create a word result object from a pre-computed embedding
 * @param {string} word - The word to create a result for
 * @returns {Object} A word result object with vector data
 */
export const createWordResult = (word) => {
  const vector = wordEmbeddings[word];
  if (!vector) return null;
  
  return {
    word,
    exists: true,
    vector: vector
  };
};

export default wordEmbeddings;
`;
    
    // Write the embeddings to the data file
    const outputPath = path.join(__dirname, '../src/data/generatedEmbeddings.js');
    await fs.writeFile(outputPath, outputContent, 'utf8');
    
    console.log('\nEmbeddings generation complete:');
    console.log(`✓ Successfully generated embeddings for ${successCount} words`);
    console.log(`✗ Failed to generate embeddings for ${failCount} words`);
    console.log(`\nOutput written to: ${outputPath}`);
    
    // Return non-zero exit code if any words failed
    if (failCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\nScript failed:', error.message);
    process.exit(1);
  }
}

// Run the script
console.log('Starting embeddings generation script...');
generateEmbeddings().catch(error => {
  console.error('\nScript failed:', error.message);
  process.exit(1);
}); 