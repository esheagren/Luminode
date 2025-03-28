import React, { useState } from 'react';
import { findAnalogy } from '../utils/findAnalogy';
import './ToolbarStyles.css';

const AnalogyToolbar = ({ 
  words, 
  setLoading, 
  setError, 
  loading,
  wordsValid,
  setMidpointClusters
}) => {
  const [selectedWords, setSelectedWords] = useState({
    word1: words[0] || '',
    word2: words[1] || '',
    word3: words[2] || ''
  });
  const [results, setResults] = useState(null);
  
  // Debug log of props
  console.log('AnalogyToolbar props:', {
    hasSetMidpointClusters: !!setMidpointClusters,
    typeOfSetMidpointClusters: typeof setMidpointClusters
  });
  
  // Update selected words when the words prop changes
  React.useEffect(() => {
    setSelectedWords({
      word1: words[0] || '',
      word2: words[1] || '',
      word3: words[2] || '',
    });
  }, [words]);
  
  const handleWordChange = (field, word) => {
    setSelectedWords({ ...selectedWords, [field]: word });
  };
  
  const findAnalogyWords = async () => {
    const { word1, word2, word3 } = selectedWords;
    
    // Make sure all words are selected
    if (!word1 || !word2 || !word3) {
      setError('Please select all three words for analogy search');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await findAnalogy(word1, word2, word3, 5);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Process results
      setResults(response.data.results);
      
      // Format results for visualization
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
      
      // Update visualization with analogy results
      if (typeof setMidpointClusters === 'function') {
        setMidpointClusters([analogyCluster]);
      } else {
        setError('Failed to update visualization: internal error');
      }
      
    } catch (error) {
      console.error('Error finding analogy:', error);
      setError(`Failed to find analogy: ${error.message}`);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <select 
          value={selectedWords.word1}
          onChange={(e) => handleWordChange('word1', e.target.value)}
          className="word-select"
        >
          <option value="">First word</option>
          {words.map(word => (
            <option key={`a1-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <span className="connector">:</span>
        
        <select 
          value={selectedWords.word2}
          onChange={(e) => handleWordChange('word2', e.target.value)}
          className="word-select"
        >
          <option value="">Second word</option>
          {words.map(word => (
            <option key={`a2-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <span className="connector">::</span>
        
        <select 
          value={selectedWords.word3}
          onChange={(e) => handleWordChange('word3', e.target.value)}
          className="word-select"
        >
          <option value="">Third word</option>
          {words.map(word => (
            <option key={`a3-${word}`} value={word}>{word}</option>
          ))}
        </select>
        
        <span className="connector">:</span>
        
        <span className="analogy-result-indicator">?</span>
        
        <button 
          className="search-btn analogy-btn"
          onClick={findAnalogyWords}
          disabled={!selectedWords.word1 || !selectedWords.word2 || !selectedWords.word3 || loading}
        >
          Find
        </button>
      </div>
      
      {results && results.length > 0 && (
        <div className="results-container">
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <span className="result-word">{result.word}</span>
              <span className="result-score">{Number(result.score).toFixed(3)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalogyToolbar; 