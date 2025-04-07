import React from 'react';

const VectorEmbeddingContent = () => {
  return (
    <div>
      <p>
        Vector embeddings transform words into <strong>numerical representations</strong>, 
        placing them in a high-dimensional space where semantic relationships
        are preserved as <strong>geometric relationships</strong>.
      </p>
      <p>
        In this space, words with similar meanings cluster together, while 
        unrelated concepts are positioned far apart. The <strong>distance between words</strong> 
        reflects their semantic similarity, and the <strong>direction</strong> from one word to 
        another can capture meaningful relationships.
      </p>
      <p>
        These embeddings are created by training neural networks on large text 
        corpora, where the network learns to predict words based on their context. 
        The resulting vectors capture remarkable linguistic patterns, including{" "}
        <strong>analogies</strong> like "king is to queen as man is to woman."
      </p>
      <p>
        Modern language models like BERT and GPT use more sophisticated embedding 
        techniques, but the basic principle remains: representing language as vectors 
        enables computers to understand semantic relationships by performing{" "}
        <strong>mathematical operations</strong> in this embedded space.
      </p>
    </div>
  );
};

export default VectorEmbeddingContent; 