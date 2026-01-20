import React from 'react';

const HamburgerMenu = ({ isOpen, onClick }) => {
  return (
    <button
      className={`hamburger-menu ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-sidebar"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>

      <style jsx="true">{`
        .hamburger-menu {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 1001;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .hamburger-menu:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .hamburger-menu:focus {
          outline: 2px solid #FF9D42;
          outline-offset: 2px;
        }

        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background-color: #f8fafc;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger-line:nth-child(1) {
          margin-bottom: 6px;
        }

        .hamburger-line:nth-child(2) {
          margin-bottom: 6px;
        }

        /* Open state - X animation */
        .hamburger-menu.open .hamburger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger-menu.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger-menu.open .hamburger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Show on mobile */
        @media (max-width: 768px) {
          .hamburger-menu {
            display: flex;
          }
        }
      `}</style>
    </button>
  );
};

export default HamburgerMenu;
