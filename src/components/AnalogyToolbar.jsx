import React, { useState } from 'react';
import { findAnalogy } from '../utils/findAnalogy';
import './AnalogyToolbar.css';

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
        console.error('setMidpointClusters is not a function:', typeof setMidpointClusters);
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
    <div className="analogy-toolbar">
      <div className="analogy-form">
        <div className="analogy-selects">
          <select 
            value={selectedWords.word1}
            onChange={(e) => handleWordChange('word1', e.target.value)}
            className="analogy-select"
          >
            <option value="">First word</option>
            {words.map(word => (
              <option key={`a1-${word}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="analogy-connector">:</span>
          
          <select 
            value={selectedWords.word2}
            onChange={(e) => handleWordChange('word2', e.target.value)}
            className="analogy-select"
          >
            <option value="">Second word</option>
            {words.map(word => (
              <option key={`a2-${word}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="analogy-connector">::</span>
          
          <select 
            value={selectedWords.word3}
            onChange={(e) => handleWordChange('word3', e.target.value)}
            className="analogy-select"
          >
            <option value="">Third word</option>
            {words.map(word => (
              <option key={`a3-${word}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="analogy-connector">:</span>
          
          <span className="analogy-result">?</span>
          
          <button 
            className="analogy-search-btn"
            onClick={findAnalogyWords}
            disabled={!selectedWords.word1 || !selectedWords.word2 || !selectedWords.word3 || loading}
          >
            Find
          </button>
        </div>
      </div>
      
      {results && results.length > 0 && (
        <div className="analogy-results">
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <span className="result-word">{result.word}</span>
                <span className="result-score">{Number(result.score).toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .analogy-toolbar {
          padding: 0.75rem;
        }
        
        .analogy-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .analogy-selects {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          width: 100%;
        }
        
        .analogy-select {
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
          background: rgba(42, 42, 44, 0.6);
          color: white;
          border: 1px solid #3a3a3c;
          font-size: 0.85rem;
          min-width: 90px;
          flex: 1;
        }
        
        .analogy-connector {
          color: #aaa;
          font-size: 0.85rem;
        }
        
        .analogy-result {
          font-size: 0.85rem;
          color: #FFC837;
          font-weight: bold;
        }
        
        .analogy-search-btn {
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          background: linear-gradient(135deg, #FF8008 0%, #FFC837 100%);
          color: white;
          border: none;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          margin-left: 0.5rem;
        }
        
        .analogy-search-btn:hover:not(:disabled) {
          box-shadow: 0 2px 4px rgba(255, 136, 8, 0.3);
          transform: translateY(-1px);
        }
        
        .analogy-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .analogy-results {
          margin-top: 0.5rem;
          padding-top: 0.25rem;
          border-top: 1px solid #3a3a3c;
        }
        
        .results-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0.5rem;
          background-color: #2a2a2c;
          border-radius: 4px;
          font-size: 0.8rem;
          flex: 1;
          min-width: 100px;
          max-width: calc(50% - 0.25rem);
        }
        
        .result-word {
          font-weight: 500;
        }
        
        .result-score {
          color: #94a3b8;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AnalogyToolbar; 