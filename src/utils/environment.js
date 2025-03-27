/**
 * Determines if the application is running in a production environment
 * @returns {boolean} True if in production, false if in development
 */
export const isProduction = () => {
  if (typeof window !== 'undefined') {
    // Check if we're running on localhost
    return !window.location.hostname.includes('localhost');
  }
  
  // If server-side, check environment variable
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL === '1' || 
         !!process.env.VERCEL_URL;
};

/**
 * Gets the appropriate API server URL based on the current environment
 * @returns {string} The API URL - empty string for relative URLs in production, localhost URL in development
 */
export const getApiServerUrl = () => {
  // When in browser context, always use the current origin for API requests
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname.includes('localhost');
    
    if (isLocalhost) {
      // In local development, use the local API server
      return 'http://localhost:5001';
    } else {
      // In production, use relative URLs (empty base path)
      // This ensures API requests go to the same domain
      return '';
    }
  }
  
  // Server-side rendering - fallback based on environment
  if (isProduction()) {
    return '';
  } else {
    return 'http://localhost:5001';
  }
};

/**
 * Gets the full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path (e.g., '/api/checkWord')
 * @returns {string} The full URL to the API endpoint
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiServerUrl();
  
  // Ensure endpoint starts with a slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // For empty baseUrl (relative URLs), just return the path
  if (!baseUrl) return path;
  
  // Remove trailing slash from baseUrl if present
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${base}${path}`;
};

/**
 * Log environment details (for debugging)
 */
export const logEnvironmentInfo = () => {
  if (typeof window !== 'undefined') {
    console.log('Environment Info:');
    console.log(`- Host: ${window.location.hostname}`);
    console.log(`- Origin: ${window.location.origin}`);
    console.log(`- API Server URL: ${getApiServerUrl()}`);
    console.log(`- Is Production: ${isProduction()}`);
    console.log(`- Example API URL: ${getApiUrl('/api/checkWord')}`);
  }
};

// Log environment info when this module is loaded
if (typeof window !== 'undefined') {
  // Wait for window to be fully loaded
  setTimeout(logEnvironmentInfo, 0);
}

export default {
  isProduction,
  getApiServerUrl,
  getApiUrl,
  logEnvironmentInfo
}; 