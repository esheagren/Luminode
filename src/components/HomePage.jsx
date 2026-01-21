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
import HamburgerMenu from './common/HamburgerMenu';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

// Add reset icon component
const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

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
  const [linearPathMode, setLinearPathMode] = useState(false);
  const [greedyPathMode, setGreedyPathMode] = useState(false);
  const [learnMode, setLearnMode] = useState(false);
  const [activeTool, setActiveTool] = useState('Vector Embeddings');
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile]); // Removed sidebarOpen to prevent potential infinite loops

  // Close sidebar on Escape key for accessibility
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [sidebarOpen]);
  
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
    if (!selectionMode && !analogyMode && !sliceMode && !linearPathMode && !greedyPathMode) {
      console.log('Point selection ignored - not in any selection mode:', word);
      return;
    }

    console.log('Point selected:', word, {
      analogyMode,
      selectionMode,
      sliceMode,
      linearPathMode,
      greedyPathMode,
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
    
    if (selectionMode || sliceMode || linearPathMode || greedyPathMode) {
      // Clear any previous errors
      if (error) setError(null);

      // Midpoint, Slice, Linear Path, or Greedy Path selection logic - they work the same way
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
      setLinearPathMode(false);
      setGreedyPathMode(false);
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
      setLinearPathMode(false);
      setGreedyPathMode(false);
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
      setLinearPathMode(false);
      setGreedyPathMode(false);
    }
  };

  // Set linear path mode
  const setLinearPathSelectionMode = (active) => {
    setLinearPathMode(active);

    if (!active) {
      setSelectedPoints([]);
    }

    // Ensure other modes are off when linear path mode is on
    if (active) {
      setSelectionMode(false);
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSliceMode(false);
      setGreedyPathMode(false);
    }
  };

  // Set greedy path mode
  const setGreedyPathSelectionMode = (active) => {
    setGreedyPathMode(active);

    if (!active) {
      setSelectedPoints([]);
    }

    // Ensure other modes are off when greedy path mode is on
    if (active) {
      setSelectionMode(false);
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSliceMode(false);
      setLinearPathMode(false);
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

  // Handle Reset functionality
  const handleReset = () => {
    console.log('Resetting all words and visualization');
    
    // Clear all words
    setWords([]);
    
    // Clear visualizations/clusters
    setRelatedClusters([]);
    
    // Reset selection modes
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedPoints([]);
    }
    
    // Reset analogy mode
    if (analogyMode) {
      setAnalogyMode(false);
      setAnalogyStep(0);
      setSelectedPoints([]);
      setIsSearchingAnalogy(false);
    }

    // Reset slice mode
    if (sliceMode) {
      setSliceMode(false);
      setSelectedPoints([]);
    }

    // Reset linear path mode
    if (linearPathMode) {
      setLinearPathMode(false);
      setSelectedPoints([]);
    }

    // Reset greedy path mode
    if (greedyPathMode) {
      setGreedyPathMode(false);
      setSelectedPoints([]);
    }

    // Clear any errors
    setError(null);
  };

  // Mobile-specific layout: Graph on top, input at bottom
  if (isMobile) {
    return (
      <div className="mobile-app-container">
        {/* Graph area - takes most of the screen */}
        <div className="mobile-graph-area">
          <VectorGraph
            words={words}
            midpointWords={relatedClusters}
            numMidpoints={numNeighbors}
            viewMode={viewMode}
            setViewMode={setViewMode}
            rulerActive={rulerActive}
            selectionMode={selectionMode || sliceMode || linearPathMode || greedyPathMode}
            onPointSelected={handlePointSelected}
            selectedPoints={selectedPoints}
            analogyMode={analogyMode}
            analogyStep={analogyStep}
            isSearchingAnalogy={isSearchingAnalogy}
          />

          {/* Floating 2D/3D toggle */}
          <div className="mobile-view-toggle">
            <ViewButton
              viewMode={viewMode}
              setViewMode={setViewMode}
              isCompact={true}
            />
          </div>

          {/* Floating info button for sidebar */}
          <button
            className="mobile-info-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>

        {/* Selected words bar - shows current words */}
        {words.length > 0 && (
          <div className="mobile-words-bar">
            <div className="mobile-words-scroll">
              {words.map((word, index) => (
                <div key={`word-${index}`} className="mobile-word-tag">
                  {word}
                  <button
                    className="mobile-remove-word"
                    onClick={() => {
                      const newWords = [...words];
                      newWords.splice(index, 1);
                      setWords(newWords);
                      // Clear related clusters when all words are removed
                      if (newWords.length === 0) {
                        setRelatedClusters([]);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mobile-reset-btn"
              onClick={handleReset}
              title="Reset all"
            >
              <ResetIcon />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mobile-error">
            {error}
          </div>
        )}

        {/* Tools bar - always visible */}
        <div className="mobile-tools-bar">
          <Tools
            words={words}
            numMidpoints={numNeighbors}
            setMidpointClusters={debugSetRelatedClusters}
            setLoading={setError}
            setError={setError}
            loading={error}
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
            sliceMode={sliceMode}
            setSliceMode={setSliceSelectionMode}
            linearPathMode={linearPathMode}
            setLinearPathMode={setLinearPathSelectionMode}
            greedyPathMode={greedyPathMode}
            setGreedyPathMode={setGreedyPathSelectionMode}
            learnMode={learnMode}
            setLearnMode={setLearnMode}
            setActiveTool={setActiveTool}
            hideViewButton={true}
          />
        </div>

        {/* Bottom input bar */}
        <div className="mobile-bottom-bar">
          <div className="mobile-input-row">
            <WordInput
              words={words}
              setWords={setWords}
              setResponse={setError}
              setLoading={() => {}}
              setError={setError}
              loading={false}
              setRelatedClusters={setRelatedClusters}
              showWordTags={false}
            />
          </div>

          {/* Quick suggested words - compact pills */}
          <SuggestedWords
            onWordSelect={handleWordSelect}
            currentWords={words}
            numSuggestions={5}
            compact={true}
          />
        </div>

        {/* Slide-out sidebar for full options */}
        <div
          className={`mobile-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-header">
            <Link to="/" className="mobile-logo-link">
              <img src={luminodeLogo} alt="Luminode" />
              <span>Luminode</span>
            </Link>
            <button
              className="mobile-close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="mobile-sidebar-content">
            <h3>All Suggested Words</h3>
            <SuggestedWords
              onWordSelect={(word) => {
                handleWordSelect(word);
                setSidebarOpen(false);
              }}
              currentWords={words}
              numSuggestions={12}
            />
          </div>

          <div className="mobile-sidebar-footer">
            <a href="https://eriksheagren.notion.site" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
            <a href="https://github.com/esheagren/Luminode" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>

        {/* Learn panel as modal on mobile */}
        {learnMode && (
          <div className="mobile-learn-modal">
            <LearnPanel
              activeTool={activeTool}
              onClose={() => setLearnMode(false)}
            />
          </div>
        )}

        {/* Intro Modal */}
        <IntroModal
          isOpen={showIntroModal}
          onClose={handleCloseIntroModal}
        />

        <style jsx="true">{`
          .mobile-app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            height: 100dvh;
            background-color: #0f0f10;
            overflow: hidden;
          }

          .mobile-graph-area {
            flex: 1;
            position: relative;
            min-height: 0;
            overflow: hidden;
          }

          .mobile-graph-area > div:first-child {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .mobile-view-toggle {
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 100;
            background: rgba(15, 15, 16, 0.9);
            border-radius: 8px;
            padding: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          .mobile-info-button {
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 100;
            width: 44px;
            height: 44px;
            background: rgba(15, 15, 16, 0.9);
            border: none;
            border-radius: 50%;
            color: #FF9D42;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          .mobile-words-bar {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: #1a1a1c;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            gap: 8px;
          }

          .mobile-words-scroll {
            flex: 1;
            display: flex;
            gap: 6px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .mobile-words-scroll::-webkit-scrollbar {
            display: none;
          }

          .mobile-word-tag {
            display: flex;
            align-items: center;
            background: #2a2a2c;
            border-radius: 14px;
            padding: 4px 10px;
            font-size: 0.85rem;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .mobile-remove-word {
            background: none;
            border: none;
            color: #FF5757;
            margin-left: 6px;
            cursor: pointer;
            font-size: 1rem;
            padding: 0;
            line-height: 1;
          }

          .mobile-reset-btn {
            width: 36px;
            height: 36px;
            background: none;
            border: none;
            color: #ff5757;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .mobile-error {
            padding: 8px 12px;
            background: rgba(255, 87, 87, 0.1);
            color: #FF5757;
            font-size: 0.8rem;
            text-align: center;
          }

          .mobile-tools-bar {
            background: #0f0f10;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .mobile-bottom-bar {
            background: #0f0f10;
            padding: 6px 10px;
            padding-bottom: max(6px, env(safe-area-inset-bottom));
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-input-row {
            margin-bottom: 6px;
          }

          /* Mobile sidebar */
          .mobile-sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .mobile-sidebar-overlay.visible {
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 85vw;
            max-width: 320px;
            height: 100%;
            background: #0f0f10;
            z-index: 1000;
            transition: left 0.3s ease;
            display: flex;
            flex-direction: column;
          }

          .mobile-sidebar.open {
            left: 0;
          }

          .mobile-sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-logo-link {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: #f8fafc;
            font-weight: 600;
            font-size: 1.2rem;
          }

          .mobile-logo-link img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }

          .mobile-close-sidebar {
            width: 44px;
            height: 44px;
            background: none;
            border: none;
            color: #aaa;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-sidebar-content {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
          }

          .mobile-sidebar-content h3 {
            color: #888;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
          }

          .mobile-sidebar-footer {
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 24px;
          }

          .mobile-sidebar-footer a {
            color: rgba(217, 175, 93, 0.75);
            text-decoration: none;
            font-size: 0.9rem;
          }

          /* Mobile learn modal */
          .mobile-learn-modal {
            position: fixed;
            inset: 0;
            z-index: 1001;
            background: #0f0f10;
          }
        `}</style>
      </div>
    );
  }

  // Desktop/Tablet layout
  return (
    <div className="app-container">
      <div className="main-layout">
        <div id="mobile-sidebar" className={`sidebar`}>
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img src={luminodeLogo} alt="Luminode" />
              <span className="logo-text">Luminode</span>
            </Link>
          </div>

          <div className="input-wrapper">
            <WordInput
              words={words}
              setWords={setWords}
              setResponse={setError}
              setLoading={() => {/* No-op to prevent loading state issues */}}
              setError={setError}
              loading={false}
              setRelatedClusters={setRelatedClusters}
              showWordTags={false}
            />
            <button
              className="reset-button"
              onClick={handleReset}
              title="Reset words"
            >
              <ResetIcon />
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
                        // Clear related clusters when all words are removed
                        if (newWords.length === 0) {
                          setRelatedClusters([]);
                        }
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
              sliceMode={sliceMode}
              setSliceMode={setSliceSelectionMode}
              linearPathMode={linearPathMode}
              setLinearPathMode={setLinearPathSelectionMode}
              greedyPathMode={greedyPathMode}
              setGreedyPathMode={setGreedyPathSelectionMode}
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
                selectionMode={selectionMode || sliceMode || linearPathMode || greedyPathMode} // Treat slice mode similar to selection mode
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

      {/* Footer Links */}
      <footer className="home-footer">
        <div className="footer-links">
          <a href="https://eriksheagren.notion.site" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
          <a href="https://github.com/esheagren/Luminode" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </footer>
      
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
          margin-bottom: 0.5rem; /* Reduced from 1rem to bring elements closer */
          padding-top: 0.25rem; /* Reduced top padding to bring it up */
          padding-bottom: 0.25rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          justify-content: center; /* Center the logo and text */
          text-decoration: none;
          color: #f8fafc;
          pointer-events: auto;
          cursor: pointer;
        }

        .logo-container img {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 600;
          color: rgba(248, 250, 252, 0.7);
          letter-spacing: 0.5px;
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        
        .reset-button {
          position: static;
          margin-left: 10px;
          background: none;
          border: none;
          color: #ff5757;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 50%;
          transform: none;
          height: 38px;
          width: 38px;
          margin-top: -25px; /* Fine-tune: move up a bit more */
        }
        
        .reset-button:hover {
          background-color: rgba(255, 87, 87, 0.1);
          transform: scale(1.1);
        }
        
        .sidebar {
          width: 300px;
          padding: 0.75rem 1rem; /* Reduced top padding to bring elements up */
          overflow-y: auto;
          background-color: #0f0f10;
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* Reduced from 0.75rem to bring elements closer */
          height: 100%; /* Ensure full height */
          border: none;
        }
        
        .words-container {
          max-height: 600px; /* Significantly increased to allow for many more words */
          overflow-y: auto;
          margin-bottom: 0.5rem;
          flex-shrink: 0; /* Prevent container from shrinking */
          overflow-x: hidden;
        }
        
        /* Custom scrollbar styling */
        .words-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .words-container::-webkit-scrollbar-track {
          background: transparent; 
        }
        
        .words-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .words-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
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
        
        .home-footer {
          width: 100%;
          padding: 0.8rem 1.5rem;
          display: flex;
          justify-content: flex-start;
          background-color: #0f0f10;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 10;
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        
        .footer-links a {
          color: rgba(217, 175, 93, 0.75); /* Muted gold color */
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.5px;
          transition: color 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        
        .footer-links a:hover {
          color: rgba(217, 175, 93, 0.9); /* Slightly brighter on hover */
        }

        /* Tablet styles */
        @media (max-width: 768px) {
          .sidebar {
            width: 260px;
            min-width: 260px;
          }

          .graph-area {
            min-height: 400px;
          }

          .words-container {
            max-height: 45vh;
          }

          .home-footer {
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage; 