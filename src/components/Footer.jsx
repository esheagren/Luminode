import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
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
          {/* Node connection animation */}
          <div className="node node1"></div>
          <div className="node node2"></div>
          <div className="node node3"></div>
          <div className="connection connection1-2"></div>
          <div className="connection connection2-3"></div>
          <div className="connection connection1-3"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 