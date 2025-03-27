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
    
    if (!word1 || !word2 || !word3) {
      setError('Please select all three words for the analogy');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log(`Attempting to find analogy with words: ${word1}, ${word2}, ${word3}`);
      const result = await findAnalogy(word1, word2, word3, 5);
      
      if (result.error) {
        console.error('Analogy error received:', result.error);
        
        // Display detailed error to help troubleshoot
        if (result.details) {
          console.log('Error details:', result.details);
          
          // Handle specific error cases
          if (result.details.status === 404) {
            setError(`Not found: The analogy endpoint might be missing. Status: ${result.details.status}`);
          } else if (result.details.message && result.details.message.includes('Network Error')) {
            setError('Network error: Could not connect to the server. The server might be down or not running on the expected port.');
          } else {
            setError(`${result.error} (Status: ${result.details.status || 'unknown'})`);
          }
        } else {
          setError(result.error);
        }
      } else if (!result.data) {
        setError('No results were returned from the server');
      } else {
        console.log('Analogy result:', result);
        setResults(result.data.results);
        
        try {
          // Format the analogy results with the correct structure for visualization
          const analogyCluster = {
            type: 'analogy',
            parent1: word1,
            parent2: word2,
            parent3: word3,
            words: result.data.results.map(item => ({
              word: item.word,
              score: item.score,
              isAnalogy: true,
              analogySource: {
                fromWords: [word1, word2, word3]
              }
            }))
          };
          
          console.log('Creating analogy cluster:', analogyCluster);
          
          // Check if setMidpointClusters is a function before calling it
          if (typeof setMidpointClusters === 'function') {
            // Use a simpler approach to update the state
            setMidpointClusters(clusters => {
              console.log('Current clusters:', clusters);
              return [analogyCluster, ...clusters];
            });
          } else {
            console.warn('setMidpointClusters is not available or not a function');
            console.log('Type of setMidpointClusters:', typeof setMidpointClusters);
          }
        } catch (error) {
          console.error('Error updating visualization with analogy results:', error);
          setError(`Error adding results to visualization: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Exception in analogy search:', error);
      setError(`Failed to complete analogy operation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analogy-toolbar">
      <div className="analogy-form">
        <div className="analogy-inputs">
          <select 
            value={selectedWords.word1} 
            onChange={(e) => handleWordChange('word1', e.target.value)}
            disabled={loading || !wordsValid}
            className="word-select"
          >
            <option value="">Word 1</option>
            {words.map((word, index) => (
              <option key={`w1-${index}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="connector">:</span>
          
          <select 
            value={selectedWords.word2} 
            onChange={(e) => handleWordChange('word2', e.target.value)}
            disabled={loading || !wordsValid}
            className="word-select"
          >
            <option value="">Word 2</option>
            {words.map((word, index) => (
              <option key={`w2-${index}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="connector">::</span>
          
          <select 
            value={selectedWords.word3} 
            onChange={(e) => handleWordChange('word3', e.target.value)}
            disabled={loading || !wordsValid}
            className="word-select"
          >
            <option value="">Word 3</option>
            {words.map((word, index) => (
              <option key={`w3-${index}`} value={word}>{word}</option>
            ))}
          </select>
          
          <span className="connector">:</span>
          
          <span className="result-marker">?</span>
        </div>
        
        <button 
          className="search-btn"
          onClick={findAnalogyWords}
          disabled={loading || !wordsValid || !selectedWords.word1 || !selectedWords.word2 || !selectedWords.word3}
        >
          Find
        </button>
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
          background-color: #1a1a1c;
          border-radius: 8px;
          padding: 0.5rem;
          margin-top: 0.25rem;
        }
        
        .analogy-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .analogy-inputs {
          display: flex;
          align-items: center;
          flex: 1;
          background-color: rgba(26, 26, 28, 0.6);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
        }
        
        .word-select {
          flex: 1;
          padding: 0.25rem;
          border-radius: 4px;
          background-color: #2a2a2c;
          color: #e2e8f0;
          border: 1px solid #3a3a3c;
          font-size: 0.8rem;
          min-width: 80px;
        }
        
        .word-select:focus {
          outline: none;
          border-color: #FFC837;
          box-shadow: 0 0 0 1px rgba(255, 200, 55, 0.2);
        }
        
        .connector {
          font-family: monospace;
          color: #94a3b8;
          margin: 0 0.25rem;
          font-size: 0.9rem;
        }
        
        .result-marker {
          color: #FFC837;
          font-weight: bold;
          font-size: 1.1rem;
          margin-left: 0.25rem;
        }
        
        .search-btn {
          background-color: #FFC837;
          color: #1a1a1c;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .search-btn:hover:not(:disabled) {
          background-color: #FFD166;
        }
        
        .search-btn:disabled {
          background-color: #3a3a3c;
          color: #94a3b8;
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