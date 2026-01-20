import React, { useState, useEffect, useRef } from 'react';
import './ToolbarStyles.css';

const AnalogySelection = ({
  selectedPoints,
  onReset,
  onCancel,
  onSearch,
  onWordInput,
  loading,
  analogyStep
}) => {
  // Local state for input fields
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [word3, setWord3] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // Sync local state with selectedPoints from visualization clicks
  useEffect(() => {
    if (selectedPoints.length >= 1 && selectedPoints[0] !== word1) {
      setWord1(selectedPoints[0]);
    }
    if (selectedPoints.length >= 2 && selectedPoints[1] !== word2) {
      setWord2(selectedPoints[1]);
    }
    if (selectedPoints.length >= 3 && selectedPoints[2] !== word3) {
      setWord3(selectedPoints[2]);
    }
  }, [selectedPoints]);

  // Auto-focus first empty field on mount
  useEffect(() => {
    if (!word1 && input1Ref.current) {
      input1Ref.current.focus();
    }
  }, []);

  // Handle input changes and notify parent
  const handleInputChange = (field, value) => {
    const cleanValue = value.toLowerCase().trim();

    if (field === 1) {
      setWord1(cleanValue);
    } else if (field === 2) {
      setWord2(cleanValue);
    } else if (field === 3) {
      setWord3(cleanValue);
    }
  };

  // Handle Enter key to move to next field or trigger search
  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (field === 1 && word1) {
        if (onWordInput) onWordInput(word1, 0);
        input2Ref.current?.focus();
      } else if (field === 2 && word2) {
        if (onWordInput) onWordInput(word2, 1);
        input3Ref.current?.focus();
      } else if (field === 3 && word3 && word1 && word2) {
        if (onWordInput) onWordInput(word3, 2);
        handleSearch();
      }
    }
  };

  // Handle blur to validate and update parent
  const handleBlur = (field) => {
    setFocusedField(null);
    if (field === 1 && word1 && onWordInput) {
      onWordInput(word1, 0);
    } else if (field === 2 && word2 && onWordInput) {
      onWordInput(word2, 1);
    } else if (field === 3 && word3 && onWordInput) {
      onWordInput(word3, 2);
    }
  };

  const handleSearch = () => {
    if (word1 && word2 && word3 && onSearch) {
      onSearch(word1, word2, word3);
    }
  };

  const handleReset = () => {
    setWord1('');
    setWord2('');
    setWord3('');
    if (onReset) onReset();
    input1Ref.current?.focus();
  };

  const isComplete = word1 && word2 && word3;
  const showResult = analogyStep === 4;

  return (
    <div className="toolbar compact analogy-toolbar">
      <div className="analogy-inline-bar">
        {/* Word 1 input */}
        <input
          ref={input1Ref}
          type="text"
          className={`analogy-input ${word1 ? 'filled' : ''} ${focusedField === 1 ? 'focused' : ''}`}
          value={word1}
          onChange={(e) => handleInputChange(1, e.target.value)}
          onFocus={() => setFocusedField(1)}
          onBlur={() => handleBlur(1)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          placeholder="word"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />

        <span className="analogy-arrow">→</span>

        {/* Word 2 input */}
        <input
          ref={input2Ref}
          type="text"
          className={`analogy-input ${word2 ? 'filled' : ''} ${focusedField === 2 ? 'focused' : ''}`}
          value={word2}
          onChange={(e) => handleInputChange(2, e.target.value)}
          onFocus={() => setFocusedField(2)}
          onBlur={() => handleBlur(2)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          placeholder="word"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />

        <span className="analogy-equals">≈</span>

        {/* Word 3 input */}
        <input
          ref={input3Ref}
          type="text"
          className={`analogy-input ${word3 ? 'filled' : ''} ${focusedField === 3 ? 'focused' : ''}`}
          value={word3}
          onChange={(e) => handleInputChange(3, e.target.value)}
          onFocus={() => setFocusedField(3)}
          onBlur={() => handleBlur(3)}
          onKeyDown={(e) => handleKeyDown(e, 3)}
          placeholder="word"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />

        <span className="analogy-arrow">→</span>

        {/* Result placeholder */}
        <span className="analogy-result">
          {loading ? (
            <span className="analogy-loading">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </span>
          ) : showResult ? (
            <span className="result-word">results</span>
          ) : (
            <span className="result-placeholder">?</span>
          )}
        </span>

        {/* Action buttons */}
        <div className="analogy-actions">
          {isComplete && !loading && !showResult && (
            <button
              className="analogy-go-btn"
              onClick={handleSearch}
              title="Find analogy"
            >
              Go
            </button>
          )}

          {(word1 || word2 || word3) && !loading && (
            <button
              className="analogy-reset-btn"
              onClick={handleReset}
              title="Reset"
            >
              ×
            </button>
          )}

          <button
            className="analogy-cancel-btn"
            onClick={onCancel}
            disabled={loading}
            title="Cancel"
          >
            Done
          </button>
        </div>
      </div>

      {/* Hint text */}
      {!isComplete && !loading && (
        <div className="analogy-hint">
          Type words or click points on the graph
        </div>
      )}

      <style jsx="true">{`
        .analogy-toolbar {
          background-color: rgba(15, 23, 42, 0.95);
        }

        .analogy-inline-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          flex-wrap: wrap;
        }

        .analogy-input {
          width: 80px;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 128, 8, 0.3);
          background-color: rgba(255, 128, 8, 0.05);
          color: #f0f0f0;
          font-size: 0.9rem;
          font-family: inherit;
          text-align: center;
          transition: all 0.15s ease;
          outline: none;
        }

        .analogy-input::placeholder {
          color: rgba(255, 128, 8, 0.4);
          font-style: italic;
        }

        .analogy-input:focus {
          border-color: #FF8008;
          background-color: rgba(255, 128, 8, 0.1);
          box-shadow: 0 0 0 2px rgba(255, 128, 8, 0.2);
        }

        .analogy-input.filled {
          border-color: rgba(255, 128, 8, 0.5);
          background-color: rgba(255, 128, 8, 0.1);
          color: #FF8008;
          font-weight: 500;
        }

        .analogy-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analogy-arrow {
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.1rem;
          user-select: none;
        }

        .analogy-equals {
          color: #FF8008;
          font-size: 1.2rem;
          font-weight: 600;
          user-select: none;
          padding: 0 0.25rem;
        }

        .analogy-result {
          min-width: 60px;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          background-color: rgba(255, 255, 255, 0.03);
          text-align: center;
          font-size: 0.9rem;
        }

        .result-placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }

        .result-word {
          color: #4ade80;
          font-weight: 500;
        }

        .analogy-loading {
          display: flex;
          gap: 3px;
          justify-content: center;
          align-items: center;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background-color: #FF8008;
          border-radius: 50%;
          animation: loadingPulse 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(1) { animation-delay: 0s; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes loadingPulse {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .analogy-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: auto;
        }

        .analogy-go-btn {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, #FF8008, #FFC837);
          color: #000;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .analogy-go-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(255, 128, 8, 0.4);
        }

        .analogy-reset-btn {
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #aaa;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .analogy-reset-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .analogy-cancel-btn {
          padding: 0.35rem 0.7rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: transparent;
          color: #888;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .analogy-cancel-btn:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.3);
          color: #bbb;
        }

        .analogy-cancel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .analogy-hint {
          padding: 0.3rem 0.75rem 0.5rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        /* Mobile responsive */
        @media (max-width: 600px) {
          .analogy-inline-bar {
            gap: 0.35rem;
            padding: 0.5rem;
          }

          .analogy-input {
            width: 60px;
            padding: 0.35rem 0.4rem;
            font-size: 0.85rem;
          }

          .analogy-arrow,
          .analogy-equals {
            font-size: 0.9rem;
          }

          .analogy-result {
            min-width: 45px;
            padding: 0.35rem 0.4rem;
            font-size: 0.85rem;
          }

          .analogy-actions {
            width: 100%;
            justify-content: flex-end;
            margin-top: 0.25rem;
          }
        }

        @media (max-width: 400px) {
          .analogy-inline-bar {
            justify-content: center;
          }

          .analogy-input {
            width: 55px;
          }

          .analogy-hint {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalogySelection;
