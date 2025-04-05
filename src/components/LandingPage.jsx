import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingAnimation from './visualization/LoadingAnimation';

const LandingPage = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    updateDimensions();
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
        <h1 className="landing-title">Luminode</h1>
        <p className="landing-tagline">Explore the hidden relationships between words in a beautiful, interactive vector space</p>
        <div className="button-container">
          <Link to="/app" className="app-button primary-button">
            Explore
          </Link>
          <Link to="/learn" className="app-button secondary-button">
            Learn
          </Link>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-links">
          <Link to="/learn">Learn</Link>
          <Link to="/about">About</Link>
          <a href="https://eriksheagren.notion.site" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
          <a href="https://github.com/esheagren/Luminode" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
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
          background-color: #0f172a;
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
          gap: 2rem;
          max-width: 600px;
          padding: 0 2rem;
        }
        
        .landing-title {
          font-size: 3.5rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          letter-spacing: 8px;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .landing-tagline {
          font-size: 1.1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          line-height: 1.6;
          letter-spacing: 0.5px;
          font-family: 'Inter', sans-serif;
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        }
        
        .button-container {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }
        
        .app-button {
          display: inline-block;
          padding: 0.8rem 2.5rem;
          background: transparent;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          font-weight: 500;
          font-size: 1rem;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .primary-button {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .secondary-button {
          background-color: transparent;
        }
        
        .app-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
          color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        .landing-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(5px);
          z-index: 10;
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        
        .footer-links a {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.5px;
          transition: color 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        
        .footer-links a:hover {
          color: rgba(255, 255, 255, 1);
        }
        
        .footer-animation {
          position: relative;
          width: 100px;
          height: 30px;
        }
        
        .node {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
        }
        
        .node1 {
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .node2 {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .node3 {
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .connection {
          position: absolute;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .connection1-2 {
          left: 10px;
          top: 50%;
          width: 40px;
          transform: translateY(-50%);
        }
        
        .connection2-3 {
          left: calc(50% + 2px);
          top: 50%;
          width: 40px;
          transform: translateY(-50%);
        }
        
        .connection1-3 {
          left: 10px;
          top: calc(50% + 2px);
          width: 90px;
          transform: translateY(-50%) rotate(8deg);
          opacity: 0.15;
        }
        
        @media (max-width: 768px) {
          .landing-title {
            font-size: 2.5rem;
            letter-spacing: 6px;
          }

          .landing-tagline {
            font-size: 1rem;
            padding: 0 1rem;
          }
          
          .button-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .app-button {
            padding: 0.6rem 2rem;
            font-size: 0.9rem;
          }

          .landing-footer {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .footer-links {
            gap: 1.5rem;
          }

          .footer-animation {
            width: 80px;
            height: 25px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 