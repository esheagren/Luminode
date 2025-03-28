// Utility functions for creating and removing tooltips

export const createTooltip = (point, event) => {
  // Remove any existing tooltip
  removeTooltip();
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = 'vector-tooltip';
  
  // Determine the tooltip title based on point type
  let title;
  if (point.isPrimary) {
    title = "Primary Word";
  } else if (point.isAnalogy) {
    title = "Analogous Word";
  } else if (point.isContextSample) {
    title = "Context Sample";
  } else {
    title = "Neighbor Word";
  }
  
  // Create tooltip content
  const content = `
    <div class="tooltip-title">${title}</div>
    <div class="tooltip-word">${point.word}</div>
    ${point.distance ? `<div class="tooltip-distance">Distance: ${point.distance.toFixed(4)}</div>` : ''}
    ${point.analogySource ? `<div class="tooltip-analogy-source">From: ${point.analogySource.fromWords.join(' → ')}</div>` : ''}
    ${point.truncatedVector ? `<div class="tooltip-vector">${point.truncatedVector}</div>` : ''}
  `;
  
  tooltip.innerHTML = content;
  
  // Position tooltip near the point
  const padding = 10;
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${event.clientX + padding}px`;
  tooltip.style.top = `${event.clientY + padding}px`;
  
  // Add tooltip styles
  tooltip.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
  tooltip.style.color = 'white';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  tooltip.style.zIndex = '1000';
  tooltip.style.maxWidth = '280px';
  tooltip.style.fontSize = '14px';
  tooltip.style.lineHeight = '1.4';
  tooltip.style.pointerEvents = 'none'; // Allow clicks through the tooltip
  
  // Add title styles
  const titleStyle = `
    .tooltip-title {
      font-weight: bold;
      color: #9333ea;
      margin-bottom: 4px;
      font-size: 15px;
    }
    .tooltip-word {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .tooltip-distance, .tooltip-analogy-source {
      font-size: 13px;
      margin-bottom: 4px;
      color: #cbd5e1;
    }
    .tooltip-vector {
      font-family: monospace;
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
    }
  `;
  
  // Add styles to the tooltip
  const style = document.createElement('style');
  style.textContent = titleStyle;
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
};

export const createSimilarityTooltip = (event, similarity) => {
  // Remove any existing tooltip
  removeTooltip();
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = 'vector-tooltip';
  
  // Create tooltip content
  const content = `
    <div class="tooltip-title">Cosine Similarity</div>
    <div class="tooltip-similarity">${similarity}</div>
    <div class="tooltip-explanation">
      Cosine similarity measures the cosine of the angle between two vectors, 
      indicating how similar their orientations are in the vector space:
      <ul>
        <li><strong>100%</strong>: Perfectly similar (same direction)</li>
        <li><strong>0%</strong>: No similarity (perpendicular)</li>
        <li><strong>-100%</strong>: Perfectly dissimilar (opposite direction)</li>
      </ul>
      Higher values indicate words that are more contextually related.
    </div>
  `;
  
  tooltip.innerHTML = content;
  
  // Position tooltip near the similarity text
  const padding = 10;
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${event.clientX + padding}px`;
  tooltip.style.top = `${event.clientY + padding}px`;
  
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
  tooltip.style.pointerEvents = 'none';
  
  // Add custom styles
  const customStyle = `
    .tooltip-title {
      font-weight: bold;
      color: #4285F4;
      margin-bottom: 6px;
      font-size: 16px;
    }
    .tooltip-similarity {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 8px;
      color: white;
    }
    .tooltip-explanation {
      color: #cbd5e1;
      font-size: 13px;
    }
    .tooltip-explanation ul {
      margin-top: 6px;
      padding-left: 18px;
    }
    .tooltip-explanation li {
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
};

export const removeTooltip = () => {
  const existingTooltip = document.getElementById('vector-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
}; 