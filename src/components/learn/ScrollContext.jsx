import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { SECTION_ORDER } from './essayData';

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  // Track paragraphs that have been seen at any point
  const [seenParagraphs, setSeenParagraphs] = useState([]);
  // Track the highest position (furthest down) paragraph that has been seen
  const [furthestSeenPosition, setFurthestSeenPosition] = useState(0);
  // Track the highest currently visible paragraph position when scrolling up
  const [highestVisiblePosition, setHighestVisiblePosition] = useState(0);
  // Track paragraph visibility thresholds to ensure symmetrical highlighting/unhighlighting
  const [paragraphThresholds, setParagraphThresholds] = useState({});
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [currentDiagramColor, setCurrentDiagramColor] = useState(null);
  const [scrollDirection, setScrollDirection] = useState('none');
  const lastScrollY = useRef(0);
  const contentRef = useRef(null);
  
  // Function to extract position number from paragraph ID
  const getPositionFromId = (id) => {
    if (!id) return 0;
    
    // Handle intro paragraphs as having positions 1, 2, etc.
    if (id.startsWith('intro-p')) {
      const match = id.match(/intro-p(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    
    // Handle regular section paragraphs
    const match = id.match(/-p(\d+)$/);
    if (match) {
      // Extract the base section name
      const sectionName = id.replace(/-p\d+$/, '');
      
      // Get position based on section ordering in the essay
      const baseWeight = SECTION_ORDER[sectionName] || 0;
      const paragraphNum = parseInt(match[1], 10);
      
      return baseWeight + paragraphNum;
    }
    
    return 0;
  };
  
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
  
  // Update highest visible position whenever visible paragraphs change
  useEffect(() => {
    // Find the highest position among currently visible paragraphs
    if (visibleParagraphs.length > 0) {
      const visibleWithRatio = visibleParagraphs.filter(p => p.ratio > 0);
      
      if (visibleWithRatio.length > 0) {
        const highest = Math.max(...visibleWithRatio.map(p => p.position));
        setHighestVisiblePosition(highest);
      }
    }
  }, [visibleParagraphs]);
  
  // Track paragraph visibility changes
  const handleVisibilityChange = useCallback(({ id, diagramId, diagramColor, sectionId, isVisible, ratio }) => {
    const position = getPositionFromId(id);
    
    // Store the threshold at which this paragraph becomes visible or invisible
    if (scrollDirection !== 'none') {
      setParagraphThresholds(prev => {
        const threshold = lastScrollY.current;
        
        // If this is a new paragraph, initialize its state
        if (!prev[id]) {
          return {
            ...prev,
            [id]: {
              appearThreshold: isVisible ? threshold : undefined,
              disappearThreshold: !isVisible ? threshold : undefined,
              isCurrentlyVisible: isVisible,
              position
            }
          };
        }
        
        // Update thresholds only when visibility state changes
        const currentVisibility = prev[id].isCurrentlyVisible;
        
        // Visibility state is changing from invisible to visible
        if (isVisible && !currentVisibility) {
          return {
            ...prev,
            [id]: {
              ...prev[id],
              appearThreshold: threshold,
              isCurrentlyVisible: true,
              position
            }
          };
        } 
        // Visibility state is changing from visible to invisible
        else if (!isVisible && currentVisibility) {
          return {
            ...prev,
            [id]: {
              ...prev[id],
              disappearThreshold: threshold,
              isCurrentlyVisible: false,
              position
            }
          };
        }
        
        // No change in visibility state
        return prev;
      });
    }
    
    // Update list of paragraphs that have been seen
    if (isVisible && ratio > 0.2) { // Consider paragraph "seen" when it's significantly visible
      setSeenParagraphs(prev => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
      
      // Update furthest seen position when scrolling down
      if (position > furthestSeenPosition && scrollDirection !== 'up') {
        setFurthestSeenPosition(position);
      }
    }
    
    // Update visible paragraphs
    setVisibleParagraphs(prev => {
      // Update the visible paragraphs list
      let updated;
      if (isVisible) {
        // Add this paragraph to visible ones if not already there
        // Include the position in the stored data
        updated = [...prev.filter(p => p.id !== id), { id, sectionId, diagramId, diagramColor, ratio, position }];
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
  }, [scrollDirection, furthestSeenPosition]);
  
  // Helper function to check if we should unhighlight a paragraph when scrolling up
  const shouldUnhighlightWhenScrollingUp = useCallback((id) => {
    if (!paragraphThresholds[id]) return false;
    
    // When scrolling up, check if we've passed the threshold where this paragraph appeared
    if (scrollDirection === 'up') {
      const { appearThreshold, position } = paragraphThresholds[id];
      
      // If there's no appearance threshold yet, don't unhighlight
      if (!appearThreshold) return false;
      
      // Create a buffer zone for smoother transitions
      const transitionBuffer = 30; // pixels of scroll buffer for transition
      
      // Calculate how far past the threshold we've scrolled
      const distancePastThreshold = appearThreshold - lastScrollY.current;
      
      // If we're in the buffer zone, don't unhighlight yet - creates smoother transition
      if (distancePastThreshold <= transitionBuffer) {
        return false;
      }
      
      // Only unhighlight paragraphs below the highest visible one
      return position > highestVisiblePosition;
    }
    
    return false;
  }, [paragraphThresholds, scrollDirection, highestVisiblePosition, lastScrollY]);
  
  return (
    <ScrollContext.Provider value={{ 
      visibleParagraphs,
      seenParagraphs,
      currentDiagram,
      currentDiagramColor,
      scrollDirection,
      handleVisibilityChange,
      furthestSeenPosition,
      highestVisiblePosition,
      getPositionFromId,
      shouldUnhighlightWhenScrollingUp,
      paragraphThresholds
    }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
} 