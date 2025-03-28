import React, { useState } from 'react';
import MidpointToolbar from './MidpointToolbar';
import AnalogyToolbar from './AnalogyToolbar';
import ViewButton from './ViewButton';
import MidpointSelection from './MidpointSelection';
import { findMidpoint, processMidpointResults } from '../utils/vectorCalculation';
import './ToolbarStyles.css';

// Import icons from a reliable source like Feather or include SVG directly
const MidpointIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const AnalogyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 1 1 0 5.7"></path>
    <path d="M10 13a2.85 2.85 0 1 1 0 5.7"></path>
    <line x1="10" y1="7" x2="17" y2="7"></line>
    <line x1="7" y1="13" x2="13" y2="13"></line>
  </svg>
);

const RulerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
    <path d="M6 8v.01"></path>
    <path d="M9 8v.01"></path>
    <path d="M12 8v.01"></path>
    <path d="M15 8v.01"></path>
    <path d="M18 8v.01"></path>
    <path d="M6 12v.01"></path>
    <path d="M18 12v.01"></path>
    <path d="M6 16v.01"></path>
    <path d="M9 16v.01"></path>
    <path d="M12 16v.01"></path>
    <path d="M15 16v.01"></path>
    <path d="M18 16v.01"></path>
  </svg>
);

// Wrapper function for better debugging of setMidpointClusters
const createDebugSetMidpointClusters = (setMidpointClusters) => {
  return (clusters) => {
    console.log('Setting midpoint clusters:', clusters);
    return setMidpointClusters(clusters);
  };
};

const Tools = ({
  words,
  numMidpoints,
  setMidpointClusters,
  setLoading,
  setError,
  loading,
  wordsValid,
  viewMode,
  setViewMode,
  rulerActive,
  setRulerActive,
  selectionMode,
  setSelectionMode,
  selectedPoints,
  setSelectedPoints
}) => {
  const [activeTab, setActiveTab] = useState('midpoint');
  const [showContent, setShowContent] = useState(true);
  
  // Debug: Check the type of setMidpointClusters
  console.log('Tools component:', {
    hasSetMidpointClusters: !!setMidpointClusters,
    typeSetMidpointClusters: typeof setMidpointClusters
  });
  
  // Create debug wrapper for setMidpointClusters
  const debugSetMidpointClusters = createDebugSetMidpointClusters(setMidpointClusters);

  const handleTabClick = (tab) => {
    if (tab === activeTab) {
      setShowContent(!showContent);
    } else {
      setActiveTab(tab);
      setShowContent(true);
    }
    
    // Cancel selection mode when switching tabs
    if (tab !== 'midpoint' && selectionMode) {
      setSelectionMode(false);
    }
  };
  
  // Find midpoint for the selected points
  const findMidpointForSelectedPoints = async () => {
    if (selectedPoints.length !== 2) {
      setError('Please select two points first');
      return;
    }
    
    const [word1, word2] = selectedPoints;
    
    setLoading(true);
    
    try {
      // Call the midpoint API
      const results = await findMidpoint(word1, word2, numMidpoints, 0, true);
      
      // Process the results into visualization format
      const midpointCluster = processMidpointResults(results, word1, word2, 0);
      
      // Update visualization
      debugSetMidpointClusters([midpointCluster]);
      
      // Exit selection mode
      setSelectionMode(false);
      
    } catch (error) {
      console.error('Error finding midpoint:', error);
      setError(`Failed to find midpoint: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
  };

  const renderToolContent = () => {
    if (!showContent) return null;
    
    if (selectionMode) {
      return (
        <MidpointSelection 
          selectedPoints={selectedPoints}
          onReset={() => setSelectedPoints([])}
          onFindMidpoint={findMidpointForSelectedPoints}
          onCancel={() => setSelectionMode(false)}
          loading={loading}
        />
      );
    }
    
    switch (activeTab) {
      case 'midpoint':
        return (
          <MidpointToolbar
            words={words}
            numMidpoints={numMidpoints}
            setMidpointClusters={debugSetMidpointClusters}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            wordsValid={wordsValid}
            onEnterSelectionMode={toggleSelectionMode}
          />
        );
      case 'analogy':
        return (
          <AnalogyToolbar
            words={words}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            wordsValid={wordsValid}
            setMidpointClusters={debugSetMidpointClusters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="tools-container">
      <div className="tools-header">
        <div className="tool-buttons">
          <button
            className={`icon-button ${activeTab === 'midpoint' ? 'active' : ''} ${selectionMode ? 'selection-active' : ''}`}
            onClick={() => selectionMode ? toggleSelectionMode() : handleTabClick('midpoint')}
            disabled={loading && !selectionMode}
            title={selectionMode ? "Click to cancel selection mode" : "Midpoint"}
          >
            <MidpointIcon />
            <span>{selectionMode ? `Select words (${selectedPoints.length}/2)` : "Midpoint"}</span>
          </button>
          
          <button
            className={`icon-button ${activeTab === 'analogy' ? 'active' : ''}`}
            onClick={() => handleTabClick('analogy')}
            disabled={loading || selectionMode}
            title="Analogy"
          >
            <AnalogyIcon />
            <span>Analogy</span>
          </button>
          
          <div className="spacer"></div>
          
          <button
            className={`icon-button ${rulerActive ? 'active' : ''}`}
            onClick={() => setRulerActive(!rulerActive)}
            title="Ruler"
          >
            <RulerIcon />
          </button>
          
          <ViewButton 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            isCompact={true}
          />
        </div>
      </div>
      
      <div className={`tool-content ${showContent ? 'visible' : 'hidden'}`}>
        {renderToolContent()}
      </div>
      
      <style jsx="true">{`
        .tools-container {
          display: flex;
          flex-direction: column;
          background-color: #0f0f10;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .tools-header {
          padding: 0.25rem;
          border-bottom: 1px solid #222;
        }
        
        .tool-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.25rem;
        }
        
        .icon-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          color: #ccc;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .icon-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .icon-button.active {
          background: rgba(66, 133, 244, 0.1);
          color: #4285F4;
          box-shadow: inset 0 -2px 0 #4285F4;
        }
        
        .icon-button.selection-active {
          background: rgba(52, 168, 83, 0.15);
          color: #34A853;
          box-shadow: inset 0 -2px 0 #34A853;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .icon-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .spacer {
          flex-grow: 1;
        }
        
        .tool-content {
          transition: max-height 0.3s ease, opacity 0.2s ease;
          overflow: hidden;
        }
        
        .tool-content.visible {
          max-height: 500px;
          opacity: 1;
        }
        
        .tool-content.hidden {
          max-height: 0;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Tools;