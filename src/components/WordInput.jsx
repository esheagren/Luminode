import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../utils/environment';

const WordInput = ({ 
  words, 
  setWords, 
  setResponse, 
  setLoading, 
  setError, 
  loading,
  setRelatedClusters,
  showWordTags = true
}) => {
  const [wordInput, setWordInput] = useState('');
  const [invalidWords, setInvalidWords] = useState([]);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wordInput.trim()) return;
    
    const word = wordInput.trim().toLowerCase();
    
    // Check if word is already in the list
    if (words.includes(word)) {
      setError(`"${word}" is already in your list`);
      return;
    }
    
    // Reset previous errors and indicate loading
    setError(null);
    setLoading(true);
    
    try {
      // Call API to check if the word exists
      const response = await axios.post(getApiUrl('/api/checkWord'), { word });
      const data = response.data;
      
      if (data.data.word.exists) {
        // Add word to the list
        const updatedWords = [...words, word];
        setWords(updatedWords);
        
        // Store word data in response
        setResponse(prev => ({
          message: `Added word: ${word}`,
          data: {
            words: prev?.data?.words 
              ? [...prev.data.words, data.data.word] 
              : [data.data.word]
          }
        }));
        
        // Clear any existing related clusters
        setRelatedClusters([]);
        
        // Clear input
        setWordInput('');
      } else {
        setError(`"${word}" is not in our dictionary`);
      }
    } catch (error) {
      console.error('Error adding word:', error);
      setError(error.response?.data?.error || `Error adding "${word}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleNewWordKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (wordInput.trim()) {
        // Add the new word and clear the input
        setWords([...words, wordInput.trim()]);
        setWordInput('');
        
        // Trigger submit to update the visualization
        handleSubmit(e);
      }
    }
  };

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Maintain focus after any state changes
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    // Use requestAnimationFrame to ensure focus happens after DOM updates
    requestAnimationFrame(focusInput);
  }, [words, wordInput, loading]);

  const removeWord = (indexToRemove) => {
    const updatedWords = words.filter((_, index) => index !== indexToRemove);
    setWords(updatedWords);
    
    // Trigger submit to update the visualization after removing a word
    handleSubmit();
  };

  return (
    <div className="word-input-container">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
          placeholder="Add another word"
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
      </form>
      
      {showWordTags && words.length > 0 && (
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
      
      <style jsx>{`
        .word-input-container {
          width: 100%;
        }
        
        form {
          position: relative;
          margin-bottom: 1rem;
        }
        
        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #2D3748;
          background-color: #171923;
          color: #E2E8F0;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        
        input:focus {
          outline: none;
          border-color: #FFC837;
          box-shadow: 0 0 0 3px rgba(255, 200, 55, 0.2);
        }
        
        input::placeholder {
          color: #718096;
        }
        
        .selected-words {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
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
        
        @media (max-width: 768px) {
          input {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WordInput; 