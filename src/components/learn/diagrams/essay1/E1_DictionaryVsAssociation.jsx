import React from 'react';

const E1_DictionaryVsAssociation = ({ caption = 'Dictionary definition vs. Associative view of language' }) => {
  return (
    <div className="vector-compare-diagram">
      <div className="diagram-box">
        <div className="header-container">
          <div className="header dictionary-header">Definition</div>
          <div className="header association-header">Association</div>
        </div>
        
        <div className="split-container">
          <div className="dictionary-side">
            <div className="definition-box">
              <div className="word">travel</div>
              <div className="part-speech">verb</div>
              <div className="definition">
                to go from one place to another,<br/>
                especially over a long distance
              </div>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="association-side">
            <svg width="100%" height="250" viewBox="0 0 280 220">
              {/* Main travel node */}
              <circle cx="140" cy="110" r="6" fill="#FF8E53" />
              <text x="140" y="110" dx="10" textAnchor="start" fill="white" fontSize="18" fontWeight="bold">travel</text>
              
              {/* Related concepts as dots with connecting lines */}
              {/* Upper nodes */}
              <line x1="140" y1="110" x2="80" y2="50" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="80" cy="50" r="4" fill="#FF8E53" />
              <text x="80" y="50" dx="8" textAnchor="start" fill="white" fontSize="16">tickets</text>
              
              <line x1="140" y1="110" x2="200" y2="40" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="200" cy="40" r="4" fill="#FF8E53" />
              <text x="200" y="40" dx="8" textAnchor="start" fill="white" fontSize="16">journey</text>
              
              {/* Left nodes */}
              <line x1="140" y1="110" x2="50" y2="110" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="50" cy="110" r="4" fill="#FF8E53" />
              <text x="50" y="110" dx="-48" textAnchor="start" fill="white" fontSize="16">airports</text>
              
              {/* Right nodes */}
              <line x1="140" y1="110" x2="230" y2="110" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="230" cy="110" r="4" fill="#FF8E53" />
              <text x="230" y="110" dx="8" textAnchor="start" fill="white" fontSize="16">vacation</text>
              
              {/* Lower nodes */}
              <line x1="140" y1="110" x2="80" y2="170" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="80" cy="170" r="4" fill="#FF8E53" />
              <text x="80" y="170" dx="-15" dy="15" textAnchor="start" fill="white" fontSize="16">adventure</text>
              
              <line x1="140" y1="110" x2="210" y2="170" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="210" cy="170" r="4" fill="#FF8E53" />
              <text x="210" y="170" dx="8" textAnchor="start" fill="white" fontSize="16">destination</text>
              
              {/* Additional concepts to make it more PCA-like */}
              <line x1="140" y1="110" x2="170" y2="70" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="170" cy="70" r="4" fill="#FF8E53" />
              <text x="170" y="70" dx="8" textAnchor="start" fill="white" fontSize="16">wanderlust</text>
              
              <line x1="140" y1="110" x2="110" y2="160" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="110" cy="160" r="4" fill="#FF8E53" />
              <text x="110" y="160" dx="8" textAnchor="start" fill="white" fontSize="16">explore</text>
            </svg>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .vector-compare-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 800px;
          max-height: 500px;
          border-radius: 12px;
          background-color: rgba(26, 26, 46, 0.8);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        
        .header-container {
          display: flex;
          width: 100%;
          margin-bottom: 16px;
        }
        
        .header {
          flex: 1;
          font-size: 1.3rem;
          font-weight: bold;
          color: white;
          text-align: center;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .dictionary-header, .association-header {
          color: #f8f8f8;
        }
        
        .split-container {
          display: flex;
          flex: 1;
          width: 100%;
          position: relative;
        }
        
        .divider {
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 15px;
        }
        
        .dictionary-side, .association-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0 15px;
        }
        
        .definition-box {
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 14px;
          width: 100%;
          text-align: left;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .word {
          font-weight: bold;
          color: white;
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        
        .part-speech {
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          margin-bottom: 8px;
        }
        
        .definition {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          line-height: 1.4;
          letter-spacing: 0.2px;
        }
      `}</style>
    </div>
  );
};

export default E1_DictionaryVsAssociation;