import React, { useState, useEffect } from 'react';
import { getRandomSuggestions } from '../data/suggestedWords';
import { hasPrecomputedEmbedding } from '../data/generatedEmbeddings';

const SuggestedWords = ({ onWordSelect, currentWords, numSuggestions = 8, compact = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate new word suggestions
  const refreshSuggestions = () => {
    setLoading(true);
    
    // Get random words from our curated list
    const candidateWords = getRandomSuggestions(numSuggestions * 2, currentWords);
    
    try {
      // Filter words that have pre-computed embeddings
      const validWords = candidateWords
        .filter(word => hasPrecomputedEmbedding(word))
        .slice(0, numSuggestions);
      
      setSuggestions(validWords);
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when currentWords changes
  useEffect(() => {
    refreshSuggestions();
  }, [currentWords, numSuggestions]);

  // Compact mode for mobile - just tiny pills in a row
  if (compact) {
    return (
      <div className="compact-suggestions">
        {suggestions.map((word, index) => (
          <button
            key={`word-${index}`}
            className="compact-word"
            onClick={() => onWordSelect(word)}
          >
            {word}
          </button>
        ))}
        <button
          onClick={refreshSuggestions}
          className="compact-refresh"
          disabled={loading}
          aria-label="Refresh suggestions"
        >
          ↻
        </button>

        <style jsx="true">{`
          .compact-suggestions {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 2px 0;
          }

          .compact-suggestions::-webkit-scrollbar {
            display: none;
          }

          .compact-word {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 4px 10px;
            font-size: 12px;
            color: #ccc;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .compact-word:hover, .compact-word:active {
            background: rgba(255, 157, 66, 0.15);
            border-color: rgba(255, 157, 66, 0.3);
            color: #FF9D42;
          }

          .compact-refresh {
            background: none;
            border: none;
            color: #666;
            font-size: 14px;
            padding: 4px 8px;
            cursor: pointer;
            flex-shrink: 0;
          }

          .compact-refresh:hover:not(:disabled) {
            color: #FF9D42;
          }

          .compact-refresh:disabled {
            opacity: 0.5;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="suggested-words-container">
      <div className="suggested-words-header">
        <h3>Suggested Words</h3>
        <button
          onClick={refreshSuggestions}
          className="refresh-btn"
          title="Get new suggestions"
          disabled={loading}
        >
          {loading ? '⟳' : '↻'}
        </button>
      </div>

      <div className="suggested-words-list">
        {suggestions.map((word, index) => (
          <div
            key={`word-${index}`}
            className="suggested-word"
            onClick={() => onWordSelect(word)}
          >
            {word}
          </div>
        ))}
        {suggestions.length === 0 && !loading && (
          <div className="empty-message">No suggestions available</div>
        )}
      </div>
      
      <style jsx="true">{`
        .suggested-words-container {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(26, 26, 28, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .suggested-words-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .suggested-words-header h3 {
          font-size: 1rem;
          color: #f8fafc;
          margin: 0;
        }
        
        .refresh-btn {
          background: rgba(255, 157, 66, 0.2);
          color: #FF9D42;
          border: 1px solid rgba(255, 157, 66, 0.3);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }
        
        .refresh-btn:hover:not(:disabled) {
          background: rgba(255, 157, 66, 0.3);
          transform: rotate(180deg);
        }
        
        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .suggested-words-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .suggested-word {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 6px 14px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .suggested-word:hover {
          background: linear-gradient(135deg, rgba(255, 157, 66, 0.1) 0%, rgba(255, 200, 55, 0.1) 100%);
          border-color: rgba(255, 157, 66, 0.3);
          transform: translateY(-2px);
        }
        
        .empty-message {
          color: #64748b;
          font-size: 0.9rem;
          font-style: italic;
          padding: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default SuggestedWords; 