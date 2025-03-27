import React, { useState } from 'react';
import { findAnalogy } from '../utils/findAnalogy';
import './AnalogyToolbar.css';

const AnalogyToolbar = ({ 
  words, 
  setLoading, 
  setError, 
  loading,
  wordsValid
}) => {
  const [selectedWords, setSelectedWords] = useState({
    word1: words[0] || '',
    word2: words[1] || '',
    word3: words[2] || ''
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
    
    try {
      const result = await findAnalogy(word1, word2, word3, 5);
      
      if (result.error) {
        setError(result.error);
      } else {
        console.log('Analogy result:', result);
        // Here you could visualize the analogy results
        // For now we'll just log them
      }
    } catch (error) {
      console.error('Error in analogy search:', error);
      setError('Failed to complete analogy operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analogy-toolbar">
      <div className="analogy-explanation">
        <span className="formula">word1 : word2 :: word3 : ?</span>
      </div>
      
      <div className="analogy-inputs">
        <div className="word-select">
          <label>Word 1:</label>
          <select 
            value={selectedWords.word1} 
            onChange={(e) => handleWordChange('word1', e.target.value)}
            disabled={loading || !wordsValid}
          >
            <option value="">Select a word</option>
            {words.map((word, index) => (
              <option key={`w1-${index}`} value={word}>{word}</option>
            ))}
          </select>
        </div>
        
        <div className="word-select">
          <label>Word 2:</label>
          <select 
            value={selectedWords.word2} 
            onChange={(e) => handleWordChange('word2', e.target.value)}
            disabled={loading || !wordsValid}
          >
            <option value="">Select a word</option>
            {words.map((word, index) => (
              <option key={`w2-${index}`} value={word}>{word}</option>
            ))}
          </select>
        </div>
        
        <div className="word-select">
          <label>Word 3:</label>
          <select 
            value={selectedWords.word3} 
            onChange={(e) => handleWordChange('word3', e.target.value)}
            disabled={loading || !wordsValid}
          >
            <option value="">Select a word</option>
            {words.map((word, index) => (
              <option key={`w3-${index}`} value={word}>{word}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="analogy-actions">
        <button 
          className="search-btn"
          onClick={findAnalogyWords}
          disabled={loading || !wordsValid || !selectedWords.word1 || !selectedWords.word2 || !selectedWords.word3}
        >
          Find Analogy
        </button>
      </div>
      
      <style jsx="true">{`
        .analogy-toolbar {
          background-color: #1a1a1c;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.5rem;
        }
        
        .analogy-explanation {
          margin-bottom: 0.75rem;
          text-align: center;
        }
        
        .formula {
          font-family: monospace;
          background-color: #2a2a2c;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          color: #f8fafc;
        }
        
        .analogy-inputs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .word-select {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        label {
          font-size: 0.85rem;
          color: #94a3b8;
        }
        
        select {
          padding: 0.5rem;
          border-radius: 4px;
          background-color: #2a2a2c;
          color: #e2e8f0;
          border: 1px solid #3a3a3c;
          font-size: 0.9rem;
        }
        
        select:focus {
          outline: none;
          border-color: #FFC837;
          box-shadow: 0 0 0 2px rgba(255, 200, 55, 0.2);
        }
        
        .analogy-actions {
          display: flex;
          justify-content: center;
        }
        
        .search-btn {
          background-color: #FFC837;
          color: #1a1a1c;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .search-btn:hover:not(:disabled) {
          background-color: #FFD166;
          transform: translateY(-2px);
        }
        
        .search-btn:disabled {
          background-color: #3a3a3c;
          color: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AnalogyToolbar; 