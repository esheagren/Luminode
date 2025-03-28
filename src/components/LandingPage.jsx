import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import luminodeLogo from '../assets/luminodeLogoSmall.png';
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
        <div className="logo-container">
          <img src={luminodeLogo} alt="Luminode Logo" className="landing-logo" />
          <h1 className="landing-title">Luminode</h1>
        </div>
        
        <div className="landing-description">
          <p>Explore the world of vector embeddings with interactive visualizations</p>
        </div>
        
        <div className="landing-cta">
          <Link to="/app" className="enter-app-button">
            Enter Application
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
          padding: 2rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          background-color: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(255, 165, 0, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .landing-logo {
          height: 100px;
          width: auto;
          margin-bottom: 1rem;
        }
        
        .landing-title {
          font-size: 3rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 1px;
          margin: 0;
          text-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
        }
        
        .landing-description {
          font-size: 1.2rem;
          color: #e2e8f0;
          max-width: 80%;
          margin-bottom: 2.5rem;
        }
        
        .enter-app-button {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #FFA500, #FF8C00);
          color: #0f172a;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
        }
        
        .enter-app-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 165, 0, 0.4);
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
        
        @media (max-width: 768px) {
          .landing-content {
            width: 90%;
            padding: 1.5rem;
          }
          
          .landing-logo {
            height: 80px;
          }
          
          .landing-title {
            font-size: 2.5rem;
          }
          
          .landing-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 