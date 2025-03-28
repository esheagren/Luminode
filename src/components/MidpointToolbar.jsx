import React, { useState } from 'react';
import { findMidpoint, processMidpointResults } from '../utils/vectorCalculation';

const MidpointToolbar = ({ 
  words, 
  setMidpointClusters, 
  setLoading, 
  setError,
  loading,
  wordsValid,
  onEnterSelectionMode
}) => {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [recursionDepth, setRecursionDepth] = useState(0);
  const [isComputing, setIsComputing] = useState(false);
  const [useExactSearch, setUseExactSearch] = useState(true);
  
  // Debug log - check if the component gets the required props
  console.log('MidpointToolbar props:', {
    hasWords: Array.isArray(words) && words.length > 0,
    wordCount: Array.isArray(words) ? words.length : 0,
    hasSetMidpointClusters: typeof setMidpointClusters === 'function',
    loading,
    wordsValid
  });
  
  const handleSearch = async () => {
    if (!word1 || !word2) {
      setError('Please select two words for midpoint search');
      return;
    }
    
    setIsComputing(true);
    setLoading(true);
    console.log(`Starting midpoint search for words: "${word1}" and "${word2}"`);
    
    try {
      // Use refactored findMidpoint function
      const results = await findMidpoint(
        word1, 
        word2, 
        5,
        recursionDepth,
        useExactSearch
      );
      
      console.log('Midpoint search results data:', results);
      
      // Process results using our utility function
      const midpointCluster = processMidpointResults(results, word1, word2, recursionDepth);
      
      console.log('Prepared midpoint cluster for visualization:', midpointCluster);
      
      // Update the visualization with the new midpoint cluster
      if (typeof setMidpointClusters === 'function') {
        setMidpointClusters([midpointCluster]);
      } else {
        console.error('setMidpointClusters is not a function', typeof setMidpointClusters);
        setError('Failed to update visualization: internal error');
      }
      
    } catch (error) {
      console.error('Error in midpoint search:', error);
      setError(`Failed to find midpoints: ${error.message || 'Unknown error'}`);
    } finally {
      setIsComputing(false);
      setLoading(false);
    }
  };
  
  // Handle entering selection mode
  const handleEnterSelectionMode = () => {
    if (typeof onEnterSelectionMode === 'function') {
      onEnterSelectionMode();
    }
  };
  
  return (
    <div className="midpoint-toolbar">
      <div className="midpoint-actions">
        <button 
          className="selection-btn"
          onClick={handleEnterSelectionMode}
          disabled={loading || isComputing}
        >
          Click to Select Points
        </button>
        
        <div className="separator">or</div>
      </div>
      
      <div className="midpoint-setup">
        <select 
          className="midpoint-select"
          value={word1}
          onChange={(e) => setWord1(e.target.value)}
        >
          <option value="">Select first word</option>
          {words.map(word => (
            <option key={`w1-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <span className="midpoint-connector">and</span>
        
        <select 
          className="midpoint-select"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
        >
          <option value="">Select second word</option>
          {words.map(word => (
            <option key={`w2-${word}`} value={word}>{word}</option>
          ))}
        </select>

        <div className="midpoint-controls">
          <select 
            className="recursion-select"
            value={recursionDepth}
            onChange={(e) => setRecursionDepth(parseInt(e.target.value))}
            title="Recursion depth"
          >
            <option value="0">No recursion</option>
            <option value="1">One level</option>
            <option value="2">Two levels</option>
          </select>
          
          <label className="toggle-label" title="Use exact search">
            <input
              type="checkbox"
              checked={useExactSearch}
              onChange={(e) => setUseExactSearch(e.target.checked)}
            />
            <span className="toggle-text">Exact</span>
          </label>
          
          <button 
            className="midpoint-search-btn"
            onClick={handleSearch}
            disabled={!word1 || !word2 || isComputing}
          >
            Find
          </button>
        </div>
      </div>
      
      <style jsx="true">{`
        .midpoint-toolbar {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .midpoint-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .selection-btn {
          background: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }
        
        .selection-btn:hover:not(:disabled) {
          box-shadow: 0 2px 4px rgba(52, 168, 83, 0.3);
          transform: translateY(-1px);
        }
        
        .selection-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .separator {
          color: #aaa;
          font-size: 0.85rem;
          flex: 0;
          padding: 0 0.5rem;
        }
        
        .midpoint-setup {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .midpoint-select {
          flex: 1;
          min-width: 120px;
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
          background: rgba(42, 42, 44, 0.6);
          color: white;
          border: 1px solid #3a3a3c;
          font-size: 0.85rem;
        }
        
        .midpoint-connector {
          color: #aaa;
          font-size: 0.85rem;
        }
        
        .midpoint-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        
        .recursion-select {
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
          background: rgba(42, 42, 44, 0.6);
          color: white;
          border: 1px solid #3a3a3c;
          font-size: 0.75rem;
          max-width: 100px;
        }
        
        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .toggle-text {
          margin-left: 0.25rem;
          font-size: 0.75rem;
          color: #e0e0e0;
        }
        
        .midpoint-search-btn {
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
          color: white;
          border: none;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .midpoint-search-btn:hover:not(:disabled) {
          box-shadow: 0 2px 4px rgba(52, 168, 83, 0.3);
          transform: translateY(-1px);
        }
        
        .midpoint-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default MidpointToolbar;