#!/bin/bash

# Kill any existing node processes running the server if needed
pkill -f "node server/server.js" || true

# Start the API server in the background with explicit port
echo "Starting API server on port 5001..."
PORT=5001 node server/server.js &
API_PID=$!

# Wait a moment for the server to initialize
sleep 2

# Start the Vite development server
echo "Starting Vite development server..."
npm run dev

# When the Vite server exits, also kill the API server
echo "Shutting down API server..."
kill $API_PID 