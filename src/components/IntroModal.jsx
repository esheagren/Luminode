import React from 'react';

const IntroModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="intro-modal-overlay" onClick={onClose}>
      <div className="intro-modal-content" onClick={e => e.stopPropagation()}>
        <div className="intro-modal-header">
          <h2>Welcome to Luminode</h2>
          <button className="intro-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="intro-modal-body">
          <h3>Vector Embeddings: The Heart of Modern AI</h3>
          
          <p>
            Vector embeddings are a <strong>core technology</strong> at the heart of modern AI systems, enabling machines to represent 
            meaning algorithmically. Unlike traditional dictionary definitions, which provide fixed meanings, 
            vectors capture how words are used <strong>relationally</strong>, how they are used <strong>in context</strong>.
          </p>
          
          <p>
            Vector embeddings are <strong>high-dimensional matrices</strong>. Imagine a familiar X-Y plane, then an X-Y-Z plane, and then imagine you continue increasing the number of dimensionthis to hundreds or even thousands of dimensions, each capturing a subtle semantic nuance, like if the word is a plural, is gendered, or even is associated with witchcraft. In high-dimensional systems, surprising layers of abstraction are often represented and can be seen visually.
          </p>
          
          <div className="intro-graphic">
            <div className="vector-space">
              
              <div className="dimensions-label z-label">(...1000+ more dimensions)</div>
              <div className="point p1" style={{ left: '25%', top: '30%' }}>
                <span className="label">king</span>
              </div>
              <div className="point p2" style={{ left: '45%', top: '45%' }}>
                <span className="label">queen</span>
              </div>
              <div className="point p3" style={{ left: '30%', top: '65%' }}>
                <span className="label">man</span>
              </div>
              <div className="point p4" style={{ left: '50%', top: '75%' }}>
                <span className="label">woman</span>
              </div>
              <div className="connector c1"></div>
              <div className="connector c2"></div>
            </div>
          </div>
          
          <div className="intro-section">
            <h4>Key Concepts</h4>
            <div className="concept-list">
              <div className="concept-item">
                <strong>Context is Meaning:</strong> Words gain meaning from their context, not fixed definitions
              </div>
              <div className="concept-item">
                <strong>Proximity = Similarity:</strong> Words with similar contexts cluster together in vector space
              </div>
              <div className="concept-item">
                <strong>Direction = Relationship:</strong> The direction between vectors captures semantic relationships
              </div>
              <div className="concept-item">
                <strong>Vector Arithmetic:</strong> Operations like "king - man + woman = queen" reveal embedded patterns
              </div>
            </div>
          </div>
          
          <div className="intro-section">
            <h4>Applications</h4>
            <p>
              These mathematical representations form the foundation of:
            </p>
            <div className="concept-list">
              <div className="concept-item">Large language models (ChatGPT, Claude, etc.)</div>
              <div className="concept-item">Search engines that understand meaning beyond keywords</div>
              <div className="concept-item">Recommendation systems that discover hidden connections</div>
              <div className="concept-item">Translation systems that preserve semantic relationships</div>
            </div>
          </div>
          
          <div className="intro-section">
            <h4>Luminode's Tools</h4>
            <p>
              This application allows you to:
            </p>
            <div className="concept-list">
              <div className="concept-item"><strong>Visualize:</strong> See word relationships in 2D/3D projections of high-dimensional space</div>
              <div className="concept-item"><strong>Find Neighbors:</strong> Discover semantically similar words and concepts</div>
              <div className="concept-item"><strong>Explore Analogies:</strong> Perform vector arithmetic to find word relationships</div>
            </div>
          </div>
          
          <div className="intro-actions">
            <button className="intro-button primary" onClick={onClose}>Start Exploring</button>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .intro-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .intro-modal-content {
          background-color: #0f172a;
          border-radius: 12px;
          width: 90%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
          color: #e6e6e6;
          animation: modalFadeIn 0.4s ease-out;
          border: 1px solid rgba(255, 157, 66, 0.3);
        }
        
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .intro-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 157, 66, 0.3);
          position: sticky;
          top: 0;
          background-color: #0f172a;
          z-index: 1;
        }
        
        .intro-modal-header h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
          color: #FF9D42;
          letter-spacing: 0.5px;
        }
        
        .intro-close-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.8rem;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .intro-close-button:hover {
          color: #FF9D42;
          background: rgba(255, 157, 66, 0.1);
        }
        
        .intro-modal-body {
          padding: 2rem;
          color: rgba(248, 250, 252, 0.9);
          line-height: 1.6;
        }
        
        .intro-modal-body h3 {
          font-size: 1.5rem;
          color: #fff;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }
        
        .intro-modal-body h4 {
          font-size: 1.25rem;
          color: #FF9D42;
          margin: 1rem 0 0.75rem 0;
        }
        
        .intro-modal-body p {
          margin: 0.75rem 0;
          font-size: 1.05rem;
          line-height: 1.6;
        }
        
        .intro-modal-body strong {
          color: #FF9D42;
          font-weight: 600;
        }
        
        .intro-section {
          margin-bottom: 1.5rem;
        }
        
        .concept-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        
        .concept-item {
          position: relative;
          padding-left: 0.5rem;
          line-height: 1.4;
        }
        
        .intro-modal-body ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .intro-modal-body li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        .intro-graphic {
          height: 180px;
          background-color: rgba(15, 15, 16, 0.5);
          border-radius: 8px;
          margin: 1.5rem 0;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .vector-space {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .dimensions-label {
          position: absolute;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
        
        .x-label {
          bottom: 10px;
          left: 10px;
        }
        
        .y-label {
          top: 10px;
          left: 10px;
        }
        
        .z-label {
          bottom: 10px;
          right: 10px;
          color: rgba(255, 157, 66, 0.7);
        }
        
        .point {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #FF9D42;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px rgba(255, 157, 66, 0.6);
        }
        
        .point .label {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }
        
        .connector {
          position: absolute;
          height: 1px;
          background-color: rgba(255, 157, 66, 0.4);
          transform-origin: center left;
        }
        
        .connector.c1 {
          width: 80px;
          top: 30%;
          left: 25%;
          transform: rotate(25deg);
        }
        
        .connector.c2 {
          width: 80px;
          top: 65%;
          left: 30%;
          transform: rotate(15deg);
        }
        
        .intro-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .intro-button {
          padding: 0.8rem 2rem;
          font-size: 1.1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .intro-button.primary {
          background-color: #FF9D42;
          color: #0f172a;
        }
        
        .intro-button.primary:hover {
          background-color: #f8a859;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 157, 66, 0.3);
        }
        
        @media (max-width: 768px) {
          .intro-modal-content {
            width: 95%;
            max-height: 95vh;
          }
          
          .intro-modal-header {
            padding: 1rem;
          }
          
          .intro-modal-header h2 {
            font-size: 1.4rem;
          }
          
          .intro-modal-body {
            padding: 1rem;
          }
          
          .intro-modal-body h3 {
            font-size: 1.3rem;
          }
          
          .intro-graphic {
            height: 150px;
          }
          
          .intro-button {
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default IntroModal; 