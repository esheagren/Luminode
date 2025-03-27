// This file initializes the API in Vercel

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default function handler(req, res) {
  // Log environment status (sanitized)
  console.log('========= VectorMind API Environment Check =========');
  console.log(`Runtime environment: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`Vercel deployment: ${process.env.VERCEL === '1' ? 'Yes' : 'No'}`);
  console.log(`PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'Set (masked)' : 'NOT SET'}`);
  
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL === '1';
  
  // Get all environment variables without exposing sensitive values
  const envVarList = Object.keys(process.env)
    .filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN'))
    .join(', ');
  
  console.log(`Available environment variables: ${envVarList}`);
  console.log('==================================================');
  
  // Return status
  res.status(200).json({
    initialized: true,
    environment: process.env.NODE_ENV || 'development',
    serverless: isServerless,
    hasPineconeKey: !!process.env.PINECONE_API_KEY,
    message: 'Environment check complete'
  });
} 