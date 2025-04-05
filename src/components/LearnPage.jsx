import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './learn/LearnPage.css';

// Component imports
import EssayNavigation from './learn/EssayNavigation';
import EssayContent from './learn/EssayContent';
import DiagramComponent from './learn/DiagramComponent';

// Import essay utilities
import { getEssayContent, getAvailableEssays } from './learn/essayUtils';

const LearnPage = () => {
  const [selectedEssay, setSelectedEssay] = useState('Introduction');
  const [essayContent, setEssayContent] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // List of available essays
  const essays = getAvailableEssays();

  // Load essay content when selected essay changes
  useEffect(() => {
    // Get content from our utility
    const content = getEssayContent(selectedEssay);
    setEssayContent(content);
  }, [selectedEssay]);

  // Handle scroll events in the essay content area
  const handleScroll = (e) => {
    const position = e.target.scrollTop;
    setScrollPosition(position);
  };

  return (
    <div className="learn-page-container">
      <div className="learn-header">
        <Link to="/app" className="back-button">
          Back to Application
        </Link>
      </div>

      <div className="learn-content">
        <div className="essay-navigation">
          <EssayNavigation 
            essays={essays} 
            selectedEssay={selectedEssay} 
            onSelectEssay={setSelectedEssay} 
          />
        </div>

        <div className="essay-content-container" onScroll={handleScroll}>
          <EssayContent 
            content={essayContent} 
            title={selectedEssay} 
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
  );
};

export default LearnPage; 