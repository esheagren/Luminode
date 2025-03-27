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
 * Calculate the midpoint between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number[]} Midpoint vector
 */
export function calculateMidpoint(a, b) {
  if (!a || !b || a.length !== b.length) {
    return null;
  }
  
  return a.map((val, i) => (val + b[i]) / 2);
}

/**
 * Perform Principal Component Analysis (PCA) to reduce vectors to 3D
 * Memory-optimized version to reduce serverless function memory usage
 * @param {number[][]} vectors - Array of vectors to project
 * @param {number} dimensions - Number of dimensions to reduce to (2 or 3)
 * @returns {number[][]} Array of 2D or 3D coordinates
 */
export function performPCA(vectors, dimensions = 2) {
  if (!vectors || vectors.length === 0) {
    return [];
  }
  
  // Validate dimensions
  if (dimensions !== 2 && dimensions !== 3) {
    dimensions = 2; // Default to 2D if invalid
  }
  
  // Center the data (optimize memory usage by doing in-place operations)
  const vectorDimensions = vectors[0].length;
  const mean = new Array(vectorDimensions).fill(0);
  
  // Calculate mean for each dimension
  for (const vector of vectors) {
    for (let i = 0; i < vectorDimensions; i++) {
      mean[i] += vector[i] / vectors.length;
    }
  }
  
  // Center the vectors by subtracting the mean (in-place modification)
  // Only create a new array if necessary for further processing
  const workingVectors = new Array(vectors.length);
  for (let i = 0; i < vectors.length; i++) {
    workingVectors[i] = new Array(vectorDimensions);
    for (let j = 0; j < vectorDimensions; j++) {
      workingVectors[i][j] = vectors[i][j] - mean[j];
    }
  }
  
  // Function to multiply a vector by the covariance matrix (optimized)
  const multiplyByCovariance = (v) => {
    const result = new Array(vectorDimensions).fill(0);
    
    for (const vector of workingVectors) {
      // Calculate dot product of v and vector
      let dotProduct = 0;
      for (let i = 0; i < vectorDimensions; i++) {
        dotProduct += v[i] * vector[i];
      }
      
      // Add the contribution to the result
      for (let i = 0; i < vectorDimensions; i++) {
        result[i] += dotProduct * vector[i] / workingVectors.length;
      }
    }
    
    return result;
  };
  
  // Normalize a vector (in-place optimization)
  const normalize = (v) => {
    let norm = 0;
    for (let i = 0; i < v.length; i++) {
      norm += v[i] * v[i];
    }
    norm = Math.sqrt(norm);
    
    // In-place normalization
    for (let i = 0; i < v.length; i++) {
      v[i] /= norm;
    }
    return v;
  };
  
  // Find principal components using power iteration
  const principalComponents = [];
  
  // Find each principal component
  for (let pc = 0; pc < dimensions; pc++) {
    // Start with a random vector
    let currentPC = new Array(vectorDimensions);
    for (let i = 0; i < vectorDimensions; i++) {
      currentPC[i] = Math.random() - 0.5;
    }
    currentPC = normalize(currentPC);
    
    // Make orthogonal to previous principal components (Gram-Schmidt)
    for (let iter = 0; iter < 10; iter++) {
      // Apply covariance matrix
      currentPC = multiplyByCovariance(currentPC);
      
      // Make orthogonal to all previous principal components
      for (let prevPC = 0; prevPC < principalComponents.length; prevPC++) {
        let dot = 0;
        for (let i = 0; i < vectorDimensions; i++) {
          dot += currentPC[i] * principalComponents[prevPC][i];
        }
        
        for (let i = 0; i < vectorDimensions; i++) {
          currentPC[i] -= dot * principalComponents[prevPC][i];
        }
      }
      
      // Normalize
      currentPC = normalize(currentPC);
    }
    
    principalComponents.push(currentPC);
  }
  
  // Project the original vectors onto the reduced space (reuse memory)
  const projections = new Array(vectors.length);
  
  for (let i = 0; i < vectors.length; i++) {
    const projection = new Array(dimensions);
    
    for (let pc = 0; pc < dimensions; pc++) {
      let dotProduct = 0;
      for (let j = 0; j < vectorDimensions; j++) {
        dotProduct += vectors[i][j] * principalComponents[pc][j];
      }
      projection[pc] = dotProduct;
    }
    
    projections[i] = projection;
  }
  
  // Clean up to help garbage collection
  for (let i = 0; i < workingVectors.length; i++) {
    workingVectors[i] = null;
  }
  
  return projections;
} 