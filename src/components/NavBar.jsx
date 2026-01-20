import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import luminodeLogo from '../assets/luminodeLogoSmall.png';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={luminodeLogo} alt="Luminode" className="logo-image" />
          Luminode
        </Link>
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="nav-item">
            <Link to="/app" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Explore
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Learn
            </Link>
          </li>
        </ul>
      </div>
      
      <style jsx="true">{`
        .navbar {
          background: #0f0f10;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1500px;
          padding: 0 24px;
        }
        
        .navbar-logo {
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-self: start;
          cursor: pointer;
          text-decoration: none;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .logo-image {
          height: 60px;
          width: auto;
          margin-right: 12px;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          list-style: none;
          text-align: center;
          margin-right: 24px;
        }
        
        .nav-item {
          height: 80px;
          position: relative;
        }
        
        .nav-link {
          color: #f8fafc;
          display: flex;
          align-items: center;
          text-decoration: none;
          padding: 0 16px;
          height: 100%;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: #FF9D42;
        }
        
        .nav-link:after {
          content: '';
          position: absolute;
          width: 0;
          height: 3px;
          bottom: 20px;
          left: 50%;
          background: linear-gradient(90deg, #FF9D42 0%, #FFC837 100%);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 3px;
        }
        
        .nav-link:hover:after {
          width: 60%;
        }

        /* Mobile menu toggle button */
        .mobile-menu-toggle {
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
        }

        .mobile-menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background-color: #f8fafc;
          border-radius: 2px;
          margin: 3px 0;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .mobile-menu-toggle.open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-toggle.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Tablet responsive */
        @media (max-width: 768px) {
          .navbar {
            height: 60px;
          }

          .nav-item {
            height: 60px;
          }

          .navbar-logo {
            font-size: 1.4rem;
          }

          .logo-image {
            height: 45px;
            margin-right: 8px;
          }

          .nav-link {
            padding: 0 12px;
            font-size: 0.95rem;
          }

          .nav-link:after {
            bottom: 15px;
          }
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          .navbar {
            height: 56px;
            padding: 0;
          }

          .navbar-container {
            padding: 0 12px;
          }

          .navbar-logo {
            font-size: 1.2rem;
          }

          .logo-image {
            height: 36px;
            margin-right: 6px;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .nav-menu {
            position: absolute;
            top: 56px;
            left: 0;
            right: 0;
            flex-direction: column;
            background-color: #0f0f10;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            margin-right: 0;
          }

          .nav-menu.mobile-open {
            max-height: 200px;
          }

          .nav-item {
            height: auto;
            width: 100%;
          }

          .nav-link {
            display: block;
            padding: 16px 24px;
            height: auto;
            width: 100%;
            text-align: left;
          }

          .nav-link:after {
            display: none;
          }

          .nav-link:hover {
            background-color: rgba(255, 157, 66, 0.1);
          }
        }
      `}</style>
    </nav>
  );
};

export default NavBar; 