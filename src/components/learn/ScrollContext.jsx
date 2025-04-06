import React, { createContext, useState, useContext, useCallback } from 'react';

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [currentDiagramColor, setCurrentDiagramColor] = useState(null);
  
  // Track paragraph visibility changes
  const handleVisibilityChange = useCallback(({ id, diagramId, diagramColor, isVisible, ratio }) => {
    setVisibleParagraphs(prev => {
      // Update the visible paragraphs list
      let updated;
      if (isVisible) {
        // Add this paragraph to visible ones if not already there
        updated = [...prev.filter(p => p.id !== id), { id, diagramId, diagramColor, ratio }];
      } else {
        // Remove this paragraph from visible ones
        updated = prev.filter(p => p.id !== id);
      }
      
      // Find the most prominent paragraph (highest visibility ratio and closest to top)
      if (updated.length > 0) {
        const sorted = [...updated].sort((a, b) => b.ratio - a.ratio);
        const mostVisible = sorted[0];
        
        // Update the current diagram if necessary
        if (mostVisible && mostVisible.diagramId) {
          setCurrentDiagram(mostVisible.diagramId);
          setCurrentDiagramColor(mostVisible.diagramColor);
        }
      } else {
        // No paragraphs visible, clear the diagram
        setCurrentDiagram(null);
        setCurrentDiagramColor(null);
      }
      
      return updated;
    });
  }, []);
  
  return (
    <ScrollContext.Provider value={{ 
      visibleParagraphs,
      currentDiagram,
      currentDiagramColor,
      handleVisibilityChange
    }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
} 