import React, { useState } from 'react';
import MidpointSelection from './MidpointSelection';
import AnalogySelection from './AnalogySelection';
import ViewButton from './ViewButton';
import { findMidpoint, processMidpointResults } from '../utils/vectorCalculation';
import { findAnalogy } from '../utils/findAnalogy';
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
  setSelectedPoints,
  analogyMode,
  setAnalogyMode,
  analogyStep,
  setAnalogyStep,
  isSearchingAnalogy,
  setIsSearchingAnalogy
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
      // If clicking on midpoint tab when already active, toggle selection mode
      if (tab === 'midpoint') {
        toggleMidpointSelectionMode();
      } else if (tab === 'analogy') {
        toggleAnalogyMode();
      } else {
        setShowContent(!showContent);
      }
    } else {
      // Switching to a different tab
      setActiveTab(tab);
      setShowContent(true);
      
      // Cancel selection mode when switching tabs
      if (selectionMode) {
        setSelectionMode(false);
        setSelectedPoints([]);
      }
      
      // Cancel analogy mode when switching away from analogy tab
      if (analogyMode && tab !== 'analogy') {
        setAnalogyMode(false);
        setAnalogyStep(0);
        setSelectedPoints([]);
      }
    }
  };
  
  // Toggle midpoint selection mode
  const toggleMidpointSelectionMode = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedPoints([]);
    } else {
      // Ensure analogy mode is off
      setAnalogyMode(false);
      // Turn on midpoint selection mode
      setSelectionMode(true);
    }
  };
  
  // Toggle analogy mode
  const toggleAnalogyMode = () => {
    if (analogyMode) {
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSelectedPoints([]);
    } else {
      // Ensure midpoint selection mode is off
      setSelectionMode(false);
      // Turn on analogy mode
      setAnalogyMode(true);
      setAnalogyStep(0);
      setSelectedPoints([]);
    }
  };
  
  // Check if a word is already selected
  const isWordAlreadySelected = (word) => {
    return selectedPoints.includes(word);
  };
  
  // Function to validate if a new analogy selection is valid
  const validateAnalogySelection = (word) => {
    // Check if the word is already selected in the analogy
    if (isWordAlreadySelected(word)) {
      setError("Each word can only be used once in the analogy");
      return false;
    }
    
    return true;
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
  
  // Effect to handle step transitions in analogy mode
  React.useEffect(() => {
    if (analogyMode) {
      console.log('Analogy mode effect triggered:', { 
        selectedPoints, 
        analogyStep, 
        count: selectedPoints.length 
      });
      
      // Update step based on number of selected points
      if (selectedPoints.length === 1 && analogyStep === 0) {
        setAnalogyStep(1);
      } else if (selectedPoints.length === 2 && analogyStep === 1) {
        setAnalogyStep(2);
      } else if (selectedPoints.length === 3 && analogyStep === 2) {
        console.log('Third word selected, starting analogy search');
        // We're ready to search
        setAnalogyStep(3);
        // Automatically start the search
        findAnalogyForSelectedPoints();
      }
    }
  }, [analogyMode, selectedPoints]);
  
  // Find analogy for the selected points
  const findAnalogyForSelectedPoints = async () => {
    if (selectedPoints.length !== 3) {
      console.log('Cannot find analogy: need exactly 3 words, got', selectedPoints.length);
      setError('Please select three points for analogy');
      return;
    }
    
    const [word1, word2, word3] = selectedPoints;
    console.log(`Finding analogy for ${word1}:${word2}::${word3}:?`);
    
    setIsSearchingAnalogy(true);
    setLoading(true);
    
    try {
      // Call the analogy API with timeout handling
      const timeout = setTimeout(() => {
        if (loading) {
          console.log('Analogy search taking too long, might be a backend issue');
          // Don't interrupt the actual search, just inform the user
          setError('The search is taking longer than expected. This might be due to backend service load.');
        }
      }, 8000); // Show warning after 8 seconds
      
      // Call the analogy API
      const response = await findAnalogy(word1, word2, word3, 5);
      
      clearTimeout(timeout);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('No analogy results found. The server may be experiencing issues.');
      }
      
      console.log('Analogy results:', response.data.results);
      
      // Process the results
      const analogyResults = response.data.results.map(result => ({
        word: result.word,
        score: result.score,
        isAnalogy: true,
        analogySource: {
          from: word3,
          relation: `${word1}:${word2}::${word3}:${result.word}`
        }
      }));
      
      // Create analogy cluster for visualization
      const analogyCluster = {
        type: 'analogy',
        source: {
          word1, word2, word3
        },
        words: [
          // Include the three input words
          { word: word1, isAnalogy: false },
          { word: word2, isAnalogy: false },
          { word: word3, isAnalogy: false },
          // Include analogy results
          ...analogyResults
        ]
      };
      
      // Update visualization
      debugSetMidpointClusters([analogyCluster]);
      
      // Move to step 4 (completed)
      setAnalogyStep(4);
      
    } catch (error) {
      console.error('Error finding analogy:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to find analogy';
      
      if (error.message?.includes('timeout') || error.message?.includes('504')) {
        errorMessage = 'The server timed out. The vector database might be experiencing high load. Please try again later.';
      } else if (error.message?.includes('No analogy')) {
        errorMessage = 'No strong analogies found. Try different words with clearer relationships.';
      } else {
        errorMessage = `Failed to find analogy: ${error.message || 'Unknown error'}`;
      }
      
      setError(errorMessage);
      
      // Reset to selection state
      setAnalogyStep(2);
    } finally {
      setLoading(false);
      setIsSearchingAnalogy(false);
    }
  };
  
  // Handle point selection for midpoint
  React.useEffect(() => {
    // Automatically find midpoint when two points are selected
    if (selectedPoints.length === 2 && selectionMode) {
      findMidpointForSelectedPoints();
    }
  }, [selectedPoints, selectionMode]);
  
  // Reset analogy selection
  const resetAnalogySelection = () => {
    setSelectedPoints([]);
    setAnalogyStep(0);
    setIsSearchingAnalogy(false);
  };
  
  // Cancel analogy selection
  const cancelAnalogySelection = () => {
    setAnalogyMode(false);
    setSelectedPoints([]);
    setAnalogyStep(0);
    setIsSearchingAnalogy(false);
  };

  const renderToolContent = () => {
    if (!showContent) return null;
    
    if (selectionMode) {
      return (
        <MidpointSelection 
          selectedPoints={selectedPoints}
          onReset={() => setSelectedPoints([])}
          onCancel={() => {
            setSelectionMode(false);
            setSelectedPoints([]);
          }}
          loading={loading}
        />
      );
    }
    
    if (analogyMode) {
      return (
        <AnalogySelection 
          selectedPoints={selectedPoints}
          analogyStep={analogyStep}
          onReset={resetAnalogySelection}
          onCancel={cancelAnalogySelection}
          loading={loading || isSearchingAnalogy}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="tools-container">
      <div className="tools-header">
        <div className="tool-buttons">
          <button
            className={`icon-button ${activeTab === 'midpoint' ? 'active' : ''} ${selectionMode ? 'selection-active' : ''}`}
            onClick={() => handleTabClick('midpoint')}
            disabled={loading || analogyMode}
            title={selectionMode ? "Click to cancel selection mode" : "Midpoint"}
          >
            <MidpointIcon />
            <span>{selectionMode ? `Select words (${selectedPoints.length}/2)` : "Midpoint"}</span>
          </button>
          
          <button
            className={`icon-button ${activeTab === 'analogy' ? 'active' : ''} ${analogyMode ? 'analogy-active' : ''}`}
            onClick={() => handleTabClick('analogy')}
            disabled={loading || selectionMode}
            title={analogyMode ? "Click to cancel analogy mode" : "Analogy"}
          >
            <AnalogyIcon />
            <span>{analogyMode ? `Analogy (Step ${analogyStep + 1})` : "Analogy"}</span>
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
        
        .icon-button.analogy-active {
          background: rgba(255, 128, 8, 0.15);
          color: #FF8008;
          box-shadow: inset 0 -2px 0 #FF8008;
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