/**
 * Determines if the application is running in a production environment
 * @returns {boolean} True if in production, false if in development
 */
export const isProduction = () => {
  // Browser-side check
  if (typeof window !== 'undefined') {
    // Always treat non-localhost as production
    return !window.location.hostname.includes('localhost');
  }
  
  // Server-side check
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL === '1' || 
         !!process.env.VERCEL_URL;
};

/**
 * Gets the appropriate API server URL based on the current environment
 * @returns {string} The API URL
 */
export const getApiServerUrl = () => {
  // ALWAYS use relative URLs in production to avoid mixed content issues
  if (isProduction()) {
    return '';
  }
  
  // Only use localhost in development and only when actually on localhost
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    // In local development, if we're actually on localhost, use the local API server
    return 'http://localhost:5001';
  }
  
  // For any other case, use relative URLs for safety
  return '';
};

/**
 * Gets the full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path (e.g., '/api/checkWord')
 * @returns {string} The full URL to the API endpoint
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiServerUrl();
  
  // Ensure endpoint starts with a slash if it doesn't already
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If baseUrl is empty (relative URLs), return the path
  if (!baseUrl) {
    return path;
  }
  
  // Otherwise, construct the full URL
  return `${baseUrl}${path}`;
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

// Log environment info when this module is loaded in the browser
if (typeof window !== 'undefined') {
  // Wait for window to be fully loaded to avoid initialization issues
  setTimeout(logEnvironmentInfo, 0);
}

export default {
  isProduction,
  getApiServerUrl,
  getApiUrl,
  logEnvironmentInfo
}; 