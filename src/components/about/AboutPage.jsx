import React, { useRef, useEffect, useState } from 'react';
import LoadingAnimation from '../visualization/LoadingAnimation';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
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
    <div className="about-page" ref={containerRef}>
      <div className="animation-background">
        <LoadingAnimation 
          width={dimensions.width} 
          height={dimensions.height} 
        />
      </div>
      
      <div className="content">
        <div className="header-container">
          <h1>About Luminode</h1>
          <div className="navigation-buttons">
            <Link to="/app" className="nav-button">
              Explore App
            </Link>
            <Link to="/learn" className="nav-button">
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="about-container">
          <div className="about-content">
            <h2>Vector Database Visualization Software</h2>
            
            <p>
              Luminode is an educational application for exploring word embeddings, finding semantic relationships, 
              and visualizing vector spaces. The application uses cloud-based Pinecone storage for word embeddings 
              to ensure optimal performance.
            </p>
            
            <div className="features-section">
              <h3>Key Features</h3>
              <ul>
                <li>Find similar words using nearest neighbor search</li>
                <li>Calculate semantic midpoints between words to discover concepts in-between</li>
                <li>Solve analogy problems (e.g., "man is to woman as king is to _____")</li>
                <li>Explore semantic space using novel slicing technique</li>
                <li>Visualize word vectors in 2D or 3D space using memory-efficient PCA</li>
              </ul>
            </div>
            
            <div className="tech-section">
              <h3>Technology</h3>
              <p>
                Luminode is built with React and Vite for the frontend, Express.js for the backend API, 
                and uses Pinecone vector database for cloud-based vector storage and search. The application 
                utilizes GloVe word embeddings (200-dimensional vectors) and employs memory-optimized PCA 
                implementation for visualization with Three.js for 3D rendering.
              </p>
            </div>
            
            <div className="disclaimer-section">
              <h3>Limitations</h3>
              <p>
                Word embeddings capture semantic relationships based on word co-occurrence patterns in training data,
                but they have limitations. They may reflect societal biases present in the training data and can sometimes
                produce unexpected or inconsistent results. Luminode is designed as an educational tool to help understand
                the concepts of vector embeddings rather than as a definitive resource for language understanding.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bottom-navigation">
          <Link to="/" className="home-button">
            Return to Home
          </Link>
        </div>
      </div>
      
      <Footer />
      
      <style jsx="true">{`
        .about-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
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
        
        .content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }
        
        .header-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          width: 100%;
          position: relative;
        }
        
        h1 {
          font-size: 3rem;
          text-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
          margin: 0;
          text-align: center;
        }
        
        h2 {
          font-size: 1.8rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 1.5rem 0;
          text-align: center;
          font-weight: 500;
        }
        
        h3 {
          font-size: 1.4rem;
          color: #FFA500;
          margin: 1.5rem 0 1rem 0;
          font-weight: 500;
        }
        
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1.5rem;
        }
        
        ul {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        li {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 0.5rem;
        }
        
        .navigation-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .nav-button {
          background-color: rgba(255, 165, 0, 0.2);
          color: #FFA500;
          border: 1px solid rgba(255, 165, 0, 0.5);
          border-radius: 4px;
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .nav-button:hover {
          background-color: rgba(255, 165, 0, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .home-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          margin: 2rem 0;
        }
        
        .home-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .bottom-navigation {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 2rem;
        }
        
        .about-container {
          background-color: rgba(26, 26, 46, 0.8);
          border-radius: 12px;
          padding: 2.5rem;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .about-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .features-section, .tech-section, .disclaimer-section {
          margin-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
          .content {
            padding: 1.5rem;
          }
          
          .about-container {
            padding: 1.5rem;
          }
          
          h1 {
            font-size: 2.5rem;
          }
          
          h2 {
            font-size: 1.5rem;
          }
          
          h3 {
            font-size: 1.2rem;
          }
          
          p, li {
            font-size: 1rem;
          }
          
          .navigation-buttons {
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
            align-items: center;
          }
          
          .nav-button {
            width: 80%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage; 