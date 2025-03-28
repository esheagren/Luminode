/**
 * Calculate Euclidean distance between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Euclidean distance
 */
export function euclideanDistance(a, b) {
  if (!a || !b || a.length !== b.length) {
    return null;
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

/**
 * Calculate the cosine similarity between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Cosine similarity (between -1 and 1)
 */
export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) {
    return null;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Format similarity score as a percentage
 * @param {number} similarity - Similarity score (-1 to 1)
 * @returns {string} Formatted percentage
 */
export function formatSimilarityPercentage(similarity) {
  if (similarity === null || similarity === undefined) {
    return 'N/A';
  }
  
  // Convert to percentage between -100% and 100%
  const percentage = (similarity * 100).toFixed(2);
  return `${percentage}%`;
}

/**
 * Get a color based on a point's type and properties
 * @param {Object} point - Point data
 * @returns {string} CSS color
 */
export function getPointColor(point) {
  if (point.isSlice) {
    if (point.isEndpoint) {
      return '#8E44AD'; // Purple for endpoints
    }
    if (point.isMainPoint) {
      return '#3498DB'; // Blue for main slice points
    }
    return '#2ECC71'; // Green for neighbors
  }
  
  if (point.isMidpoint) {
    return '#E67E22'; // Orange for midpoints
  }
  
  if (point.isAnalogy) {
    return '#F1C40F'; // Yellow for analogy results
  }
  
  // Default for regular points
  return '#ECF0F1';
} 