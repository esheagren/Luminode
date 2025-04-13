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
  return (
    <div className="diagram-container">
      <DiagramComponent />
    </div>
  );
};

// Construction Notification Component
const ConstructionNotification = ({ onClose }) => {
  return (
    <div className="construction-notification">
      <div className="notification-content">
        <h3>Under Construction</h3>
        <p>This page is currently under construction and may not display correctly.</p>
        <button onClick={onClose}>Got it</button>
      </div>
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
  const [showNotification, setShowNotification] = useState(true);

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

  // Close the notification
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="learn-page-container" ref={containerRef}>
      {showNotification && <ConstructionNotification onClose={handleCloseNotification} />}
      
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
      
      <style jsx>{`
        .construction-notification {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .notification-content {
          background-color: #1e1e1e;
          border: 1px solid rgba(217, 175, 93, 0.5);
          border-radius: 8px;
          padding: 20px 30px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          color: white;
        }

        .notification-content h3 {
          color: rgba(217, 175, 93, 0.9);
          margin-top: 0;
          font-size: 1.5rem;
        }

        .notification-content p {
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .notification-content button {
          background-color: rgba(217, 175, 93, 0.8);
          color: #111;
          border: none;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .notification-content button:hover {
          background-color: rgba(217, 175, 93, 1);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LearnPage; 