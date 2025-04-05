import React from 'react';

const E1_DictionaryVsAssociation = ({ caption = 'Dictionary definition vs. Associative view of language' }) => {
  return (
    <div className="vector-compare-diagram">
      <div className="diagram-box">
        <div className="header-container">
          <div className="header dictionary-header">Definition</div>
          <div className="header association-header">Associative View</div>
        </div>
        
        <div className="split-container">
          <div className="dictionary-side">
            <div className="definition-box">
              <div className="word">travel</div>
              <div className="part-speech">verb</div>
              <div className="definition">
                to go from one place<br/>
                to another, especially<br/>
                over a long distance
              </div>
            </div>
            
            <div className="conclusion-container">
              <div className="conclusion">Static, fixed meaning</div>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="association-side">
            <svg width="100%" height="250" viewBox="0 0 200 200">
              {/* Main travel node */}
              <circle cx="100" cy="100" r="22" fill="#FF8E53" />
              <text x="100" y="104" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="bold">travel</text>
              
              {/* Upper nodes */}
              <g opacity="0.9">
                <line x1="100" y1="100" x2="70" y2="60" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="70" cy="60" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="70" y="63" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">tickets</text>
              </g>
              
              <g opacity="0.85">
                <line x1="100" y1="100" x2="130" y2="60" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="130" cy="60" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="130" y="63" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">journey</text>
              </g>
              
              {/* Middle nodes */}
              <g opacity="0.8">
                <line x1="100" y1="100" x2="50" y2="100" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="50" cy="100" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="50" y="103" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">airports</text>
              </g>
              
              <g opacity="0.8">
                <line x1="100" y1="100" x2="150" y2="100" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="150" cy="100" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="150" y="103" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">vacation</text>
              </g>
              
              {/* Lower nodes */}
              <g opacity="0.7">
                <line x1="100" y1="100" x2="70" y2="140" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="70" cy="140" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="70" y="143" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">adventure</text>
              </g>
              
              <g opacity="0.75">
                <line x1="100" y1="100" x2="130" y2="140" stroke="#FF8E53" strokeWidth="1" />
                <circle cx="130" cy="140" r="15" fill="rgba(255, 142, 83, 0.3)" stroke="#FF8E53" strokeWidth="1" />
                <text x="130" y="143" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9">destination</text>
              </g>
            </svg>
            
            <div className="conclusion-container">
              <div className="conclusion">Rich, context-dependent meaning</div>
            </div>
          </div>
        </div>
        
        <div className="diagram-caption"><em>{caption}</em></div>
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
          padding: 18px;
          margin-bottom: 20px;
          width: 100%;
          text-align: left;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .word {
          font-weight: bold;
          color: white;
          font-size: 1.3rem;
          margin-bottom: 6px;
        }
        
        .part-speech {
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .definition {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          line-height: 1.5;
          letter-spacing: 0.2px;
        }
        
        .conclusion-container {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .conclusion {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        
        .diagram-caption {
          text-align: center;
          margin-top: 16px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default E1_DictionaryVsAssociation; 