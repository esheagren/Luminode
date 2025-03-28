# Port Configuration Issues and Resolution

## Problem

The VectorMind application can experience connectivity issues between the frontend and backend with errors like `ERR_CONNECTION_REFUSED` or `Network Error` when trying to add words or perform other API operations. This document explains the causes and how to resolve them.

## Root Causes

1. **Port Mismatch**: 
   - The frontend expects the backend on a specific port (configured in `.env`).
   - The backend might start on a different port due to:
     - Different PORT environment variable configuration
     - Port conflicts causing the server to use a fallback port
     - Incorrect script execution

2. **Missing Environment Variables**:
   - If the `.env` files are missing or have incorrect values, the application won't know which port to use.

3. **Server Not Running**:
   - If the API server is not running, the frontend will try to connect to a non-existent service.

## Solution

### Configuration Files

Ensure consistent port configuration across these files:

1. **Root `.env`** (Frontend Configuration):
   ```
   VITE_API_URL=http://localhost:5001
   PINECONE_API_KEY=your_pinecone_api_key
   ```

2. **Server `.env`** (Backend Configuration):
   ```
   PORT=5001
   PINECONE_API_KEY=your_pinecone_api_key
   ```

3. **vite.config.js** (Development Proxy):
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5001',
         // ...
       }
     }
   }
   ```

### Running the Application Properly

#### Method 1: Combined Start (Recommended)

Use the combined start script that ensures both servers are running and coordinated:

```bash
npm run dev-all
```

This script:
- Stops any existing server instances
- Starts the backend with the correct port (5001)
- Starts the frontend with automatic port selection

#### Method 2: Manual Start

If you prefer to start services manually:

1. Start the backend server:
   ```bash
   npm run start-server
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Check the console output to verify:
   - The backend is running on port 5001
   - The frontend is using the correct API URL

### Troubleshooting

If you still encounter connectivity issues:

1. **Check Server Status**:
   ```bash
   curl http://localhost:5001/health
   ```
   Should return `{"status":"ok"}` if the server is running correctly.

2. **Verify Port in Use**:
   ```bash
   # macOS/Linux
   lsof -i :5001
   
   # Windows
   netstat -ano | findstr :5001
   ```

3. **Force Server Restart**:
   ```bash
   npm run restart-server
   ```

4. **Debug Connection**:
   Check the browser console for connection errors. Look for:
   - The actual port the frontend is trying to connect to
   - Any CORS errors (unlikely with the current configuration)
   - The actual port where the server is running

## Best Practices

1. Always start the application using `npm run dev-all` to ensure port coordination.

2. If you need to change ports:
   - Update both `.env` files
   - Update the `vite.config.js` proxy target
   - Update any scripts in `package.json` that reference the port 