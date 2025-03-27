import React, { useState } from 'react';
import { findMidpoint } from '../api/embedding';

const MidpointToolbar = ({ 
  words, 
  setMidpointClusters, 
  setLoading, 
  setError,
  loading,
  wordsValid
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
      const response = await findMidpoint(
        word1, 
        word2, 
        5,
        recursionDepth,
        useExactSearch
      );
      
      console.log('Midpoint search raw response:', response);
      
      // Ensure we have a valid response structure
      if (!response || !response.data || !response.data.primaryMidpoint) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response received from server');
      }
      
      // Get the data from the response
      const results = response.data;
      console.log('Midpoint search results data:', results);
      
      // Process results for visualization
      const midpointCluster = {
        type: 'midpoint',
        source: {
          word1,
          word2,
          recursionDepth
        },
        words: []
      };
      
      // Add primary midpoint
      const primaryMidpoint = results.primaryMidpoint;
      console.log('Processing primary midpoint:', primaryMidpoint);
      
      // Ensure we have nearestWords in the expected format
      if (!primaryMidpoint.nearestWords || !Array.isArray(primaryMidpoint.nearestWords) || primaryMidpoint.nearestWords.length === 0) {
        console.error('No nearest words found in the midpoint response:', primaryMidpoint);
        throw new Error('No midpoint results found');
      }
      
      // Add each primary midpoint word to the cluster
      primaryMidpoint.nearestWords.forEach((item, index) => {
        // Handle both score and distance field names
        const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
        
        midpointCluster.words.push({
          word: item.word,
          distance: distanceValue, 
          isMidpoint: true,
          midpointLevel: 'primary',
          midpointSource: {
            fromWords: [word1, word2],
            isPrimaryResult: index === 0
          }
        });
      });
      
      // Add secondary midpoints if available
      if (results.secondaryMidpoints && results.secondaryMidpoints.length > 0) {
        results.secondaryMidpoints.forEach(midpoint => {
          if (!midpoint.nearestWords || !Array.isArray(midpoint.nearestWords)) {
            console.warn('Invalid secondary midpoint structure:', midpoint);
            return;
          }
          
          midpoint.nearestWords.forEach((item, index) => {
            const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
            
            midpointCluster.words.push({
              word: item.word,
              distance: distanceValue,
              isMidpoint: true,
              midpointLevel: 'secondary',
              midpointSource: {
                fromWords: midpoint.endpoints || [word1, word2],
                isPrimaryResult: index === 0
              }
            });
          });
        });
      }
      
      // Add tertiary midpoints if available
      if (results.tertiaryMidpoints && results.tertiaryMidpoints.length > 0) {
        results.tertiaryMidpoints.forEach(midpoint => {
          if (!midpoint.nearestWords || !Array.isArray(midpoint.nearestWords)) {
            console.warn('Invalid tertiary midpoint structure:', midpoint);
            return;
          }
          
          midpoint.nearestWords.forEach((item, index) => {
            const distanceValue = item.score !== undefined ? item.score : (item.distance !== undefined ? item.distance : 0);
            
            midpointCluster.words.push({
              word: item.word,
              distance: distanceValue,
              isMidpoint: true,
              midpointLevel: 'tertiary',
              midpointSource: {
                fromWords: midpoint.endpoints || [word1, word2],
                isPrimaryResult: index === 0
              }
            });
          });
        });
      }
      
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
  
  return (
    <div className="midpoint-toolbar">
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
      </div>
      
      <div className="midpoint-options">
        <div className="recursion-label">
          <span>Recursion depth:</span>
          <select 
            className="recursion-select"
            value={recursionDepth}
            onChange={(e) => setRecursionDepth(parseInt(e.target.value))}
          >
            <option value="0">None (direct midpoint only)</option>
            <option value="1">One level (secondary midpoints)</option>
            <option value="2">Two levels (tertiary midpoints)</option>
          </select>
        </div>
        
        <div className="search-mode">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={useExactSearch}
              onChange={(e) => setUseExactSearch(e.target.checked)}
            />
            <span className="toggle-text">Exact search</span>
          </label>
        </div>
        
        <button 
          className="midpoint-search-btn"
          onClick={handleSearch}
          disabled={!word1 || !word2 || isComputing}
        >
          Find Midpoints
        </button>
      </div>
      
      <style jsx="true">{`
        .midpoint-toolbar {
          background: #1a1a1c;
          border-radius: 8px;
          padding: 12px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .midpoint-setup {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .midpoint-select {
          flex: 1;
          padding: 6px 10px;
          border-radius: 4px;
          background: #2a2a2c;
          color: white;
          border: 1px solid #3a3a3c;
        }
        
        .midpoint-connector {
          color: #aaa;
          font-size: 14px;
        }
        
        .midpoint-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .recursion-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #aaa;
          font-size: 14px;
        }
        
        .recursion-select {
          padding: 6px 10px;
          border-radius: 4px;
          background: #2a2a2c;
          color: white;
          border: 1px solid #3a3a3c;
        }
        
        .midpoint-search-btn {
          padding: 8px 16px;
          border-radius: 4px;
          background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
          color: white;
          border: none;
          font-weight: 500;
          cursor: pointer;
        }
        
        .midpoint-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .search-mode {
          display: flex;
          align-items: center;
          margin-right: 12px;
        }
        
        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .toggle-text {
          margin-left: 6px;
          font-size: 13px;
          color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default MidpointToolbar;