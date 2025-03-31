import React, { useState } from 'react';

const Disclaimer = () => {
  const [expandedExample, setExpandedExample] = useState(null);
  
  const toggleExample = (example) => {
    if (expandedExample === example) {
      setExpandedExample(null);
    } else {
      setExpandedExample(example);
    }
  };
  
  return (
    <div className="about-section disclaimer">
      <div className="disclaimer-header">
        <h2>Technical Limitations</h2>
        <div className="disclaimer-subtitle">
          Understanding the constraints of vector search technologies
        </div>
      </div>
      
      <p>
        While Luminode leverages cutting-edge AI technologies to deliver powerful semantic search capabilities, 
        it's important to understand the inherent limitations of the underlying technologies.
      </p>
      <p>
        These limitations are not bugs but rather <span className="highlight">technical constraints</span> that affect 
        all systems built on vector embeddings and approximate nearest neighbor search.
      </p>
      
      <div className="limitations-container">
        <h3>Key Technical Limitations</h3>
        
        <div className={`limitation-card ${expandedExample === 'embeddings' ? 'expanded' : ''}`} onClick={() => toggleExample('embeddings')}>
          <div className="limitation-header">
            <div className="limitation-icon">🧠</div>
            <h4>LLaMA Embedding Limitations</h4>
            <div className="expand-icon">{expandedExample === 'embeddings' ? '−' : '+'}</div>
          </div>
          <div className="limitation-content">
            <p>
              While LLaMA provides rich contextual embeddings, their quality depends on the model's training data 
              and understanding of language.
            </p>
            {expandedExample === 'embeddings' && (
              <div className="example-box">
                <div className="example-title">Technical Details:</div>
                <ul>
                  <li>
                    <strong>Training Data Biases:</strong> Embeddings may reflect biases present in the training corpus
                  </li>
                  <li>
                    <strong>Domain-Specific Knowledge:</strong> Performance varies based on domain representation in training
                  </li>
                  <li>
                    <strong>Out-of-Domain Queries:</strong> Novel concepts or specialized terminology may be poorly embedded
                  </li>
                  <li>
                    <strong>Language Limitations:</strong> Performance degrades for non-English languages and multilingual content
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className={`limitation-card ${expandedExample === 'ann' ? 'expanded' : ''}`} onClick={() => toggleExample('ann')}>
          <div className="limitation-header">
            <div className="limitation-icon">🔍</div>
            <h4>Approximate Nearest Neighbor Trade-offs</h4>
            <div className="expand-icon">{expandedExample === 'ann' ? '−' : '+'}</div>
          </div>
          <div className="limitation-content">
            <p>
              HNSW search provides near-instant results but sacrifices some accuracy compared to brute-force search,
              resulting in a precision-speed trade-off.
            </p>
            {expandedExample === 'ann' && (
              <div className="example-box">
                <div className="example-title">Technical Details:</div>
                <ul>
                  <li>
                    <strong>Approximate Results:</strong> Some true nearest neighbors might be missed (typically 5-10%)
                  </li>
                  <li>
                    <strong>Parameter Sensitivity:</strong> Performance depends on proper index configuration (M, ef_construction, ef_search)
                  </li>
                  <li>
                    <strong>Memory Requirements:</strong> HNSW indices use more memory than some other ANN algorithms
                  </li>
                  <li>
                    <strong>Update Complexity:</strong> Dynamic insertion is more complex than in some other index structures
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className={`limitation-card ${expandedExample === 'cosine' ? 'expanded' : ''}`} onClick={() => toggleExample('cosine')}>
          <div className="limitation-header">
            <div className="limitation-icon">📐</div>
            <h4>Cosine Similarity Constraints</h4>
            <div className="expand-icon">{expandedExample === 'cosine' ? '−' : '+'}</div>
          </div>
          <div className="limitation-content">
            <p>
              While cosine similarity is well-suited for semantic search, it has limitations in capturing
              certain types of relationships between concepts.
            </p>
            {expandedExample === 'cosine' && (
              <div className="example-box">
                <div className="example-title">Technical Details:</div>
                <ul>
                  <li>
                    <strong>Magnitude Insensitivity:</strong> Ignores vector length which might contain useful information
                  </li>
                  <li>
                    <strong>Symmetric Measurement:</strong> Direction of relationship is not captured (A→B same as B→A)
                  </li>
                  <li>
                    <strong>Linear Relationships:</strong> Complex, non-linear relationships may not be well-represented
                  </li>
                  <li>
                    <strong>False Connections:</strong> May detect similarities between unrelated concepts that share context
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className={`limitation-card ${expandedExample === 'pca' ? 'expanded' : ''}`} onClick={() => toggleExample('pca')}>
          <div className="limitation-header">
            <div className="limitation-icon">📊</div>
            <h4>Dimensionality Reduction Information Loss</h4>
            <div className="expand-icon">{expandedExample === 'pca' ? '−' : '+'}</div>
          </div>
          <div className="limitation-content">
            <p>
              PCA visualization necessarily discards information from the original high-dimensional space,
              potentially obscuring certain relationships.
            </p>
            {expandedExample === 'pca' && (
              <div className="example-box">
                <div className="example-title">Technical Details:</div>
                <ul>
                  <li>
                    <strong>Variance Focus:</strong> PCA captures dimensions with highest variance, not necessarily semantic meaning
                  </li>
                  <li>
                    <strong>Linear Projection:</strong> Cannot represent non-linear manifolds in the data effectively
                  </li>
                  <li>
                    <strong>Projection Distortion:</strong> Distance relationships in visualization don't match original space
                  </li>
                  <li>
                    <strong>Feature Interpretation:</strong> Principal components often blend multiple original features, making interpretation difficult
                  </li>
                </ul>
                <div className="visual-hint">
                  Important semantic relationships may exist along dimensions not captured in the visualization.
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={`limitation-card ${expandedExample === 'scale' ? 'expanded' : ''}`} onClick={() => toggleExample('scale')}>
          <div className="limitation-header">
            <div className="limitation-icon">⚖️</div>
            <h4>Scaling Challenges</h4>
            <div className="expand-icon">{expandedExample === 'scale' ? '−' : '+'}</div>
          </div>
          <div className="limitation-content">
            <p>
              Vector databases face technical challenges when scaling to extremely large datasets 
              with billions of vectors.
            </p>
            {expandedExample === 'scale' && (
              <div className="example-box">
                <div className="example-title">Technical Details:</div>
                <ul>
                  <li>
                    <strong>Memory Consumption:</strong> High-quality indices require significant RAM
                  </li>
                  <li>
                    <strong>Query Latency:</strong> Performance can degrade with very large collections
                  </li>
                  <li>
                    <strong>Index Build Time:</strong> Initial indexing of large collections can be time-consuming
                  </li>
                  <li>
                    <strong>Distributed Coordination:</strong> Maintaining consistency across shards adds complexity
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="insight-box">
        <h3>The Future of Vector Search Technology</h3>
        <p>
          These limitations represent active areas of research in the vector database and machine learning 
          communities. Future improvements in embedding models, ANN algorithms, and vector database 
          technology will continue to address these challenges.
        </p>
        <p>
          Despite these constraints, vector search technologies like those used in Luminode represent a 
          revolutionary approach to information retrieval that significantly outperforms traditional 
          keyword-based search in many real-world applications.
        </p>
      </div>

      <style jsx="true">{`
        .about-section {
          margin-bottom: 2rem;
        }
        
        .disclaimer {
          background-color: rgba(255, 165, 0, 0.05);
          border-radius: 8px;
          padding: 1.5rem;
          border-left: 4px solid #FFA500;
        }
        
        .disclaimer-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .disclaimer-subtitle {
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }
        
        h2 {
          color: #FFA500;
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }
        
        h3 {
          color: #FFA500;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 1.4rem;
          text-align: center;
        }
        
        h4 {
          color: #FFA500;
          margin: 0;
          font-size: 1.2rem;
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .highlight {
          color: #FFA500;
          font-weight: bold;
        }
        
        .limitations-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .limitation-card {
          background-color: rgba(26, 26, 46, 0.8);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .limitation-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 165, 0, 0.3);
        }
        
        .limitation-card.expanded {
          background-color: rgba(255, 165, 0, 0.1);
          border-color: rgba(255, 165, 0, 0.5);
        }
        
        .limitation-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .limitation-card.expanded .limitation-header {
          border-bottom-color: rgba(255, 165, 0, 0.3);
        }
        
        .limitation-icon {
          width: 36px;
          height: 36px;
          background-color: rgba(255, 165, 0, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: #FFA500;
          flex-shrink: 0;
        }
        
        .expand-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 165, 0, 0.2);
          border-radius: 50%;
          font-weight: bold;
          color: #FFA500;
          margin-left: auto;
          transition: all 0.3s ease;
        }
        
        .limitation-card.expanded .expand-icon {
          background-color: rgba(255, 165, 0, 0.4);
        }
        
        .limitation-content {
          padding: 1rem;
          transition: all 0.3s ease;
        }
        
        .example-box {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.5rem;
          border-left: 3px solid rgba(255, 165, 0, 0.5);
        }
        
        .example-title {
          font-weight: bold;
          color: #FFA500;
          margin-bottom: 0.5rem;
        }
        
        .visual-hint {
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.5rem;
          font-size: 0.9rem;
          padding: 0.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .insight-box {
          background-color: rgba(255, 165, 0, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
          border: 1px dashed rgba(255, 165, 0, 0.5);
        }
        
        .insight-box h3 {
          text-align: left;
          margin-top: 0;
        }
        
        .insight-box p:last-child {
          margin-bottom: 0;
        }
        
        ul {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        li {
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        strong {
          color: #FFA500;
        }
      `}</style>
    </div>
  );
};

export default Disclaimer; 