import React, { useState } from 'react';
import { findMidpoint, processMidpointResults } from '../utils/vectorCalculation';
import './ToolbarStyles.css';

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
  const [isComputing, setIsComputing] = useState(false);
  
  const handleSearch = async () => {
    if (!word1 || !word2) {
      setError('Please select two words for midpoint search');
      return;
    }
    
    setIsComputing(true);
    setLoading(true);
    
    try {
      // Use the findMidpoint function with default values for recursion (0) and exactSearch (true)
      const results = await findMidpoint(word1, word2, 5, 0, true);
      
      // Process results using our utility function
      const midpointCluster = processMidpointResults(results, word1, word2, 0);
      
      // Update the visualization with the new midpoint cluster
      if (typeof setMidpointClusters === 'function') {
        setMidpointClusters([midpointCluster]);
      } else {
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
  
  return (
    <div className="toolbar">
      <button 
        className="selection-btn"
        onClick={onEnterSelectionMode}
        disabled={loading || isComputing}
      >
        Click to Select Points
      </button>
      
      <span className="connector">or</span>
      
      <div className="toolbar-inner">
        <select 
          className="word-select"
          value={word1}
          onChange={(e) => setWord1(e.target.value)}
        >
          <option value="">Select first word</option>
          {words.map(word => (
            <option key={`w1-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <span className="connector">and</span>
        
        <select 
          className="word-select"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
        >
          <option value="">Select second word</option>
          {words.map(word => (
            <option key={`w2-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <button 
          className="search-btn midpoint-btn"
          onClick={handleSearch}
          disabled={!word1 || !word2 || isComputing}
        >
          Find
        </button>
      </div>
    </div>
  );
};

export default MidpointToolbar;