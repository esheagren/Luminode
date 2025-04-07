import React from 'react';

const E1_VectorBasic = ({ caption }) => {
  return (
    <div className="vector-basic-diagram">
      <div className="vector-container">
        <div className="vector-title">Vector</div>
        <div className="vector-representation">
          <span className="vector-bracket">[</span>
          <div className="vector-values">
            <div className="vector-value">0.24</div>
            <div className="vector-value">-0.68</div>
            <div className="vector-value">0.92</div>
            <div className="vector-value">0.15</div>
            <div className="vector-value">-0.31</div>
            <div className="vector-dots">...</div>
            <div className="vector-value">0.77</div>
            <div className="vector-value">-0.42</div>
          </div>
          <span className="vector-bracket">]</span>
        </div>
        <div className="vector-description">
          A list of numbers representing coordinates in high-dimensional space
        </div>
      </div>
      
      {caption && <div className="diagram-caption">{caption}</div>}
      
      <style jsx="true">{`
        .vector-basic-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: white;
        }
        
        .vector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          background-color: rgba(30, 30, 50, 0.7);
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 500px;
        }
        
        .vector-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #FFA500;
        }
        
        .vector-representation {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-family: 'Courier New', monospace;
        }
        
        .vector-bracket {
          font-size: 5rem;
          font-weight: 300;
          line-height: 5rem;
          padding: 0 0.5rem;
        }
        
        .vector-values {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
        }
        
        .vector-value {
          font-size: 1.2rem;
          padding: 0.2rem 0;
          text-align: center;
        }
        
        .vector-dots {
          font-size: 1.2rem;
          padding: 0.2rem 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .vector-description {
          font-size: 1.1rem;
          text-align: center;
          max-width: 80%;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .diagram-caption {
          font-size: 1.2rem;
          margin-top: 1rem;
          text-align: center;
          max-width: 80%;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default E1_VectorBasic;
