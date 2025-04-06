import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

import { useScroll } from './ScrollContext';
import ParagraphObserver from './ParagraphObserver';
import { essay1 } from './essayData';

// Map essay titles to their data
const essayDataMap = {
  'Vectors: Meaning in AI Systems': essay1,
  'The Why and How of Vector Embeddings': essay1,
  // Add other essays as they're structured
};

const EssayContent = ({ content, title }) => {
  const { handleVisibilityChange } = useScroll();
  
  // Get structured data for this essay if available
  const essayData = essayDataMap[title];
  
  // If we have structured data for this essay, use it
  if (essayData) {
    // Render different content types appropriately
    const renderContentItem = (item, index) => {
      switch (item.type) {
        case 'heading':
          const HeadingTag = `h${item.level}`;
          return <HeadingTag key={item.id || index} id={item.id}>{item.text}</HeadingTag>;
          
        case 'paragraph':
          return (
            <ParagraphObserver
              key={item.id || index}
              id={item.id}
              diagramId={item.diagramId}
              diagramColor={item.diagramColor}
              onVisibilityChange={handleVisibilityChange}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {item.text}
              </ReactMarkdown>
            </ParagraphObserver>
          );
          
        default:
          return null;
      }
    };
    
    return (
      <div className="essay-content">
        <h2 className="essay-title">{title}</h2>
        <div className="essay-text">
          {essayData.content.map(renderContentItem)}
        </div>
        
        <style jsx="true">{`
          .essay-content {
            width: 100%;
            padding-right: 1rem;
          }
          
          .essay-title {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.95);
            text-align: left;
          }
          
          .essay-text {
            font-size: 1.1rem;
            line-height: 1.7;
            color: rgba(255, 255, 255, 0.85);
            text-align: left;
          }
          
          .essay-text p {
            margin-bottom: 0;
            margin-top: 0;
            text-align: left;
          }
          
          .essay-text h1, .essay-text h2, .essay-text h3 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.95);
            text-align: left;
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

          .essay-paragraph {
            margin-bottom: 0 !important;
            margin-top: 0 !important;
          }
        `}</style>
      </div>
    );
  }
  
  // Fallback for essays without structured data - use the original rendering
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
          width: 100%;
          padding-right: 1rem;
        }
        
        .essay-title {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
        }
        
        .essay-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          text-align: left;
        }
        
        .essay-text p {
          margin-bottom: 0;
          margin-top: 0;
          text-align: left;
        }
        
        .essay-text h1, .essay-text h2, .essay-text h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
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

        .essay-paragraph {
          margin-bottom: 0 !important;
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default EssayContent; 