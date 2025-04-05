import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

const EssayContent = ({ content, title }) => {
  return (
    <div className="essay-content">
      <h2 className="essay-title">{title}</h2>
      <div className="essay-text">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      <style jsx="true">{`
        .essay-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .essay-title {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.95);
        }
        
        .essay-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
        }
        
        .essay-text p {
          margin-bottom: 1.5rem;
        }
        
        .essay-text h1, .essay-text h2, .essay-text h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .essay-text a {
          color: #FFA500;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        
        .essay-text a:hover {
          border-bottom-color: #FFA500;
        }
        
        /* Math formula styling */
        .essay-text .math {
          overflow-x: auto;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.95);
        }

        /* Override KaTeX styling for dark theme */
        .katex {
          color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
};

export default EssayContent; 