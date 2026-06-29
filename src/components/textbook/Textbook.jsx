import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chapters, getChapter, getChapterIndex } from '../../data/textbook/chapters';
import Sandbox from './Sandbox';

// Renders one block of a chapter. Chapters are data (see data/textbook/chapters.js);
// this maps each block type to a component.
const Block = ({ block }) => {
  if (block.type === 'prose') {
    return (
      <div className="tb-prose">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.md}
        </ReactMarkdown>
      </div>
    );
  }
  if (block.type === 'sandbox') {
    return (
      <Sandbox
        words={block.words}
        addable={block.addable}
        caption={block.caption}
      />
    );
  }
  return null;
};

const Textbook = () => {
  const { chapter: slug } = useParams();
  const navigate = useNavigate();

  const chapter = getChapter(slug);
  const index = getChapterIndex(chapter.slug);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return (
    <div className="tb-page">
      <div className="tb-content">
        <Link to="/app" className="tb-explorer-link">
          ← Open explorer
        </Link>

        {chapter.subtitle && <p className="tb-eyebrow">{chapter.subtitle}</p>}
        <h1 className="tb-title">{chapter.title}</h1>

        {chapter.blocks.map((block, i) => (
          <Block key={`${chapter.slug}-${i}`} block={block} />
        ))}

        <div className="tb-nav">
          {prev ? (
            <button
              className="tb-nav-btn"
              onClick={() => navigate(`/learn/${prev.slug}`)}
            >
              ← {prev.title}
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              className="tb-nav-btn tb-nav-next"
              onClick={() => navigate(`/learn/${next.slug}`)}
            >
              {next.title} →
            </button>
          ) : (
            <span className="tb-nav-end">More chapters coming soon</span>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .tb-page {
          width: 100%;
          min-height: 100vh;
          overflow-y: auto;
          background: #0e0e10;
          color: #e8e8ea;
        }
        .tb-content {
          max-width: 720px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
        }
        .tb-explorer-link {
          display: inline-block;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
        }
        .tb-explorer-link:hover {
          color: #FF9D42;
        }
        .tb-eyebrow {
          margin: 0 0 0.25rem;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FF9D42;
        }
        .tb-title {
          margin: 0 0 1.5rem;
          font-size: 2rem;
          line-height: 1.15;
          color: #f8fafc;
        }
        .tb-prose {
          font-size: 1.08rem;
          line-height: 1.7;
          color: rgba(232, 232, 234, 0.92);
        }
        .tb-prose p {
          margin: 0 0 1.1rem;
        }
        .tb-prose strong {
          color: #FF9D42;
          font-weight: 600;
        }
        .tb-prose code {
          font-family: 'SFMono-Regular', Menlo, monospace;
          font-size: 0.92em;
          padding: 1px 6px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }
        .tb-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .tb-nav-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.95rem;
          color: #e8e8ea;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tb-nav-btn:hover {
          background: rgba(255, 157, 66, 0.12);
          border-color: rgba(255, 157, 66, 0.4);
          color: #FF9D42;
        }
        .tb-nav-end {
          font-size: 0.9rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Textbook;
