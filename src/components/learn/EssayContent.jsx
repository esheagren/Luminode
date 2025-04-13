import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

import { useScroll } from './ScrollContext';
import ParagraphObserver from './ParagraphObserver';
import { essay1, essay2, essay3 } from './essayData';

// Map essay titles to their data
const essayDataMap = {
  'Vectors: Meaning in AI Systems': essay1,
  'The Why and How of Vector Embeddings': essay1, // Keep for backward compatibility
  'Exploring and Visualizing Vector Embeddings': essay2,
  'Vector Databases and Large-Scale Retrieval': essay3
};

const EssayContent = ({ content, title }) => {
  const { handleVisibilityChange, userHasScrolled, resetScrollState } = useScroll();
  
  // Get structured data for this essay if available
  const essayData = essayDataMap[title];
  
  // Reset scroll state when switching essays
  useEffect(() => {
    resetScrollState();
  }, [title, resetScrollState]);
  
  // Make sure the first paragraph is highlighted on mount and when scroll state changes
  useEffect(() => {
    if (essayData && essayData.content.length > 0) {
      // Find first paragraph
      const firstParagraph = essayData.content.find(item => item.type === 'paragraph');
      if (firstParagraph) {
        // If user hasn't scrolled, only show the intro paragraph diagram
        // Support any of the essay intro paragraphs: intro-p1, e2-intro-p1, e3-intro-p1
        if (!userHasScrolled && 
            (firstParagraph.id.includes('intro-p1') || 
             firstParagraph.id === 'e2-intro-p1' || 
             firstParagraph.id === 'e3-intro-p1')) {
          // Manually trigger visibility for the first paragraph to ensure it's highlighted
          // Note: we're still passing diagramId even if it's empty to maintain the paragraph highlighting
          handleVisibilityChange({
            id: firstParagraph.id,
            diagramId: firstParagraph.diagramId || '',
            diagramColor: firstParagraph.diagramColor,
            isVisible: true,
            sectionId: firstParagraph.id.split('-')[0],
            ratio: 1.0
          });
        }
        // If user has started scrolling and the first paragraph is not manually highlighted anymore,
        // allow normal scroll-based highlighting to take over
      }
    }
  }, [essayData, handleVisibilityChange, userHasScrolled]);
  
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
              diagramId={item.diagramId || ''}
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
          <div className="essay-bottom-space"></div>
        </div>
        
        <style jsx="true">{`
          .essay-content {
            width: 100%;
            padding-right: 1rem;
          }
          
          .essay-title {
            font-size: 2.4rem;
            margin-bottom: 1.8rem;
            padding-bottom: 0.6rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.95);
            text-align: left;
          }
          
          .essay-text {
            font-size: 1.5rem;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.85);
            text-align: left;
          }
          
          .essay-text p {
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
            text-align: left;
          }
          
          .essay-bottom-space {
            height: 70vh;
            min-height: 500px;
          }
          
          .essay-text h1, .essay-text h2, .essay-text h3 {
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            color: rgba(255, 255, 255, 0.95);
            text-align: left;
          }
          
          .essay-text h2 {
            font-size: 2.1rem;
          }
          
          .essay-text h3 {
            font-size: 1.8rem;
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
        <div className="essay-bottom-space"></div>
      </div>
      
      <style jsx="true">{`
        .essay-content {
          width: 100%;
          padding-right: 1rem;
        }
        
        .essay-title {
          font-size: 2.4rem;
          margin-bottom: 1.8rem;
          padding-bottom: 0.6rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
        }
        
        .essay-text {
          font-size: 1.5rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          text-align: left;
        }
        
        .essay-text p {
          margin-bottom: 0.5rem;
          margin-top: 0.5rem;
          text-align: left;
        }
        
        .essay-bottom-space {
          height: 70vh;
          min-height: 500px;
        }
        
        .essay-text h1, .essay-text h2, .essay-text h3 {
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.95);
          text-align: left;
        }
        
        .essay-text h2 {
          font-size: 2.1rem;
        }
        
        .essay-text h3 {
          font-size: 1.8rem;
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