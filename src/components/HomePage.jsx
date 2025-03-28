import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VectorGraph from './VectorGraph';
import WordInput from './WordInput';
import Tools from './Tools';
import ViewButton from './ViewButton';
import SuggestedWords from './SuggestedWords';
import { getApiUrl } from '../utils/environment';

const HomePage = () => {
  const [words, setWords] = useState([]);
  const [response, setResponse] = useState(null);
  const [relatedClusters, setRelatedClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numNeighbors, setNumNeighbors] = useState(5); // Default to 5 neighbors
  const [viewMode, setViewMode] = useState('2D'); // Default to 2D view
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [analogyMode, setAnalogyMode] = useState(false);
  const [analogyStep, setAnalogyStep] = useState(0);
  const [isSearchingAnalogy, setIsSearchingAnalogy] = useState(false);
  const [sliceMode, setSliceMode] = useState(false); // Add state for slice mode
  
  // Debug: Log the state functions
  console.log('HomePage component:', {
    setRelatedClustersType: typeof setRelatedClusters
  });
  
  // Add effect to monitor relatedClusters changes
  useEffect(() => {
    console.log('relatedClusters changed:', relatedClusters);
  }, [relatedClusters]);
  
  // Create a debug wrapper for setRelatedClusters
  const debugSetRelatedClusters = (newClusters) => {
    console.log('Setting related clusters:', newClusters);
    setRelatedClusters(newClusters);
  };

  const handleWordSelect = (word) => {
    if (!words.includes(word)) {
      const updatedWords = [...words, word];
      setWords(updatedWords);
      
      // Trigger API call to check the word and update visualization
      setLoading(true);
      setError(null);
      
      axios.post(getApiUrl('/api/checkWord'), { word })
        .then(response => {
          const wordResult = {
            word: word,
            exists: response.data.data.word.exists,
            vector: response.data.data.word.vector
          };
          
          setResponse(prev => ({
            message: `Added word: ${word}`,
            data: {
              words: prev?.data?.words ? [...prev.data.words, wordResult] : [wordResult]
            }
          }));
        })
        .catch(error => {
          console.error('Error checking word:', error);
          setError(error.response?.data?.error || 'An error occurred while processing your request');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  // Handle point selection from the graph
  const handlePointSelected = (word) => {
    if (!selectionMode && !analogyMode && !sliceMode) {
      console.log('Point selection ignored - not in selection, analogy, or slice mode:', word);
      return;
    }
    
    console.log('Point selected:', word, { 
      analogyMode, 
      selectionMode,
      sliceMode,
      analogyStep,
      currentSelectedPoints: selectedPoints 
    });
    
    if (analogyMode) {
      // Analogy mode selection logic
      if (selectedPoints.includes(word)) {
        console.log('Word already selected, showing error:', word);
        setError("Each word can only be used once in an analogy");
        return; // Already selected
      }
      
      // We need at most 3 words for analogy
      if (selectedPoints.length >= 3) {
        console.log('Already have 3 words, ignoring:', word);
        return;
      }
      
      // Clear any previous errors
      if (error) setError(null);
      
      // Add the new word to selected points
      console.log('Adding word to analogy selection:', word);
      const newSelection = [...selectedPoints, word];
      setSelectedPoints(newSelection);
      
      // Log immediately after setting
      setTimeout(() => {
        console.log('Updated selection after adding:', {
          newSelection,
          currentState: selectedPoints,
          analogyStep
        });
      }, 0);
      
      return;
    }
    
    if (selectionMode || sliceMode) {
      // Clear any previous errors
      if (error) setError(null);
      
      // Midpoint or Slice selection logic - they work the same way
      if (selectedPoints.includes(word)) {
        setSelectedPoints(selectedPoints.filter(p => p !== word));
      } else if (selectedPoints.length < 2) {
        setSelectedPoints([...selectedPoints, word]);
      } else {
        // Replace oldest point
        setSelectedPoints([selectedPoints[1], word]);
      }
    }
  };
  
  // Toggle selection mode
  const setPointSelectionMode = (active) => {
    setSelectionMode(active);
    if (!active) {
      setSelectedPoints([]);
    }
    
    // Ensure other modes are off when selection mode is on
    if (active) {
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSliceMode(false);
    }
  };
  
  // Set analogy mode
  const setAnalogySelectionMode = (active, step = 0) => {
    setAnalogyMode(active);
    setAnalogyStep(step);
    
    if (!active) {
      setSelectedPoints([]);
      setIsSearchingAnalogy(false);
    }
    
    // Ensure other modes are off when analogy mode is on
    if (active) {
      setSelectionMode(false);
      setSliceMode(false);
    }
  };
  
  // Set slice mode
  const setSliceSelectionMode = (active) => {
    setSliceMode(active);
    
    if (!active) {
      setSelectedPoints([]);
    }
    
    // Ensure other modes are off when slice mode is on
    if (active) {
      setSelectionMode(false);
      setAnalogyMode(false);
      setAnalogyStep(0);
    }
  };
  
  // Updated set searching analogy state
  const setSearchingAnalogy = (isSearching) => {
    setIsSearchingAnalogy(isSearching);
  };

  return (
    <div className="app-container">
      
      <div className="main-layout">
        <div className="sidebar">
          <WordInput 
            words={words}
            setWords={setWords}
            setResponse={setResponse}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            setRelatedClusters={setRelatedClusters}
            showWordTags={false}
          />
          
          <div className="compact-suggestions-toggle">
            <button 
              className="small-toggle-btn" 
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
            </button>
          </div>
          
          <div className="words-container">
            {words.length > 0 && (
              <div className="selected-words">
                {words.map((word, index) => (
                  <div key={`word-${index}`} className="word-tag">
                    {word}
                    <button 
                      className="remove-word" 
                      onClick={() => {
                        const newWords = [...words];
                        newWords.splice(index, 1);
                        setWords(newWords);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="sidebar-spacer"></div>
          
          {showSuggestions && (
            <div className="suggestions-wrapper">
              <SuggestedWords 
                onWordSelect={handleWordSelect}
                currentWords={words}
                numSuggestions={8}
              />
            </div>
          )}
        </div>
        
        <div className="content-area">
          <div className="tools-bar">
            <Tools
              words={words}
              numMidpoints={numNeighbors}
              setMidpointClusters={debugSetRelatedClusters}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
              wordsValid={response && response.data && response.data.words && 
                         response.data.words.some(word => word.exists)}
              viewMode={viewMode}
              setViewMode={setViewMode}
              rulerActive={rulerActive}
              setRulerActive={setRulerActive}
              selectionMode={selectionMode}
              setSelectionMode={setPointSelectionMode}
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
              analogyMode={analogyMode}
              setAnalogyMode={setAnalogySelectionMode}
              analogyStep={analogyStep}
              setAnalogyStep={setAnalogyStep}
              isSearchingAnalogy={isSearchingAnalogy}
              setIsSearchingAnalogy={setSearchingAnalogy}
              setWords={setWords}
              sliceMode={sliceMode}
              setSliceMode={setSliceSelectionMode}
            />
          </div>
          
          <div className="graph-area">
            <VectorGraph 
              words={words}
              midpointWords={relatedClusters}
              numMidpoints={numNeighbors}
              viewMode={viewMode}
              setViewMode={setViewMode}
              rulerActive={rulerActive}
              selectionMode={selectionMode || sliceMode} // Treat slice mode similar to selection mode
              onPointSelected={handlePointSelected}
              selectedPoints={selectedPoints}
              analogyMode={analogyMode}
              analogyStep={analogyStep}
              isSearchingAnalogy={isSearchingAnalogy}
            />
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        
        .header {
          padding: 1rem;
        }
        
        .main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .sidebar {
          width: 300px;
          padding: 1rem;
          overflow-y: auto;
          background-color: #0f0f10;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .compact-suggestions-toggle {
          display: flex;
          justify-content: flex-start;
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .small-toggle-btn {
          background-color: transparent;
          color: #FFC837;
          border: 1px solid #FFC837;
          border-radius: 4px;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .small-toggle-btn:hover {
          background-color: rgba(255, 200, 55, 0.1);
        }
        
        .words-container {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }
        
        .selected-words {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .word-tag {
          display: inline-flex;
          align-items: center;
          background-color: #2a2a2c;
          border-radius: 16px;
          padding: 0.25rem 0.75rem;
          font-size: 0.9rem;
        }
        
        .remove-word {
          background: none;
          border: none;
          color: #FF5757;
          margin-left: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .sidebar-spacer {
          min-height: 20px;
          flex-grow: 1;
        }
        
        .suggestions-wrapper {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .tools-bar {
          padding: 0;
          background-color: #0f0f10;
        }
        
        .graph-area {
          flex: 1;
          min-height: 500px;
          position: relative;
          overflow: hidden;
        }
        
        .graph-area > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .error-message {
          color: #FF5757;
          padding: 0.25rem 0.5rem;
          background-color: rgba(255, 87, 87, 0.1);
          border-radius: 4px;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          max-height: 60px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default HomePage; 