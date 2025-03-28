import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingAnimation from './visualization/LoadingAnimation';

const LandingPage = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial dimensions
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  const updateDimensions = () => {
    if (!containerRef.current) return;
    
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    });
  };

  return (
    <div className="landing-page" ref={containerRef}>
      <div className="animation-background">
        <LoadingAnimation 
          width={dimensions.width} 
          height={dimensions.height} 
        />
      </div>
      
      <div className="landing-content">
        <div className="headline-container">
          <h1 className="landing-title">Luminode</h1>
          <h2 className="landing-tagline">Unlock the Power of Vector Space</h2>
        </div>
        
        <div className="landing-description">
          <p>Visualize complex data relationships in an intuitive, interactive environment that brings embeddings to life</p>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🔍</div>
            <div className="benefit-text">
              <h3>Discover Patterns</h3>
              <p>Identify hidden connections in your data through dynamic visualizations</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🧠</div>
            <div className="benefit-text">
              <h3>Interpret AI</h3>
              <p>Understand how AI models perceive language and concepts</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-text">
              <h3>Accelerate Research</h3>
              <p>Fast-track your NLP and machine learning experimentation</p>
            </div>
          </div>
        </div>
        
        <div className="landing-cta">
          <Link to="/app" className="enter-app-button">
            Explore Now
          </Link>
        </div>
      </div>
      
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="https://github.com/esheagren/Luminode" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://eriksheagren.notion.site" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
          <Link to="/about">About</Link>
        </div>
        
        <div className="footer-animation">
          <div className="node node1"></div>
          <div className="node node2"></div>
          <div className="node node3"></div>
          <div className="connection connection1-2"></div>
          <div className="connection connection2-3"></div>
          <div className="connection connection1-3"></div>
        </div>
      </footer>
      
      <style jsx="true">{`
        .landing-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .animation-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .landing-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 10;
          padding: 3rem;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          background-color: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(255, 165, 0, 0.2);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          max-width: 850px;
          margin: 0 auto;
        }
        
        .headline-container {
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .landing-title {
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f8fafc, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 0 2px 10px rgba(255, 165, 0, 0.2);
        }
        
        .landing-tagline {
          font-size: 1.5rem;
          font-weight: 500;
          color: #e2e8f0;
          margin: 0.5rem 0 0;
          letter-spacing: 0.5px;
        }
        
        .landing-description {
          font-size: 1.25rem;
          color: #e2e8f0;
          max-width: 85%;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
          width: 100%;
        }
        
        .benefit-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255, 165, 0, 0.1);
        }
        
        .benefit-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .benefit-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .benefit-text h3 {
          color: #FFA500;
          margin: 0 0 0.5rem;
          font-size: 1.2rem;
        }
        
        .benefit-text p {
          color: #e2e8f0;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .enter-app-button {
          display: inline-block;
          padding: 1rem 3rem;
          background: linear-gradient(135deg, #FFA500, #FF8C00);
          color: #0f172a;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(255, 165, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .enter-app-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .enter-app-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 165, 0, 0.4);
        }
        
        .enter-app-button:hover:before {
          left: 100%;
        }
        
        .landing-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(26, 26, 46, 0.7);
          backdrop-filter: blur(5px);
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-links a {
          color: #e2e8f0;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        
        .footer-links a:hover {
          color: #FFA500;
        }
        
        .footer-animation {
          position: relative;
          width: 120px;
          height: 40px;
        }
        
        .node {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FFA500;
        }
        
        .node1 {
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .node2 {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .node3 {
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .connection {
          position: absolute;
          height: 2px;
          background-color: #FFA500;
          opacity: 0.6;
        }
        
        .connection1-2 {
          left: 14px;
          top: 50%;
          width: 46px;
          transform: translateY(-50%);
        }
        
        .connection2-3 {
          left: calc(50% + 4px);
          top: 50%;
          width: 46px;
          transform: translateY(-50%);
        }
        
        .connection1-3 {
          left: 14px;
          top: calc(50% + 4px);
          width: 102px;
          transform: translateY(-50%) rotate(8deg);
          opacity: 0.3;
        }
        
        @media (max-width: 992px) {
          .benefits-grid {
            grid-template-columns: repeat(1, 1fr);
          }
          
          .landing-content {
            padding: 2rem;
            width: 90%;
            max-width: 600px;
          }
        }
        
        @media (max-width: 768px) {
          .landing-content {
            width: 90%;
            padding: 1.5rem;
          }
          
          .landing-title {
            font-size: 3rem;
          }
          
          .landing-tagline {
            font-size: 1.2rem;
          }
          
          .landing-description {
            font-size: 1rem;
          }
          
          .enter-app-button {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
          }
          
          .benefit-item {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 