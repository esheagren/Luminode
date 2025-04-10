import React, { useRef, useEffect, useState } from 'react';
import { useScroll } from './ScrollContext';

const ParagraphObserver = ({ id, diagramId, diagramColor, onVisibilityChange, children }) => {
  const paragraphRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibilityRatio, setVisibilityRatio] = useState(0);
  const { 
    scrollDirection, 
    visibleParagraphs, 
    seenParagraphs, 
    furthestSeenPosition,
    highestVisiblePosition,
    getPositionFromId,
    shouldUnhighlightWhenScrollingUp,
    paragraphThresholds,
    userHasScrolled
  } = useScroll();
  
  // Get paragraph position in the document
  const paragraphPosition = getPositionFromId(id);
  
  // Extract section name from paragraph id (e.g., "vector" from "vector-p1")
  const getSectionId = (id) => {
    if (!id) return '';
    const match = id.match(/^([a-z-]+)(?:-p\d+)?$/);
    return match ? match[1] : '';
  };
  
  // Get this paragraph's section id
  const sectionId = getSectionId(id);
  
  // Check if this specific paragraph is in the visible paragraphs list
  const isParagraphVisible = () => {
    return visibleParagraphs.some(p => p.id === id && p.ratio > 0);
  };
  
  // Check if this paragraph has been seen before
  const hasBeenSeen = () => {
    return seenParagraphs.includes(id);
  };
  
  // Check if this paragraph is above any paragraph that has been seen when scrolling down
  const isParagraphAboveViewed = () => {
    return paragraphPosition <= furthestSeenPosition;
  };
  
  // Check if this paragraph is above current visible paragraphs when scrolling up
  const isParagraphAboveCurrentlyVisible = () => {
    return paragraphPosition <= highestVisiblePosition;
  };
  
  // Get the threshold information for this paragraph
  const getThresholdInfo = () => {
    return paragraphThresholds[id] || { appearThreshold: 0, disappearThreshold: 0 };
  };
  
  // Check if this is the first paragraph in the essay
  const isFirstParagraph = () => {
    return id === 'intro-p1';
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update local visibility state
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        
        // Update visibility ratio
        if (isIntersecting) {
          setVisibilityRatio(entry.intersectionRatio);
        } else {
          // Always reset visibility ratio immediately when paragraph is no longer visible
          setVisibilityRatio(0);
        }
        
        // Pass paragraph ID and its diagram ID to callback when visibility changes
        onVisibilityChange({
          id, 
          diagramId,
          diagramColor, 
          isVisible: isIntersecting,
          sectionId,
          ratio: entry.intersectionRatio
        });
      },
      { 
        // Focus on middle portion of the screen to control when diagrams change
        rootMargin: "-40% 0px -40% 0px", // Focus on the middle 20% of screen
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] // More granular threshold values for smoother transitions
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
  }, [id, diagramId, diagramColor, onVisibilityChange, scrollDirection, sectionId]);
  
  // Determine if we should show background color
  const shouldShowBackground = () => {
    // Always highlight the first paragraph regardless of scroll state
    if (isFirstParagraph()) {
      return true;
    }
    
    // If user hasn't scrolled yet, only highlight the first paragraph
    if (!userHasScrolled) {
      return false;
    }
    
    // If the paragraph is currently visible, always show its background
    if (isVisible) {
      return true;
    }
    
    // When scrolling down, highlight paragraphs that have been viewed
    if (scrollDirection === 'down' || scrollDirection === 'none') {
      return isParagraphAboveViewed();
    }
    
    // When scrolling up, immediately un-highlight paragraphs that aren't visible
    if (scrollDirection === 'up') {
      // Only keep paragraphs highlighted if they're currently visible or above the highest visible paragraph
      return isVisible || paragraphPosition <= highestVisiblePosition;
    }
    
    // Default fallback - if in doubt, rely on visibility
    return isVisible;
  };
  
  // Calculate opacity based on visibility ratio for a smoother transition
  const getOpacity = () => {
    if (!shouldShowBackground()) return 0;
    
    // Always give the first paragraph full opacity
    if (isFirstParagraph()) {
      return 0.85; // Increased from 0.7 for better visibility
    }
    
    // When paragraph has been seen but isn't currently visible,
    // use a lower opacity
    if (!isVisible) {
      return 0.75; // Increased from 0.6 for better visibility
    }
    
    // When paragraphs are visible, use slightly reduced opacity
    if (isVisible) {
      return 0.85; // Increased from 0.7 for better visibility
    }
    
    // Normal case: fade based on visibility ratio with a higher minimum opacity
    // Use a smoothing function for more gradual transitions
    const smoothedRatio = Math.pow(visibilityRatio, 0.7); 
    return Math.max(0.4, Math.min(smoothedRatio * 1.2, 0.85)); // Higher min and max opacity
  };
  
  // Parse the rgba color to get its components
  const parseColor = (rgba) => {
    const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([.\d]+)\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseFloat(match[4])
      };
    }
    return { r: 0, g: 0, b: 0, a: 0 };
  };
  
  // Create a color with adjusted opacity
  const getBackgroundColor = () => {
    if (!diagramColor) return 'transparent';
    
    const opacity = getOpacity();
    if (opacity === 0) return 'transparent';
    
    const color = parseColor(diagramColor);
    // Adjusted opacity calculation for better visibility
    const adjustedOpacity = Math.max(color.a * 0.75, 0.25) * opacity;
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${adjustedOpacity})`;
  };
  
  // Get threshold data for debugging
  const thresholdData = getThresholdInfo();
  
  // Determine transition style based on scroll direction
  const getTransitionStyle = () => {
    // For scrolling up, use no transition for instant un-highlighting
    if (scrollDirection === 'up') {
      return 'all 0s';
    }
    // For scrolling down or no scrolling, use the smooth transition
    return 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
  };
  
  return (
    <div 
      ref={paragraphRef} 
      id={`para-${id}`} 
      className="essay-paragraph"
      data-section={sectionId}
      data-has-been-seen={hasBeenSeen() ? "true" : "false"}
      data-is-visible={isVisible ? "true" : "false"}
      data-position={paragraphPosition}
      data-appear-threshold={thresholdData.appearThreshold}
      style={{ 
        position: 'relative',
        padding: '10px 14px 5px 14px', // Increased horizontal padding
        marginBottom: '0px',
        marginTop: '0px',
        transition: getTransitionStyle(), // Dynamic transition based on scroll direction
        borderRadius: '8px', // All corners rounded
      }}
    >
      {/* Background with soft edges */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: getBackgroundColor(),
          borderRadius: '8px',
          boxShadow: shouldShowBackground() ? `0 0 20px 0 ${getBackgroundColor()}` : 'none',
          opacity: getOpacity() > 0 ? 1 : 0,
          transition: getTransitionStyle(),
          zIndex: -1,
        }}
      />
      {children}
    </div>
  );
};

export default ParagraphObserver; 