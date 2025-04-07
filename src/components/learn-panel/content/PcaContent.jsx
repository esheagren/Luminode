import React from 'react';

const PcaContent = () => {
  return (
    <div>
      <p>
        <strong>Principal Component Analysis (PCA)</strong> is a dimensionality reduction technique
        that allows us to visualize high-dimensional vector embeddings in 3D.
        Word embeddings typically have hundreds of dimensions, making them impossible
        to visualize directly.
      </p>
      <p>
        PCA works by identifying the <strong>principal components</strong> in the embedding 
        space that capture the most variance in the data. By projecting the embeddings 
        onto these principal components, we can create a lower-dimensional representation 
        that preserves as much of the original structure as possible.
      </p>
      <p>
        The 3D view you're seeing is constructed by projecting the high-dimensional 
        word vectors onto the three principal components that capture the most variance. 
        This gives us a <strong>glimpse into the structure</strong> of the embedding space, showing how 
        words relate to each other semantically.
      </p>
      <p>
        While the 3D projection inevitably loses some information, it still reveals 
        meaningful clusters, analogies, and relationships between words. <strong>Rotating 
        the view</strong> allows you to explore different perspectives of this semantic space.
      </p>
    </div>
  );
};

export default PcaContent; 