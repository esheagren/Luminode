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
  return process.env.NODE_ENV === 'production';
};

/**
 * Gets the appropriate API server URL based on the current environment
 * @returns {string} The API URL - empty string for relative URLs in production, localhost URL in development
 */
export const getApiServerUrl = () => {
  if (isProduction()) {
    console.log('Environment: Production - using relative URLs for API calls');
    return '';
  }
  
  console.log('Environment: Development - using localhost:5001 for API calls');
  return 'http://localhost:5001';
};

export default {
  isProduction,
  getApiServerUrl
}; 