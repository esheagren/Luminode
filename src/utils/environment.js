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
  // First check for the environment variable
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    console.log(`Using API URL from environment: ${envApiUrl}`);
    return envApiUrl;
  }
  
  // ALWAYS use relative URLs in production to avoid mixed content issues
  if (isProduction()) {
    return '';
  }
  
  // Only use localhost in development and only when actually on localhost
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    // In local development, always use port 5001 where the server should be running
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
  const isProductionEnv = isProduction();
  
  // Ensure endpoint starts with a slash if it doesn't already
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Ensure path starts with /api/ in production
  const apiPath = path.startsWith('/api/') ? path : 
                 (path.startsWith('/') ? `/api${path}` : `/api/${path}`);
  
  // Create the full URL
  const fullUrl = baseUrl ? `${baseUrl}${apiPath}` : apiPath;
  
  console.debug(`API URL constructed: ${fullUrl} (production: ${isProductionEnv})`);
  
  return fullUrl;
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
    
    // CORS and security info
    console.log(`- Referrer Policy: ${document.referrerPolicy || 'not set'}`);
    console.log(`- Content Security Policy: ${document.contentSecurityPolicy || 'not set'}`);
  }
};

/**
 * Initialize the environment with CORS protection
 * Called on app startup to ensure proper configuration
 */
export const initializeEnvironment = () => {
  if (typeof window !== 'undefined') {
    // Setting up CORS protection for fetch requests
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && 
          (event.reason.name === 'AxiosError' || 
           (typeof event.reason.toString === 'function' && 
            event.reason.toString().includes('Network Error')))) {
        console.error('Possible CORS issue detected:', event.reason);
        console.log('Current environment context:', {
          host: window.location.hostname,
          origin: window.location.origin,
          production: isProduction(),
          apiServer: getApiServerUrl()
        });
      }
    });
    
    // Log environment on load
    setTimeout(logEnvironmentInfo, 0);
  }
};

// Initialize environment when this module is loaded
initializeEnvironment();

export default {
  isProduction,
  getApiServerUrl,
  getApiUrl,
  logEnvironmentInfo,
  initializeEnvironment
}; 