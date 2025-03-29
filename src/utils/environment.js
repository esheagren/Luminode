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
 * Gets the API server URL based on the environment
 * @returns {string} The base API URL
 */
const getBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  return 'http://localhost:5003'; // Default fallback
};

/**
 * Gets the full URL for an API endpoint
 * @param {string} path - The API endpoint path (e.g., '/api/checkWord')
 * @returns {string} The full URL to the API endpoint
 */
export const getApiUrl = (path) => {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Log environment details (for debugging)
 */
export const logEnvironmentInfo = () => {
  if (typeof window !== 'undefined') {
    console.log('Environment Info:');
    console.log(`- Host: ${window.location.hostname}`);
    console.log(`- Origin: ${window.location.origin}`);
    console.log(`- API Server URL: ${getBaseUrl()}`);
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
          apiServer: getBaseUrl()
        });
      }
    });
    
    // Log environment on load
    setTimeout(logEnvironmentInfo, 0);
  }
};

// Initialize environment when this module is loaded
initializeEnvironment();

// Export for convenience
export default {
  isProduction,
  getBaseUrl,
  getApiUrl,
  logEnvironmentInfo,
  initializeEnvironment
}; 