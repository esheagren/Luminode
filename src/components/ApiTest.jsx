import { useState, useEffect } from 'react';
import axios from 'axios';

// Use the same server URL logic as in embedding.js
const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5001';
    }
    return '';
  }
  return 'http://localhost:5001';
};

const ApiTest = () => {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  const serverUrl = getServerUrl();

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log(`Testing API connectivity to ${serverUrl}/api/test`);
        const response = await axios.get(`${serverUrl}/api/test`);
        setApiStatus(`API is connected! Response: ${JSON.stringify(response.data)}`);
      } catch (err) {
        console.error('API test failed:', err);
        setError(`Error: ${err.message}`);
        setApiStatus('Failed to connect to API');
      }
    };

    testApi();
  }, [serverUrl]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      <p>Server URL: {serverUrl}</p>
      <p>Status: {apiStatus}</p>
      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>Error Details:</h3>
          <p>{error}</p>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3>Troubleshooting:</h3>
        <ul>
          <li>Check if the backend server is running</li>
          <li>Verify CORS settings on the server</li>
          <li>Check network tab in developer tools for specific errors</li>
          <li>Make sure Vercel deployment is configured correctly</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest; 