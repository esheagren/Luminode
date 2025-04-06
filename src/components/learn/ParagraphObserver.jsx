import React, { useRef, useEffect } from 'react';

const ParagraphObserver = ({ id, diagramId, diagramColor, onVisibilityChange, children }) => {
  const paragraphRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Pass paragraph ID and its diagram ID to callback when visibility changes
        onVisibilityChange({
          id, 
          diagramId,
          diagramColor, 
          isVisible: entry.isIntersecting,
          // Include intersection ratio for more advanced visibility logic
          ratio: entry.intersectionRatio
        });
      },
      { 
        // Focus on top portion of the screen to control when diagrams change
        rootMargin: "-10% 0px -70% 0px", // Focus on the top 30% of screen
        threshold: [0.1, 0.5, 0.8] // Get updates at these visibility thresholds
      }
    );
    
    if (paragraphRef.current) {
      observer.observe(paragraphRef.current);
    }
    
    return () => {
      if (paragraphRef.current) {
        observer.unobserve(paragraphRef.current);
      }
    };
  }, [id, diagramId, diagramColor, onVisibilityChange]);
  
  return (
    <div 
      ref={paragraphRef} 
      id={`para-${id}`} 
      className="essay-paragraph"
      style={{ 
        backgroundColor: diagramColor,
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '15px',
        transition: 'background-color 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

export default ParagraphObserver; 