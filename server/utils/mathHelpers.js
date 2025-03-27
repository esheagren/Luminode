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
 * Ultra memory-efficient Principal Component Analysis (PCA)
 * Optimized for serverless environments with limited memory
 * @param {number[][]} vectors - Array of vectors to project
 * @param {number} dimensions - Number of dimensions to reduce to (2 or 3)
 * @returns {Promise<number[][]>} Promise resolving to array of 2D or 3D coordinates
 */
export async function performPCA(vectors, dimensions = 2) {
  if (!vectors || vectors.length === 0) {
    return [];
  }
  
  // Validate and normalize inputs to reduce memory footprint
  dimensions = dimensions > 3 || dimensions < 2 ? 2 : dimensions;
  const numVectors = vectors.length;
  const vectorDim = vectors[0].length;
  
  console.log(`[PCA] Starting PCA with ${numVectors} vectors of dimension ${vectorDim}`);
  
  // Use a single array for mean calculation to reduce allocations
  const mean = new Array(vectorDim).fill(0);
  for (let i = 0; i < numVectors; i++) {
    for (let j = 0; j < vectorDim; j++) {
      mean[j] += vectors[i][j] / numVectors;
    }
  }
  
  // Function to compute matrix-vector multiplication for covariance
  // This avoids constructing the full covariance matrix
  function matrixVectorProduct(v) {
    const result = new Array(vectorDim).fill(0);
    
    // First pass: calculate all dot products (v·x_i) for efficiency
    const dotProducts = new Array(numVectors);
    for (let i = 0; i < numVectors; i++) {
      let dp = 0;
      for (let j = 0; j < vectorDim; j++) {
        dp += v[j] * (vectors[i][j] - mean[j]);
      }
      dotProducts[i] = dp;
    }
    
    // Second pass: accumulate the result vector
    for (let j = 0; j < vectorDim; j++) {
      for (let i = 0; i < numVectors; i++) {
        result[j] += dotProducts[i] * (vectors[i][j] - mean[j]) / numVectors;
      }
    }
    
    return result;
  }
  
  // Normalize a vector in-place
  function normalize(v) {
    let norm = 0;
    for (let i = 0; i < v.length; i++) {
      norm += v[i] * v[i];
    }
    norm = Math.sqrt(norm);
    
    // Avoid division by zero
    if (norm === 0) return v;
    
    for (let i = 0; i < v.length; i++) {
      v[i] /= norm;
    }
    return v;
  }
  
  console.log(`[PCA] Finding principal components...`);
  
  // Use power iteration to find principal components
  // This is more memory-efficient than SVD for large dimensions
  const principalComponents = [];
  
  for (let d = 0; d < dimensions; d++) {
    // Initialize with small random values
    const pc = new Array(vectorDim);
    for (let i = 0; i < vectorDim; i++) {
      pc[i] = Math.random() * 0.01;
    }
    normalize(pc);
    
    // Power iteration (fewer iterations to save memory)
    for (let iter = 0; iter < 8; iter++) {
      // Apply covariance operator
      const newPc = matrixVectorProduct(pc);
      
      // Make orthogonal to previous components
      for (let p = 0; p < d; p++) {
        const prevPc = principalComponents[p];
        let dot = 0;
        for (let i = 0; i < vectorDim; i++) {
          dot += newPc[i] * prevPc[i];
        }
        
        for (let i = 0; i < vectorDim; i++) {
          newPc[i] -= dot * prevPc[i];
        }
      }
      
      // Copy back to pc (reusing memory)
      normalize(newPc);
      for (let i = 0; i < vectorDim; i++) {
        pc[i] = newPc[i];
      }
    }
    
    principalComponents.push(pc);
  }
  
  console.log(`[PCA] Projecting data onto principal components...`);
  
  // Project data onto principal components
  const projections = [];
  for (let i = 0; i < numVectors; i++) {
    const projection = new Array(dimensions);
    for (let d = 0; d < dimensions; d++) {
      let dot = 0;
      for (let j = 0; j < vectorDim; j++) {
        dot += (vectors[i][j] - mean[j]) * principalComponents[d][j];
      }
      projection[d] = dot;
    }
    projections.push(projection);
    
    // Help garbage collection by nulling references
    if (i % 10 === 0) {
      // Allow GC to run every 10 vectors
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  // Explicitly clear memory
  for (let i = 0; i < principalComponents.length; i++) {
    principalComponents[i] = null;
  }
  
  console.log(`[PCA] PCA completed successfully`);
  return projections;
} 