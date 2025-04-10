import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchWordData } from '../features/wordCache/wordCacheSlice';
import VectorGraph from './VectorGraph';
import WordInput from './WordInput';
import Tools from './Tools';
import ViewButton from './ViewButton';
import SuggestedWords from './SuggestedWords';
import { getApiUrl } from '../utils/environment';
import { Link, useLocation } from 'react-router-dom';
import { hasPrecomputedEmbedding, createWordResult } from '../data/wordEmbeddings';
import LearnPanel from './learn-panel/LearnPanel';
import IntroModal from './IntroModal';
import luminodeLogo from '../assets/luminodeLogoSmall.png';

const HomePage = () => {
  const [words, setWords] = useState([]);
  const [relatedClusters, setRelatedClusters] = useState([]);
  const [error, setError] = useState(null);
  const [numNeighbors] = useState(5); // Default to 5 neighbors
  const [viewMode, setViewMode] = useState('2D'); // Default to 2D view
  const [rulerActive, setRulerActive] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [analogyMode, setAnalogyMode] = useState(false);
  const [analogyStep, setAnalogyStep] = useState(0);
  const [isSearchingAnalogy, setIsSearchingAnalogy] = useState(false);
  const [sliceMode, setSliceMode] = useState(false);
  const [learnMode, setLearnMode] = useState(false);
  const [activeTool, setActiveTool] = useState('Vector Embeddings');
  const [showIntroModal, setShowIntroModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Check if this is the first visit and show intro modal
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('luminode_has_seen_intro');
    // Show intro modal if user hasn't seen it before or is coming from landing page
    if (!hasSeenIntro || location.state?.fromLanding) {
      setShowIntroModal(true);
      // Mark that the user has seen the intro
      localStorage.setItem('luminode_has_seen_intro', 'true');
    }
  }, [location]);
  
  // Handle closing the intro modal
  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
  };
  
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
      
      // Check if we have a pre-computed embedding
      if (hasPrecomputedEmbedding(word)) {
        return;
      }
      
      // If no pre-computed embedding, fetch via Redux thunk
      setError(null);

      console.log(`[HomePage] Dispatching fetchWordData for: ${word}`);
      dispatch(fetchWordData(word))
        .unwrap()
        .then((result) => {
          if (!result.data.exists) {
            console.warn(`Word "${word}" added but not found in embeddings.`);
          }
        })
        .catch((fetchError) => {
          console.error('[HomePage] Error fetching word data via thunk:', fetchError);
          setError(fetchError.error || 'Failed to check word existence.');
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

  const triggerMidpointSelection = () => {
    // Ensure other modes are off
    setAnalogyMode(false);
    setSliceMode(false);
    // Turn on midpoint selection mode
    setSelectionMode(true);
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="sidebar">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img src={luminodeLogo} alt="Luminode" />
              <span className="logo-text">Luminode</span>
            </Link>
          </div>
          
          <WordInput 
            words={words}
            setWords={setWords}
            setResponse={setError}
            setLoading={setError}
            setError={setError}
            loading={error}
            setRelatedClusters={setRelatedClusters}
            showWordTags={false}
          />
          
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
          
          <div className="suggestions-section">
            <SuggestedWords 
              onWordSelect={handleWordSelect}
              currentWords={words}
              numSuggestions={8}
            />
          </div>
        </div>
        
        <div className="content-area">
          <div className="tools-bar">
            <Tools
              words={words}
              numMidpoints={numNeighbors}
              setMidpointClusters={debugSetRelatedClusters}
              setLoading={setError}
              setError={setError}
              loading={error}
              wordsValid={words.some(word => word.exists)}
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
              learnMode={learnMode}
              setLearnMode={setLearnMode}
              setActiveTool={setActiveTool}
            />
          </div>
          
          <div className={`graph-and-learn-container ${learnMode ? 'with-learn-panel' : ''}`}>
            <div className={`graph-area ${learnMode ? 'with-learn-panel' : ''}`}>
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
            
            {learnMode && (
              <div className="learn-panel-container">
                <LearnPanel 
                  activeTool={activeTool} 
                  onClose={() => setLearnMode(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Intro Modal */}
      <IntroModal 
        isOpen={showIntroModal} 
        onClose={handleCloseIntroModal} 
      />
      
      <style jsx="true">{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 10px); /* Reduced from 80px to 40px to extend content area */
        }
        
        .header {
          padding: 1rem;
        }
        
        .main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          margin-bottom: 0; /* Remove any bottom margin */
        }

        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.5rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #f8fafc;
          transition: opacity 0.2s ease;
        }

        .logo-link:hover {
          opacity: 0.9;
        }

        .logo-container img {
          height: 40px;
          width: auto;
          margin-right: 10px;
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 0.5px;
        }
        
        .sidebar {
          width: 300px;
          padding: 1rem;
          overflow-y: auto;
          background-color: #0f0f10;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: 100%; /* Ensure full height */
        }
        
        .words-container {
          max-height: 120px;
          overflow-y: auto;
          margin-bottom: 0.5rem;
          flex-shrink: 0; /* Prevent container from shrinking */
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
        
        .error-message {
          color: #FF5757;
          padding: 0.25rem 0.5rem;
          background-color: rgba(255, 87, 87, 0.1);
          border-radius: 4px;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          max-height: 60px;
          overflow-y: auto;
          flex-shrink: 0; /* Prevent error message from shrinking */
        }
        
        .suggestions-section {
          margin-top: auto; /* Push to bottom */
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
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
          margin-bottom: 5px; /* Reduced from 10px to 5px */
        }
        
        .graph-and-learn-container {
          display: flex;
          flex: 1;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        
        .graph-area {
          flex: 1;
          min-height: 500px;
          position: relative;
          overflow: hidden;
          padding-bottom: 0; /* Ensure no padding at bottom */
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        
        .graph-area > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .graph-area.with-learn-panel {
          flex: 2; /* Change from 3 to 2 to give the learn panel more space */
        }
        
        .learn-panel-container {
          flex: 1; /* Keep this as is - now it will take up 1/3 of the space instead of 1/4 */
          height: 100%;
          padding-left: 10px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
      `}</style>
    </div>
  );
};

export default HomePage; 