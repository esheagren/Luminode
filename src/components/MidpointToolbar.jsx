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
      
      // Handle API error responses
      if (response.error) {
        console.error('API returned an error:', response.error);
        throw new Error(response.message || response.error);
      }
      
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