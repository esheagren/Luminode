import * as THREE from 'three';

// Utility functions for vector visualizations

// Get color for a point based on whether it's primary or not
export const getPointColor = (word, words, isPrimary, isContextSample, isAnalogy, isSlice, isMainPoint, isEndpoint, sliceLevel, isLinearPath, isGreedyPath) => {
  // Linear path points get blue coloring
  if (isLinearPath) {
    if (isEndpoint) {
      return '#2196F3'; // Deep blue for endpoints
    } else {
      return '#64B5F6'; // Light blue for intermediate points
    }
  }

  // Greedy path points get green coloring
  if (isGreedyPath) {
    if (isEndpoint) {
      return '#4CAF50'; // Deep green for endpoints
    } else {
      return '#81C784'; // Light green for intermediate points
    }
  }

  // Slice points get special coloring
  if (isSlice) {
    if (isEndpoint) {
      // Endpoint of a slice (start/end words)
      return '#8E44AD'; // Deep purple for endpoints
    } else if (isMainPoint) {
      // Main points along the slice path
      return '#9B59B6'; // Medium purple for main slice points
    } else {
      // Neighboring points of the slice
      return 'rgba(155, 89, 182, 0.7)'; // Light purple for neighbors
    }
  } else if (isAnalogy) {
    // Use a distinct color for analogy results
    return '#9C27B0'; // Purple for analogy results
  } else if (isPrimary) {
    // Use a specific color for each primary word
    const colors = [
      '#4285F4', // Google blue
      '#EA4335', // Google red
      '#FBBC05', // Google yellow
      '#34A853', // Google green
      '#FF9800', // Orange
      '#00BCD4'  // Cyan
    ];
    const wordIndex = words.indexOf(word);
    return colors[wordIndex % colors.length];
  } else if (isContextSample) {
    // Use a neutral color for context samples
    return 'rgba(100, 100, 100, 0.5)';
  } else {
    // Use a neutral color for related words
    return 'rgba(150, 150, 150, 0.7)';
  }
};

// Convert hex color to THREE.Color
export const hexToThreeColor = (hex) => {
  return new THREE.Color(hex.replace('#', '0x'));
};

// Create a text sprite for labels in 3D
export const createTextSprite = (text, isPrimary = false) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  
  // Clear background - transparent by default
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Text with different style based on word type
  context.font = isPrimary ? 'bold 28px Arial' : '24px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Add subtle text shadow for readability
  context.shadowColor = 'rgba(0, 0, 0, 0.7)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  
  context.fillStyle = isPrimary ? '#ffffff' : 'rgba(255, 255, 255, 0.9)';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create texture and sprite
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(isPrimary ? 1.8 : 1.3, isPrimary ? 0.45 : 0.35, 1);
  
  return sprite;
};

// Calculate cosine similarity between two vectors
export const calculateCosineSimilarity = (vector1, vector2) => {
  if (!vector1 || !vector2 || vector1.length !== vector2.length) {
    return null;
  }
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  // Calculate cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
};

// Format similarity value for display
export const formatSimilarity = (similarity) => {
  if (similarity === null) return 'N/A';
  
  // Convert to percentage with 2 decimal places
  return `${(similarity * 100).toFixed(2)}%`;
}; 