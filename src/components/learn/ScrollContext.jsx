import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  // Track paragraphs that have been seen at any point
  const [seenParagraphs, setSeenParagraphs] = useState([]);
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [currentDiagramColor, setCurrentDiagramColor] = useState(null);
  const [scrollDirection, setScrollDirection] = useState('none');
  const lastScrollY = useRef(0);
  const contentRef = useRef(null);
  
  // Track scroll direction for the content container
  useEffect(() => {
    const handleScroll = (e) => {
      if (!contentRef.current) return;
      
      const currentScrollTop = e.target.scrollTop;
      if (currentScrollTop > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollTop < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollTop;
    };
    
    // Find the essay-content-container and attach the listener
    const container = document.querySelector('.essay-content-container');
    if (container) {
      contentRef.current = container;
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Track paragraph visibility changes
  const handleVisibilityChange = useCallback(({ id, diagramId, diagramColor, sectionId, isVisible, ratio }) => {
    // Update list of paragraphs that have been seen
    if (isVisible && ratio > 0.2) { // Consider paragraph "seen" when it's significantly visible
      setSeenParagraphs(prev => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
    }
    
    // Update visible paragraphs
    setVisibleParagraphs(prev => {
      // Update the visible paragraphs list
      let updated;
      if (isVisible) {
        // Add this paragraph to visible ones if not already there
        updated = [...prev.filter(p => p.id !== id), { id, sectionId, diagramId, diagramColor, ratio }];
      } else {
        // Remove this paragraph from visible ones if scrolling up
        // Keep it in the list if scrolling down
        if (scrollDirection === 'up') {
          updated = prev.filter(p => p.id !== id);
        } else {
          // When scrolling down, only update the ratio but keep it in the list if it was previously visible
          updated = prev.map(p => p.id === id ? { ...p, ratio: 0 } : p);
        }
      }
      
      // Find the most prominent paragraph (highest visibility ratio)
      if (updated.length > 0) {
        const visibleWithRatio = updated.filter(p => p.ratio > 0);
        
        if (visibleWithRatio.length > 0) {
          // Sort by visibility ratio, then by most recently seen (for similar ratios)
          const sorted = [...visibleWithRatio].sort((a, b) => b.ratio - a.ratio);
          const mostVisible = sorted[0];
          
          // Update the current diagram if necessary
          if (mostVisible && mostVisible.diagramId) {
            setCurrentDiagram(mostVisible.diagramId);
            setCurrentDiagramColor(mostVisible.diagramColor);
          }
        }
      } else if (scrollDirection === 'down') {
        // When scrolling down with no visible paragraphs, keep the last diagram
      } else {
        // No paragraphs visible and scrolling up, clear the diagram
        setCurrentDiagram(null);
        setCurrentDiagramColor(null);
      }
      
      return updated;
    });
  }, [scrollDirection]);
  
  return (
    <ScrollContext.Provider value={{ 
      visibleParagraphs,
      seenParagraphs,
      currentDiagram,
      currentDiagramColor,
      scrollDirection,
      handleVisibilityChange
    }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
} 