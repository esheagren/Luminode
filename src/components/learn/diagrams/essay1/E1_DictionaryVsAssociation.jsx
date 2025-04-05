import React from 'react';

const E1_DictionaryVsAssociation = () => {
  return (
    <div className="vector-compare-diagram">
      <div className="diagram-box">
        <div className="grid-container">
          {/* Top Row */}
          <div className="grid-cell header-cell">
            <div className="section-header">Definition</div>
          </div>
          <div className="grid-cell content-cell definition-cell">
            <div className="definition-box">
              <div className="word">travel <span className="part-speech">verb</span></div>
              <div className="definition">
                to go from one place to another
              </div>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid-cell header-cell">
            <div className="section-header">Association</div>
          </div>
          <div className="grid-cell content-cell">
            <div className="pca-visualization">
              <svg width="100%" height="100%" viewBox="0 0 480 280" preserveAspectRatio="xMidYMid meet">
                {/* Background Grid */}
                <line x1="80" y1="40" x2="80" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="160" y1="40" x2="160" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="240" y1="40" x2="240" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="320" y1="40" x2="320" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="400" y1="40" x2="400" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                
                <line x1="40" y1="80" x2="440" y2="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="40" y1="120" x2="440" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="40" y1="160" x2="440" y2="160" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="40" y1="200" x2="440" y2="200" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                
                {/* Travel cluster */}
                {/* Main travel node */}
                <circle cx="240" cy="140" r="14" fill="#FF8E53" />
                <text x="240" y="146" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">travel</text>
                
                {/* Closely related concepts */}
                <line x1="240" y1="140" x2="320" y2="100" stroke="rgba(255, 142, 83, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                <circle cx="320" cy="100" r="12" fill="#FF8E53" />
                <text x="320" y="105" dx="16" textAnchor="start" fill="white" fontSize="22">journey</text>
                
                <line x1="240" y1="140" x2="290" y2="190" stroke="rgba(255, 142, 83, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                <circle cx="290" cy="190" r="12" fill="#FF8E53" />
                <text x="290" y="195" dx="16" textAnchor="start" fill="white" fontSize="22">adventure</text>
                
                {/* More distant but related concepts */}
                <line x1="240" y1="140" x2="380" y2="140" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />
                <circle cx="380" cy="140" r="10" fill="#FF8E53" />
                <text x="380" y="145" dx="14" textAnchor="start" fill="white" fontSize="22">vacation</text>
                
                <line x1="240" y1="140" x2="120" y2="140" stroke="rgba(255, 142, 83, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />
                <circle cx="120" cy="140" r="10" fill="#FF8E53" />
                <text x="120" y="145" dx="-78" textAnchor="start" fill="white" fontSize="22">airports</text>
              </svg>
            </div>
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
          max-width: 900px;
          max-height: 600px;
          border-radius: 12px;
          background-color: rgba(26, 26, 46, 0.8);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          padding: 12px;
        }
        
        .grid-container {
          display: grid;
          grid-template-columns: 90px 1fr;
          grid-template-rows: 120px 1fr;
          gap: 15px;
          height: 100%;
          width: 100%;
        }
        
        .grid-cell {
          padding: 8px;
          display: flex;
          flex-direction: column;
        }
        
        .header-cell {
          justify-content: center;
          align-items: center;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .content-cell {
          justify-content: flex-start;
          overflow: hidden;
        }
        
        .definition-cell {
          display: flex;
          align-items: center;
        }
        
        .section-header {
          font-size: 0.95rem;
          font-weight: bold;
          color: white;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
          text-align: center;
          padding: 5px 0;
          letter-spacing: 0.5px;
        }
        
        .definition-box {
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 16px 20px;
          width: 100%;
          max-width: 100%;
          text-align: left;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .word {
          font-weight: bold;
          color: white;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        
        .part-speech {
          font-style: italic;
          font-weight: normal;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-left: 5px;
        }
        
        .definition {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.4;
          letter-spacing: 0.1px;
        }
        
        .pca-visualization {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

export default E1_DictionaryVsAssociation;