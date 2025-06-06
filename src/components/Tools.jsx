import React, { useState } from 'react';
import MidpointSelection from './MidpointSelection';
import AnalogySelection from './AnalogySelection';
import SliceSelection from './SliceSelection';
import ViewButton from './ViewButton';
import { findMidpoint, processMidpointResults } from '../utils/vectorCalculation';
import { findAnalogy } from '../utils/findAnalogy';
import { findSlice, processSliceResults } from '../utils/sliceCalculation';
import { findNeighbors, processNeighborsResults } from '../utils/findNeighbors';
import { createToolbarTooltip, removeToolbarTooltip } from './ToolbarTooltip';
import './ToolbarStyles.css';

// Import icons from a reliable source like Feather or include SVG directly
// Book icon for Learn button
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const MidpointIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const AnalogyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="8" r="2"></circle>
    <circle cx="7" cy="16" r="2"></circle>
    <circle cx="17" cy="8" r="2"></circle>
    <circle cx="17" cy="16" r="2"></circle>
  </svg>
);

const SliceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="19" x2="19" y2="5"></line>
  </svg>
);

const RulerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8z"></path>
    <path d="M18 16V8"></path>
    <path d="M14 16V8"></path>
    <path d="M10 16V8"></path>
    <path d="M6 16V8"></path>
  </svg>
);

const NeighborsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8"></circle>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="12" y1="2" x2="12" y2="4"></line>
    <line x1="12" y1="20" x2="12" y2="22"></line>
    <line x1="20" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="12" x2="4" y2="12"></line>
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
  setIsSearchingAnalogy,
  sliceMode,
  setSliceMode,
  learnMode,
  setLearnMode,
  setActiveTool
}) => {
  const [activeTab, setActiveTab] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [neighborsActive, setNeighborsActive] = useState(false);
  
  // Debug: Check the type of setMidpointClusters
  console.log('Tools component:', {
    hasSetMidpointClusters: !!setMidpointClusters,
    typeSetMidpointClusters: typeof setMidpointClusters
  });
  
  // Create debug wrapper for setMidpointClusters
  const debugSetMidpointClusters = createDebugSetMidpointClusters(setMidpointClusters);

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`, { 
      currentActiveTab: activeTab, 
      selectionMode, 
      analogyMode,
      sliceMode 
    });
    
    if (tab === activeTab) {
      // If clicking on tab when already active, toggle appropriate mode
      if (tab === 'analogy') {
        console.log('Toggling analogy mode');
        toggleAnalogyMode();
      } else if (tab === 'slice') {
        console.log('Toggling slice mode');
        toggleSliceMode();
      } else {
        setShowContent(!showContent);
      }
    } else {
      // Switching to a different tab
      console.log(`Switching tabs from ${activeTab} to ${tab}`);
      setActiveTab(tab);
      setShowContent(true);
      
      // Cancel selection mode when switching tabs
      if (selectionMode) {
        console.log('Canceling selection mode due to tab switch');
        setSelectionMode(false);
        setSelectedPoints([]);
      }
      
      // Cancel analogy mode when switching away from analogy tab
      if (analogyMode && tab !== 'analogy') {
        console.log('Canceling analogy mode due to tab switch');
        setAnalogyMode(false);
        setAnalogyStep(0);
        setSelectedPoints([]);
      }

      // Cancel slice mode when switching away from slice tab
      if (sliceMode && tab !== 'slice') {
        console.log('Canceling slice mode due to tab switch');
        setSliceMode(false);
        setSelectedPoints([]);
      }
      
      // Activate the appropriate mode for the tab
      if (tab === 'analogy' && !analogyMode) {
        console.log('Activating analogy mode on tab switch');
        toggleAnalogyMode();
      } else if (tab === 'slice' && !sliceMode) {
        console.log('Activating slice mode on tab switch');
        toggleSliceMode();
      }
    }
  };
  
  // Toggle analogy mode
  const toggleAnalogyMode = () => {
    if (analogyMode) {
      console.log('Turning off analogy mode');
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSelectedPoints([]);
      setIsSearchingAnalogy(false);
    } else {
      // Ensure other modes are off
      console.log('Turning on analogy mode');
      setSelectionMode(false);
      setSliceMode(false);
      // Turn on analogy mode
      setAnalogyMode(true);
      setAnalogyStep(0);
      setSelectedPoints([]);
      
      // Log the state immediately after setting
      setTimeout(() => {
        console.log('Analogy mode state after toggle:', {
          analogyMode,
          analogyStep,
          selectedPoints: selectedPoints.length
        });
      }, 0);
    }
  };

  // Toggle slice mode
  const toggleSliceMode = () => {
    if (sliceMode) {
      console.log('Turning off slice mode');
      setSliceMode(false);
      setSelectedPoints([]);
    } else {
      // Ensure other modes are off
      console.log('Turning on slice mode');
      setSelectionMode(false);
      setAnalogyMode(false);
      // Turn on slice mode
      setSliceMode(true);
      setSelectedPoints([]);
    }
  };
  
  // Check if a word is already selected
  const isWordAlreadySelected = (word) => {
    return selectedPoints.includes(word);
  };
  
  // Function to validate if a new analogy selection is valid (renamed with underscore to satisfy linter)
  const _validateAnalogySelection = (word) => {
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
      console.error('Cannot find midpoint: need exactly 2 words, got', selectedPoints.length);
      setError('Please select two points first');
      return;
    }
    
    const [word1, word2] = selectedPoints;
    console.log(`Finding midpoint between "${word1}" and "${word2}" with ${numMidpoints} results`);
    
    setLoading(true);
    
    try {
      // Call the midpoint API
      const results = await findMidpoint(word1, word2, numMidpoints, 0, true);
      console.log('Midpoint results received:', results);
      
      // Process the results into visualization format
      const midpointCluster = processMidpointResults(results, word1, word2, 0);
      console.log('Processed midpoint cluster:', midpointCluster);
      
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

  // Find slice for the selected points
  const findSliceForSelectedPoints = async () => {
    if (selectedPoints.length !== 2) {
      console.error('Cannot find slice: need exactly 2 words, got', selectedPoints.length);
      setError('Please select start and end points first');
      return;
    }
    
    const [word1, word2] = selectedPoints;
    console.log(`Finding slice between "${word1}" and "${word2}"`);
    
    setLoading(true);
    
    try {
      console.log('Initiating slice calculation with parameters:', {
        word1, 
        word2, 
        numResults: numMidpoints,
        maxDepth: 20
      });
      
      // Call the slice API
      const results = await findSlice(word1, word2, numMidpoints, 20);
      console.log('Slice results received:', results);
      
      // Process the results into visualization format
      const sliceCluster = processSliceResults(results, word1, word2);
      console.log('Processed slice cluster:', sliceCluster);
      
      // Update visualization
      debugSetMidpointClusters([sliceCluster]);
      
      // Exit slice mode
      setSliceMode(false);
      
    } catch (error) {
      console.error('Error finding slice:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'Failed to find slice';
      
      if (error.message.includes('404')) {
        errorMessage = 'The slice API endpoint returned a 404 error. The server may need to be restarted.';
      } else if (error.message.includes('timeout') || error.message.includes('Network Error')) {
        errorMessage = 'Connection timed out. Please check your network and server status.';
      } else {
        errorMessage = `Failed to find slice: ${error.message}`;
      }
      
      setError(errorMessage);
      
      // Log additional debugging info
      console.debug('Slice calculation failed with details:', {
        selectedPoints,
        error: error.message,
        originalError: error.originalError,
        requestDetails: error.requestDetails
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to handle step transitions in analogy mode
  React.useEffect(() => {
    console.log('Analogy mode effect triggered:', { 
      selectedPoints, 
      analogyMode,
      analogyStep, 
      count: selectedPoints.length 
    });
    
    if (analogyMode) {
      // Update step based on number of selected points
      if (selectedPoints.length === 1 && analogyStep === 0) {
        console.log('Moving to analogy step 1 - first word selected');
        setAnalogyStep(1);
      } else if (selectedPoints.length === 2 && analogyStep === 1) {
        console.log('Moving to analogy step 2 - second word selected');
        setAnalogyStep(2);
      } else if (selectedPoints.length === 3 && analogyStep === 2) {
        console.log('Moving to analogy step 3 - third word selected, starting analogy search');
        // We're ready to search
        setAnalogyStep(3);
        // Automatically start the search without using useEffect to avoid dependency issues
        setTimeout(() => {
          findAnalogyForSelectedPoints();
        }, 0);
      }
    }
  }, [analogyMode, selectedPoints, analogyStep]);
  
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
  
  // Handle point selection for midpoint - no longer auto-triggering calculation
  React.useEffect(() => {
    console.log('Selected points updated:', {
      selectedPoints,
      selectionMode,
      sliceMode,
      count: selectedPoints.length
    });
    
    // We no longer automatically trigger the midpoint calculation
    // This is now handled by the explicit Calculate button
    // Instead, we just log the state for debugging
  }, [selectedPoints, selectionMode, sliceMode]);
  
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

  // Reset slice selection
  const resetSliceSelection = () => {
    setSelectedPoints([]);
  };
  
  // Cancel slice selection
  const cancelSliceSelection = () => {
    setSliceMode(false);
    setSelectedPoints([]);
  };

  // Handle finding neighbors for all words in the visualization
  const handleNeighborsToggle = async () => {
    // Toggle the state
    const newState = !neighborsActive;
    setNeighborsActive(newState);
    
    if (!newState) {
      // If turning off, clear visualizations
      debugSetMidpointClusters([]);
      return;
    }
    
    // Continue only if turning on
    if (words.length === 0) {
      setError('Please add some words first');
      setNeighborsActive(false); // Revert
      return;
    }
    
    setLoading(true);
    
    try {
      // Find nearest neighbors for each word
      const neighborsClusters = [];
      
      // Process words sequentially to avoid overwhelming the API
      for (const word of words) {
        try {
          console.log(`Finding neighbors for ${word}`);
          const results = await findNeighbors(word, 4); // 4 neighbors per word
          
          if (results && results.nearestWords) {
            const cluster = processNeighborsResults(results, word);
            neighborsClusters.push(cluster);
          }
        } catch (wordError) {
          console.error(`Error finding neighbors for "${word}":`, wordError);
          // Continue with other words even if one fails
        }
      }
      
      // Update visualization with all clusters
      if (neighborsClusters.length > 0) {
        console.log(`Found neighbors for ${neighborsClusters.length} words`);
        debugSetMidpointClusters(neighborsClusters);
      } else {
        setError('No neighbors found for any words');
        setNeighborsActive(false); // Revert
      }
    } catch (error) {
      console.error('Error finding neighbors:', error);
      setError(`Failed to find neighbors: ${error.message}`);
      setNeighborsActive(false); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  // Toggle learn mode
  const toggleLearnMode = () => {
    setLearnMode(!learnMode);
    
    // When enabling learn mode, set the active tool based on the current state
    if (!learnMode) {
      if (viewMode === '2D/3D') {
        setActiveTool('2D/3D');
      } else if (rulerActive) {
        setActiveTool('Measure');
      } else if (analogyMode) {
        setActiveTool('Analogy');
      } else if (sliceMode) {
        setActiveTool('Slice');
      } else {
        setActiveTool('Vector Embeddings');
      }
    }
  };

  // Track active tool when buttons are clicked
  const trackToolActivity = (toolName) => {
    if (learnMode) {
      setActiveTool(toolName);
    }
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
          onCalculate={findMidpointForSelectedPoints}
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

    if (sliceMode) {
      return (
        <SliceSelection 
          selectedPoints={selectedPoints}
          onReset={resetSliceSelection}
          onCancel={cancelSliceSelection}
          onCalculate={findSliceForSelectedPoints}
          loading={loading}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="tools-container">
      <div className="tools-header">
        <div className="tool-buttons">
          <ViewButton 
            viewMode={viewMode} 
            setViewMode={(mode) => {
              setViewMode(mode);
              trackToolActivity('3D');
            }} 
            isCompact={true}
            onMouseEnter={(e) => createToolbarTooltip('3D', e)}
            onMouseLeave={() => removeToolbarTooltip()}
          />

          <button
            className={`icon-button ${rulerActive ? 'active' : ''}`}
            onClick={() => {
              setRulerActive(!rulerActive);
              trackToolActivity('Measure');
            }}
            onMouseEnter={(e) => createToolbarTooltip('Measure', e)}
            onMouseLeave={() => removeToolbarTooltip()}
          >
            <RulerIcon />
            <span>Measure</span>
          </button>
          
          <button
            className={`icon-button ${neighborsActive ? 'active' : ''}`}
            onClick={() => {
              handleNeighborsToggle();
              trackToolActivity('Neighbors');
            }}
            disabled={loading || words.length === 0}
            onMouseEnter={(e) => createToolbarTooltip('Neighbors', e)}
            onMouseLeave={() => removeToolbarTooltip()}
          >
            <NeighborsIcon />
            <span>Neighbors</span>
          </button>
          
          <button
            className={`icon-button ${activeTab === 'analogy' ? 'active' : ''} ${analogyMode ? 'analogy-active' : ''}`}
            onClick={() => {
              handleTabClick('analogy');
              trackToolActivity('Analogy');
            }}
            disabled={loading || selectionMode || sliceMode}
            onMouseEnter={(e) => createToolbarTooltip('Analogy', e)}
            onMouseLeave={() => removeToolbarTooltip()}
          >
            <AnalogyIcon />
            <span>{analogyMode ? `Analogy (Step ${analogyStep + 1})` : "Analogy"}</span>
          </button>

          <button
            className={`icon-button ${activeTab === 'slice' ? 'active' : ''} ${sliceMode ? 'slice-active' : ''}`}
            onClick={() => {
              handleTabClick('slice');
              trackToolActivity('Slice');
            }}
            disabled={loading || selectionMode || analogyMode}
            onMouseEnter={(e) => createToolbarTooltip('Slice', e)}
            onMouseLeave={() => removeToolbarTooltip()}
          >
            <SliceIcon />
            <span>{sliceMode ? `Slice (${selectedPoints.length}/2)` : "Slice"}</span>
          </button>
          
          <div className="spacer"></div>
          
          <button 
            className={`icon-button learn-button ${learnMode ? 'active' : ''}`}
            onClick={toggleLearnMode}
          >
            <BookIcon />
            <span>Learn</span>
          </button>
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
          padding: 0.15rem 0.25rem;
          border-bottom: 1px solid #222;
        }
        
        .tool-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.25rem;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #f8fafc;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.3px;
          padding: 0.15rem 0.25rem;
          border-radius: 4px;
          transition: all 0.15s ease;
          margin-right: 0.5rem;
        }
        
        .logo-link:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .toolbar-logo-image {
          height: 20px;
          width: auto;
          margin-right: 6px;
        }
        
        .logo-text {
          white-space: nowrap;
          font-size: 0.9rem;
        }
        
        .icon-button {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          color: #ccc;
          border: none;
          padding: 0.4rem 0.7rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .icon-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .learn-button {
          color: #FF9D42;
          margin-right: 1rem;
        }
        
        .learn-button:hover {
          background: rgba(255, 157, 66, 0.1);
          color: #FFC837;
        }
        
        .learn-button svg {
          stroke: currentColor;
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

        .icon-button.slice-active {
          background: rgba(142, 68, 173, 0.15);
          color: #8E44AD;
          box-shadow: inset 0 -2px 0 #8E44AD;
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
          min-width: 0.5rem;
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
        
        .reset-button {
          color: #ff7043;
        }
        
        .reset-button:hover {
          background: rgba(255, 112, 67, 0.1);
          color: #ff7043;
        }
        
        .learn-button.active {
          background: rgba(255, 157, 66, 0.2);
          color: #FF9D42;
          box-shadow: inset 0 -2px 0 #FF9D42;
        }
      `}</style>
    </div>
  );
};

// Add a Reset icon (trash can or refresh symbol)
const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

export default Tools;