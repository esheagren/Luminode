import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import VectorGraph from '../VectorGraph';

// An embedded "play" area inside a textbook chapter. It mounts the REAL
// VectorGraph (which fetches its own PCA coordinates from the API) scoped to a
// fixed-height container, seeded with a preset word list. Chapter-defined
// "+ word" buttons let the reader extend it, and "Open in explorer" hands the
// current words off to the full app at /app.
const Sandbox = ({ words: initialWords, addable = [], caption = '' }) => {
  const [words, setWords] = useState(initialWords);
  const navigate = useNavigate();

  const addWord = (word) => {
    setWords((prev) => (prev.includes(word) ? prev : [...prev, word]));
  };

  const openInExplorer = () => {
    navigate('/app', { state: { words } });
  };

  const remaining = addable.filter((w) => !words.includes(w));

  return (
    <div className="tb-sandbox">
      <div className="tb-sandbox-graph">
        <VectorGraph
          words={words}
          midpointWords={[]}
          numMidpoints={5}
          viewMode="2D"
          rulerActive={false}
          selectionMode={false}
          selectedPoints={[]}
          analogyMode={false}
          analogyStep={0}
          isSearchingAnalogy={false}
        />
      </div>

      <div className="tb-sandbox-controls">
        {remaining.map((word) => (
          <button
            key={word}
            className="tb-add-btn"
            onClick={() => addWord(word)}
          >
            + {word}
          </button>
        ))}
        <button className="tb-open-btn" onClick={openInExplorer}>
          Open in explorer →
        </button>
      </div>

      {caption && <p className="tb-sandbox-caption">{caption}</p>}

      <style jsx="true">{`
        .tb-sandbox {
          margin: 1.75rem 0;
          padding: 1rem;
          background: rgba(26, 26, 28, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .tb-sandbox-graph {
          position: relative;
          width: 100%;
          height: 360px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.25);
        }
        .tb-sandbox-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .tb-add-btn,
        .tb-open-btn {
          border-radius: 16px;
          padding: 6px 14px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .tb-add-btn {
          background: rgba(255, 255, 255, 0.06);
          color: #e8e8ea;
        }
        .tb-add-btn:hover {
          background: rgba(255, 157, 66, 0.12);
          border-color: rgba(255, 157, 66, 0.4);
          color: #FF9D42;
        }
        .tb-open-btn {
          margin-left: auto;
          background: rgba(255, 157, 66, 0.15);
          border-color: rgba(255, 157, 66, 0.35);
          color: #FF9D42;
        }
        .tb-open-btn:hover {
          background: rgba(255, 157, 66, 0.28);
        }
        .tb-sandbox-caption {
          margin: 12px 2px 0;
          font-size: 0.85rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.55);
        }
      `}</style>
    </div>
  );
};

Sandbox.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  addable: PropTypes.arrayOf(PropTypes.string),
  caption: PropTypes.string,
};

export default Sandbox;
