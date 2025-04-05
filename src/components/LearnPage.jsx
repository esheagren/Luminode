import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './learn/LearnPage.css';
import LoadingAnimation from './visualization/LoadingAnimation';

// Component imports
import EssayNavigation from './learn/EssayNavigation';
import EssayContent from './learn/EssayContent';
import DiagramComponent from './learn/DiagramComponent';

// Import essay utilities
import { getEssayContent, getAvailableEssays } from './learn/essayUtils';

const LearnPage = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedEssay, setSelectedEssay] = useState('The Why and How of Vector Embeddings');
  const [essayContent, setEssayContent] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // List of available essays
  const essays = getAvailableEssays();

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

  // Load essay content when selected essay changes
  useEffect(() => {
    // Get content from our utility
    const content = getEssayContent(selectedEssay);
    setEssayContent(content);
    // Reset scroll position when essay changes
    setScrollPosition(0);
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
              onSelectEssay={setSelectedEssay} 
            />
          </div>
        </div>

        <div className="learn-content">
          <div className="essay-content-container" onScroll={handleScroll}>
            <EssayContent 
              content={essayContent} 
              title={selectedEssay} 
              scrollPosition={scrollPosition}
            />
          </div>

          <div className="diagram-container">
            <DiagramComponent 
              essayTitle={selectedEssay} 
              scrollPosition={scrollPosition} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage; 