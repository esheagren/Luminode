import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

// Color mapping for different sections to match their diagrams
const sectionColorMap = {
  // Essay 1: The Why and How of Vector Embeddings
  'Dictionary definition': 'rgba(153, 102, 255, 0.1)', // Purple
  'Associative view': 'rgba(153, 102, 255, 0.1)',
  'semantic space': 'rgba(83, 123, 196, 0.1)', // Blue
  'vectors': 'rgba(83, 123, 196, 0.1)',
  'What is a Vector': 'rgba(124, 179, 66, 0.15)', // Light green - for vector explanation
  'list of numbers': 'rgba(124, 179, 66, 0.15)',
  'Polysemy': 'rgba(76, 125, 196, 0.15)', // Light blue - for vector meaning/polysemy
  'context-aware': 'rgba(76, 125, 196, 0.15)',
  'embedding algorithms': 'rgba(255, 142, 83, 0.1)', // Orange
  'practical applications': 'rgba(76, 205, 196, 0.1)', // Teal
  'recommendation systems': 'rgba(76, 205, 196, 0.1)',
  
  // Essay 2: Exploring and Visualizing Vector Embeddings
  'dimensionality reduction': 'rgba(83, 123, 196, 0.1)',
  'nearest neighbor': 'rgba(76, 125, 196, 0.15)',
  'distance metrics': 'rgba(255, 142, 83, 0.1)',
  'vector analogies': 'rgba(76, 205, 196, 0.1)',
  
  // Essay 3: Vector Databases and Large-Scale Retrieval
  'vector databases': 'rgba(83, 123, 196, 0.1)',
  'document chunking': 'rgba(76, 125, 196, 0.15)',
  'retrieval-augmented': 'rgba(255, 142, 83, 0.1)',
  'vector ecosystem': 'rgba(76, 205, 196, 0.1)',
};

const EssayContent = ({ content, title, scrollPosition }) => {
  const [highlighting, setHighlighting] = useState(true);

  useEffect(() => {
    // Reset highlighting state when content changes
    setHighlighting(true);
    
    // Clear any existing highlights when changing essays
    const existingHighlights = document.querySelectorAll('.section-highlight');
    existingHighlights.forEach(el => {
      try {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
      } catch (error) {
        console.warn("Failed to clean up highlighting:", error);
      }
    });
    
    // Apply section highlighting based on headings
    const highlightSections = () => {
      try {
        const essayText = document.querySelector('.essay-text');
        if (!essayText || !highlighting) return;
        
        // Reset any existing highlights
        const existingHighlights = document.querySelectorAll('.section-highlight');
        existingHighlights.forEach(el => {
          try {
            const parent = el.parentNode;
            if (parent) {
              while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
              }
              parent.removeChild(el);
            }
          } catch (error) {
            console.warn("Failed to clean up highlighting:", error);
          }
        });
        
        // Get all section headings
        const headings = essayText.querySelectorAll('h2, h3, strong');
        
        headings.forEach(heading => {
          try {
            let headingText = heading.textContent.toLowerCase();
            let sectionColor = null;
            
            // Find matching color for this section
            for (const [key, color] of Object.entries(sectionColorMap)) {
              if (headingText.includes(key.toLowerCase())) {
                sectionColor = color;
                break;
              }
            }
            
            if (sectionColor) {
              // Find all paragraphs until the next heading
              let nextElement = heading.nextElementSibling;
              const elementsToHighlight = [];
              
              // Include the heading itself
              elementsToHighlight.push(heading);
              
              // Add all paragraphs until next heading
              while (nextElement && 
                     !['H2', 'H3'].includes(nextElement.tagName) && 
                     !nextElement.querySelector('h2, h3')) {
                elementsToHighlight.push(nextElement);
                nextElement = nextElement.nextElementSibling;
                if (!nextElement) break;
              }
              
              // Apply highlight to each element
              elementsToHighlight.forEach(element => {
                if (!element || !element.parentNode) return;
                
                const wrapper = document.createElement('div');
                wrapper.className = 'section-highlight';
                wrapper.style.backgroundColor = sectionColor;
                wrapper.style.borderRadius = '6px';
                wrapper.style.padding = '10px';
                wrapper.style.marginBottom = '15px';
                
                // Clone the element to the wrapper
                const clone = element.cloneNode(true);
                wrapper.appendChild(clone);
                
                // Replace the original with the wrapped version
                try {
                  element.parentNode.replaceChild(wrapper, element);
                } catch (error) {
                  console.warn("Failed to apply highlighting:", error);
                }
              });
            }
          } catch (error) {
            console.warn("Error processing heading:", error);
          }
        });
      } catch (error) {
        console.error("Highlighting error:", error);
        setHighlighting(false); // Disable highlighting if it causes errors
      }
    };
    
    // Run after content is rendered
    if (content && content.length > 0) {
      setTimeout(highlightSections, 300);
    }
  }, [content, title]); // Re-run when content or title changes, not on every scroll
  
  // Track scroll position separately
  useEffect(() => {
    // Optional: perform any scroll-specific updates here
  }, [scrollPosition]);

  return (
    <div className="essay-content">
      <h2 className="essay-title">{title}</h2>
      <div className="essay-text">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      <style jsx="true">{`
        .essay-content {
          width: 100%;
          padding-right: 1rem;
        }
        
        .essay-title {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
        }
        
        .essay-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          text-align: left;
        }
        
        .essay-text p {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        
        .section-highlight {
          transition: background-color 0.3s ease;
        }
        
        .essay-text h1, .essay-text h2, .essay-text h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
        }
        
        .essay-text a {
          color: #FFA500;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        
        .essay-text a:hover {
          border-bottom-color: #FFA500;
        }
        
        /* Math formula styling */
        .essay-text .math {
          overflow-x: auto;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.95);
        }

        /* Override KaTeX styling for dark theme */
        .katex {
          color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
};

export default EssayContent; 