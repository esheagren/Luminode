import React from 'react';

const AnalogyContent = () => {
  return (
    <div>
      <p>
        One of the most fascinating properties of vector embeddings is their ability to 
        encode <strong>analogical relationships</strong>. The classic example is "<strong>king - man + woman = queen</strong>," 
        demonstrating that the vector space captures gender relationships.
      </p>
      <p>
        The Analogy tool lets you explore these relationships by selecting three words: 
        the first pair establishes a relationship, and the third word serves as the base for 
        finding analogous words. For example, selecting "man," "woman," and "king" would 
        help find "queen."
      </p>
      <p>
        Mathematically, this works by computing <strong>vector arithmetic</strong>:
        v(word2) - v(word1) + v(word3) = v(result).
        The result is then searched against the embedding database to find the closest match.
      </p>
      <p>
        This capability isn't just a party trick—it reveals how neural networks learn to 
        encode meaningful <strong>semantic relationships as geometric relationships</strong> in the embedding 
        space. These relationships can include gender, tense, plurality, geography, and 
        countless other linguistic and conceptual patterns.
      </p>
    </div>
  );
};

export default AnalogyContent; 