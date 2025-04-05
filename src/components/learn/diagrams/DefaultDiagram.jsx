import React from 'react';

const DefaultDiagram = ({ title = "Diagram Component" }) => (
  <div className="default-diagram">
    <h3>{title}</h3>
    <p>Scroll to see diagrams change</p>
    
    <style jsx="true">{`
      .default-diagram {
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        padding: 2rem;
        border: 1px dashed rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      
      .default-diagram h3 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }
      
      .default-diagram p {
        font-size: 0.9rem;
      }
    `}</style>
  </div>
);

export default DefaultDiagram; 