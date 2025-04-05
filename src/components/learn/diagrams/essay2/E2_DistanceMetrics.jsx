import React from 'react';

const E2_DistanceMetrics = ({ caption = 'Measuring similarity between vectors' }) => {
  return (
    <div className="distance-metrics-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate system */}
          <g transform="translate(50, 150)">
            <line x1="0" y1="0" x2="200" y2="0" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="-100" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            
            {/* Axis labels */}
            <text x="195" y="15" fontSize="10" fill="rgba(255, 255, 255, 0.7)">x</text>
            <text x="-10" y="-95" fontSize="10" fill="rgba(255, 255, 255, 0.7)">y</text>
            
            {/* Origin */}
            <circle cx="0" cy="0" r="2" fill="rgba(255, 255, 255, 0.7)" />
            <text x="-15" y="15" fontSize="10" fill="rgba(255, 255, 255, 0.7)">O</text>
            
            {/* Vector A */}
            <line x1="0" y1="0" x2="120" y2="-80" stroke="rgba(255, 165, 0, 0.8)" strokeWidth="2" />
            <circle cx="120" cy="-80" r="4" fill="rgba(255, 165, 0, 0.8)" />
            <text x="125" y="-80" fontSize="12" fontWeight="bold" fill="rgba(255, 165, 0, 0.9)">A</text>
            
            {/* Vector B */}
            <line x1="0" y1="0" x2="160" y2="-40" stroke="rgba(78, 205, 196, 0.8)" strokeWidth="2" />
            <circle cx="160" cy="-40" r="4" fill="rgba(78, 205, 196, 0.8)" />
            <text x="165" y="-40" fontSize="12" fontWeight="bold" fill="rgba(78, 205, 196, 0.9)">B</text>
            
            {/* Euclidean distance */}
            <line x1="120" y1="-80" x2="160" y2="-40" stroke="rgba(255, 107, 107, 0.7)" strokeWidth="1.5" strokeDasharray="4" />
            <text x="135" y="-60" fontSize="10" fill="rgba(255, 107, 107, 0.9)">Euclidean</text>
            
            {/* Angle for cosine */}
            <path d="M 40,0 A 40,40 0 0,1 28,-28" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="2" />
            <text x="35" y="-20" fontSize="10" fill="rgba(255, 255, 255, 0.7)">θ</text>
            <text x="70" y="-30" fontSize="10" fill="rgba(255, 255, 255, 0.7)">Cosine = cos(θ)</text>
          </g>
          
          {/* Formulas */}
          <g transform="translate(150, 200)">
            <rect x="-90" y="0" width="180" height="50" rx="5" fill="rgba(26, 26, 46, 0.5)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            
            {/* Cosine formula */}
            <text x="0" y="15" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Cosine Similarity = A·B / (|A|·|B|)</text>
            
            {/* Euclidean formula */}
            <text x="0" y="35" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Euclidean Distance = √[(Ax-Bx)² + (Ay-By)²]</text>
          </g>
          
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Distance Metrics</text>
          
          {/* Legend */}
          <g transform="translate(50, 260)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255, 165, 0, 0.8)" strokeWidth="2" />
            <text x="25" y="4" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Vector A</text>
            
            <line x1="80" y1="0" x2="100" y2="0" stroke="rgba(78, 205, 196, 0.8)" strokeWidth="2" />
            <text x="105" y="4" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Vector B</text>
            
            <line x1="160" y1="0" x2="180" y2="0" stroke="rgba(255, 107, 107, 0.7)" strokeWidth="1.5" strokeDasharray="4" />
            <text x="185" y="4" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Euclidean Distance</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .distance-metrics-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 300px;
          max-height: 300px;
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        
        .diagram-caption {
          text-align: center;
          margin-top: 10px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default E2_DistanceMetrics; 