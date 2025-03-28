import React from 'react';

const View3DIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
    <path d="M5.3 5.3l13.4 13.4"></path>
    <path d="M8.6 2.5c1.1.9 2 2 2.6 3.2a19 19 0 0 1 2.9-2 19 19 0 0 1-5.3 5.4 20.7 20.7 0 0 1-3-4 20.7 20.7 0 0 1 2.8-2.6Z"></path>
  </svg>
);

const View2DIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    <path d="M3 9h18"></path>
    <path d="M9 3v18"></path>
  </svg>
);

const ViewButton = ({ viewMode, setViewMode, isCompact = false }) => {
  const toggle = () => {
    setViewMode(viewMode === '2D' ? '3D' : '2D');
  };
  
  // In compact mode, return just the icon
  if (isCompact) {
    return (
      <button 
        className={`view-toggle-compact`}
        onClick={toggle}
        title={`Switch to ${viewMode === '2D' ? '3D' : '2D'} View`}
      >
        {viewMode === '2D' ? <View3DIcon /> : <View2DIcon />}
        <span>{viewMode === '2D' ? '3D' : '2D'}</span>
        <style jsx="true">{`
          .view-toggle-compact {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            color: #ccc;
            border: none;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.15s ease;
            gap: 0.25rem;
          }
          
          .view-toggle-compact:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white;
          }
        `}</style>
      </button>
    );
  }
  
  // Original button design for non-compact mode
  return (
    <button 
      className={`view-toggle ${viewMode === '3D' ? 'view-3d' : 'view-2d'}`}
      onClick={toggle}
    >
      {viewMode === '2D' ? '3D View' : '2D View'}
      <style jsx="true">{`
        .view-toggle {
          padding: 0.4rem 0.75rem;
          border-radius: 16px;
          border: none;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          background: linear-gradient(135deg, #FFC837 0%, #FF8008 100%);
        }
        
        .view-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(255, 136, 8, 0.4);
        }
      `}</style>
    </button>
  );
};

export default ViewButton; 