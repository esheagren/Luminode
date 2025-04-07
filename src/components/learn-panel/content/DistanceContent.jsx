import React from 'react';

const DistanceContent = () => {
  return (
    <div>
      <p>
        In vector embeddings, the distance between words provides insight into their 
        semantic relationship. The most common measure of similarity between word vectors 
        is <strong>cosine similarity</strong>, which calculates the cosine of the angle between two vectors.
      </p>
      <p>
        Cosine similarity ranges from -1 to 1, where:
        <strong>1.0</strong> indicates perfect similarity (vectors pointing in the same direction),
        <strong>0.0</strong> indicates no similarity (orthogonal vectors),
        <strong>-1.0</strong> indicates perfect dissimilarity (vectors pointing in opposite directions).
      </p>
      <p>
        When you activate the Measure tool, the lines connecting word pairs show their
        cosine similarity. Words with similar meanings or that appear in similar contexts
        typically have <strong>higher similarity scores</strong> (closer to 1.0).
      </p>
      <p>
        This <strong>geometric interpretation</strong> of semantic similarity is what makes vector
        embeddings so powerful. You can use these measurements to find related terms,
        identify outliers, or understand the semantic structure of language.
      </p>
    </div>
  );
};

export default DistanceContent; 