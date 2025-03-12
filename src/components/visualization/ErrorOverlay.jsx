import React from 'react';

const ErrorOverlay = ({ error }) => (
  <div className="error-overlay">
    <p>{error}</p>
    
    <style jsx>{`
      .error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(239, 68, 68, 0.05);
        color: #FF5757;
        padding: 20px;
        text-align: center;
        z-index: 10;
        backdrop-filter: blur(4px);
      }
    `}</style>
  </div>
);

export default ErrorOverlay; 