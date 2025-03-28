// Utility functions for creating and removing toolbar tooltips
let tooltipTimer = null;

export const createToolbarTooltip = (toolType, event) => {
  // Clear any existing timer
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
  }
  
  // Set a small delay before showing the tooltip (250ms)
  tooltipTimer = setTimeout(() => {
    // Remove any existing tooltip first
    removeToolbarTooltip();
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'toolbar-tooltip';
    
    // Get tooltip content based on tool type
    const content = getTooltipContent(toolType);
    tooltip.innerHTML = content;
    
    // Position tooltip near the button
    const padding = 10;
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${event.clientX + padding}px`;
    tooltip.style.top = `${event.clientY + padding + 10}px`;
    
    // Add tooltip styles
    tooltip.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '12px 15px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = '320px';
    tooltip.style.fontSize = '14px';
    tooltip.style.lineHeight = '1.5';
    
    // Add custom styles
    const customStyle = `
      .tooltip-title {
        font-weight: bold;
        color: #4285F4;
        margin-bottom: 6px;
        font-size: 16px;
      }
      .tooltip-description {
        color: #cbd5e1;
        font-size: 13px;
        margin-bottom: 8px;
      }
      .tooltip-usage {
        margin-top: 8px;
      }
      .tooltip-usage-title {
        font-weight: bold;
        color: #FFC837;
        margin-bottom: 4px;
        font-size: 14px;
      }
      .tooltip-usage-steps {
        color: #cbd5e1;
        font-size: 12px;
        padding-left: 15px;
      }
      .tooltip-usage-steps li {
        margin-bottom: 4px;
      }
    `;
    
    // Add styles to the tooltip
    const style = document.createElement('style');
    style.textContent = customStyle;
    tooltip.appendChild(style);
    
    // Add tooltip to the document
    document.body.appendChild(tooltip);
    
    // Check if tooltip is going off the screen and adjust if needed
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      tooltip.style.left = `${event.clientX - rect.width - padding}px`;
    }
    if (rect.bottom > window.innerHeight) {
      tooltip.style.top = `${event.clientY - rect.height - padding}px`;
    }
    
    // Apply fade-in animation
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease-in-out';
    
    // Force a reflow to make sure the transition happens
    tooltip.offsetHeight;
    
    // Set opacity to 1 to trigger the fade-in
    tooltip.style.opacity = '1';
  }, 250);
};

export const removeToolbarTooltip = () => {
  // Clear any pending tooltip timer
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
  
  // Remove any existing tooltip
  const existingTooltip = document.getElementById('toolbar-tooltip');
  if (existingTooltip) {
    // Apply fade-out animation
    existingTooltip.style.opacity = '0';
    
    // Remove after animation completes
    setTimeout(() => {
      if (existingTooltip.parentNode) {
        existingTooltip.remove();
      }
    }, 200);
  }
};

const getTooltipContent = (toolType) => {
  switch (toolType) {
    case '3D':
      return `
        <div class="tooltip-title">3D Visualization</div>
        <div class="tooltip-description">
          Toggle between 2D and 3D visualization modes. 3D visualization renders word embeddings in three dimensions using Principal Component Analysis (PCA) to reduce the high-dimensional embedding vectors (typically 300D) to 3D space while preserving semantic relationships.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to switch between 2D and 3D projections</li>
            <li>In 3D mode, click and drag to rotate the vector space</li>
            <li>Use scroll wheel to zoom in and explore dense embedding clusters</li>
          </ul>
        </div>
      `;
    case 'Measure':
      return `
        <div class="tooltip-title">Measure Tool</div>
        <div class="tooltip-description">
          Activate the ruler tool to measure semantic distances using cosine similarity. Cosine similarity calculates the cosine of the angle between two embedding vectors, providing a mathematical measure of semantic relatedness in the embedding space.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to activate/deactivate the measurement tool</li>
            <li>When active, click on two words to calculate their embedding vector cosine similarity</li>
            <li>Values range from -1 to 1, displayed as -100% to 100%, where higher values indicate vectors pointing in similar directions</li>
          </ul>
        </div>
      `;
    case 'Midpoint':
      return `
        <div class="tooltip-title">Midpoint Tool</div>
        <div class="tooltip-description">
          Find words that exist in the semantic space between two selected words. This tool performs vector arithmetic by averaging the normalized embedding vectors of two words and then finding nearest neighbors to this midpoint in the embedding space.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to activate selection mode</li>
            <li>Select two input words from the visualization</li>
            <li>Click "Calculate Midpoint" to compute the centroid vector and find its nearest neighbors</li>
            <li>Results show words with embedding vectors closest to the midpoint vector based on cosine similarity</li>
          </ul>
        </div>
      `;
    case 'Analogy':
      return `
        <div class="tooltip-title">Analogy Tool</div>
        <div class="tooltip-description">
          Discover analogous relationships between words using vector arithmetic. This implements the classic vector embedding operation: vec(B) - vec(A) + vec(C) = vec(D), which captures semantic relationships in the embedding space.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to activate analogy mode</li>
            <li>Select three words in sequence (A, B, then C)</li>
            <li>The system computes the vector operation: B - A + C</li>
            <li>Results show words with embedding vectors closest to the resulting vector, completing the analogy "A is to B as C is to D"</li>
          </ul>
        </div>
      `;
    case 'Slice':
      return `
        <div class="tooltip-title">Slice Tool</div>
        <div class="tooltip-description">
          Create a semantic slice between two words, visualizing the path through embedding space. This tool identifies intermediary words by interpolating between embedding vectors, showing how semantic meaning transitions across the embedding manifold.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to activate slice mode</li>
            <li>Select a starting word and an ending word</li>
            <li>Click "Calculate Slice" to compute the vector interpolation path</li>
            <li>Results show words with embedding vectors that fall along the path between the two points, illustrating the continuous nature of embedding space</li>
          </ul>
        </div>
      `;
    case 'Reset':
      return `
        <div class="tooltip-title">Reset Tool</div>
        <div class="tooltip-description">
          Clear all words and visualization data, returning the application to its initial state. This resets the vector space projection and removes all queried embedding vectors from the visualization.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">How to use:</div>
          <ul class="tooltip-usage-steps">
            <li>Click to remove all plotted word vectors from the visualization</li>
            <li>Clears all selection modes, computed relationships, and results</li>
            <li>Provides a fresh embedding space for new explorations</li>
          </ul>
        </div>
      `;
    case 'Learn':
      return `
        <div class="tooltip-title">Learn Section</div>
        <div class="tooltip-description">
          Access educational resources that explain word embeddings, vector semantics, and the mathematical foundations of the visualizations in Luminode. Learn about Principal Component Analysis (PCA), cosine similarity, and vector operations in embedding space.
        </div>
        <div class="tooltip-usage">
          <div class="tooltip-usage-title">What you'll find:</div>
          <ul class="tooltip-usage-steps">
            <li>Explanations of vector embedding theory and dimensionality reduction</li>
            <li>Interactive examples demonstrating vector arithmetic in semantic space</li>
            <li>Guides for interpreting proximity and relationships in the embedding manifold</li>
            <li>Background on how neural networks learn distributed word representations</li>
          </ul>
        </div>
      `;
    default:
      return `
        <div class="tooltip-title">Tool Information</div>
        <div class="tooltip-description">
          Hover over specific tools in the toolbar to learn more about their vector embedding operations and usage methods.
        </div>
      `;
  }
}; 