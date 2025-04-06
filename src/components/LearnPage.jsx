import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './learn/LearnPage.css';
import LoadingAnimation from './visualization/LoadingAnimation';

// Component imports
import EssayNavigation from './learn/EssayNavigation';
import EssayContent from './learn/EssayContent';
import DiagramComponent from './learn/DiagramComponent';
import { ScrollProvider, useScroll } from './learn/ScrollContext';

// Import essay utilities
import { getEssayContent, getAvailableEssays } from './learn/essayUtils';
import { availableEssays } from './learn/essayData';

// Wrapper component that has access to the scroll context
const DiagramContainer = () => {
  const { userHasScrolled } = useScroll();
  
  return (
    <div className="diagram-container" style={{ opacity: userHasScrolled ? 1 : 0 }}>
      <DiagramComponent />
    </div>
  );
};

const LearnPage = () => {
  const containerRef = useRef(null);
  const essayContentRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedEssay, setSelectedEssay] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // List of available essays - prioritize the structured data format
  const essays = availableEssays || getAvailableEssays();
  
  // Initialize with the first essay on component mount
  useEffect(() => {
    if (essays && essays.length > 0 && !selectedEssay) {
      // Select the first essay by default (Vectors: Meaning in AI Systems)
      setSelectedEssay(essays[0]);
    }
  }, [essays, selectedEssay]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial dimensions
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  const updateDimensions = () => {
    if (!containerRef.current) return;
    
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    });
  };

  // Function to handle essay selection with proper state reset
  const handleEssaySelect = (essay) => {
    // First reset scroll and content to prevent DOM reconciliation issues
    setScrollPosition(0);
    setEssayContent('');
    
    // Set the selected essay after a brief delay to allow DOM to update
    setTimeout(() => {
      setSelectedEssay(essay);
      
      // Reset scroll position of the container if it exists
      if (essayContentRef.current) {
        essayContentRef.current.scrollTop = 0;
      }
    }, 50);
  };

  // Load essay content when selected essay changes - only needed for non-structured essays
  useEffect(() => {
    // Skip if no essay is selected yet
    if (!selectedEssay) return;
    
    // If we're using structured data, we don't need to load content from text files
    const needsLegacyContent = !availableEssays.includes(selectedEssay);
    
    if (needsLegacyContent) {
      // Get content from our utility for legacy essays
      const content = getEssayContent(selectedEssay);
      setEssayContent(content);
    }
  }, [selectedEssay]);

  // Handle scroll events in the essay content area
  const handleScroll = (e) => {
    const position = e.target.scrollTop;
    setScrollPosition(position);
  };

  return (
    <div className="learn-page-container" ref={containerRef}>
      <div className="animation-background">
        <LoadingAnimation 
          width={dimensions.width} 
          height={dimensions.height} 
        />
      </div>

      <div className="learn-content-wrapper">
        <div className="learn-header">
          <Link to="/app" className="back-button">
            Back to Application
          </Link>
          
          <div className="essay-navigation">
            <EssayNavigation 
              essays={essays} 
              selectedEssay={selectedEssay} 
              onSelectEssay={handleEssaySelect} 
            />
          </div>
        </div>

        <ScrollProvider>
          <div className="learn-content">
            <div 
              className="essay-content-container" 
              onScroll={handleScroll} 
              ref={essayContentRef}
            >
              <EssayContent 
                content={essayContent} 
                title={selectedEssay} 
              />
            </div>

            <DiagramContainer />
          </div>
        </ScrollProvider>
      </div>
    </div>
  );
};

export default LearnPage; 