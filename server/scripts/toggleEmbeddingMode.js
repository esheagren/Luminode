import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import readline from 'readline';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const envPath = path.join(rootDir, '.env');

// Load current .env file
dotenv.config({ path: envPath });

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to update .env file
function updateEnvFile(usePinecone) {
  try {
    // Read current .env file content
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if USE_PINECONE already exists
    const regex = /USE_PINECONE=(true|false)/;
    const newValue = `USE_PINECONE=${usePinecone}`;
    
    let newEnvContent;
    if (regex.test(envContent)) {
      // Replace existing setting
      newEnvContent = envContent.replace(regex, newValue);
    } else {
      // Add setting to the end
      newEnvContent = envContent.trim() + `\n# Set to 'true' to use Pinecone, 'false' to use local embeddings\n${newValue}\n`;
    }
    
    // Write back to .env file
    fs.writeFileSync(envPath, newEnvContent);
    
    console.log(`\n✅ Configuration updated. Vector embeddings mode set to: ${usePinecone === 'true' ? 'PINECONE' : 'LOCAL'}`);
    console.log('Restart your server for changes to take effect.\n');
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

// Execution logic
console.log('\n=== Vector Embeddings Mode Toggle ===');
console.log(`Current mode: ${process.env.USE_PINECONE === 'true' ? 'PINECONE' : 'LOCAL'}`);
console.log('\nOptions:');
console.log('1: Use Pinecone (cloud-based vector database)');
console.log('2: Use Local embeddings (HNSW-based local index)');

rl.question('\nSelect mode (1 or 2): ', (answer) => {
  if (answer === '1') {
    updateEnvFile('true');
  } else if (answer === '2') {
    updateEnvFile('false');
  } else {
    console.log('Invalid selection. No changes made.');
  }
  
  rl.close();
}); 