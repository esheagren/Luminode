/**
 * Determines if the application is running in a production environment
 * @returns {boolean} True if in production, false if in development
 */
export const isProduction = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname.includes('vercel.app') || 
           hostname.includes('.com') || 
           hostname.includes('.net') || 
           hostname.includes('.org') || 
           hostname.includes('.io') || 
           !hostname.includes('localhost');
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
  // Force absolute path for API requests regardless of environment
  // This is necessary for Vercel deployments
  if (typeof window !== 'undefined') {
    // Use the current origin for API requests
    // This ensures API requests work in both development and production
    return window.location.origin;
  }
  
  if (isProduction()) {
    console.log('Environment: Production - using relative URLs for API calls');
    return '';
  }
  
  console.log('Environment: Development - using localhost:5001 for API calls');
  return 'http://localhost:5001';
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

export default {
  isProduction,
  getApiServerUrl,
  getApiUrl
}; 