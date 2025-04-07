import React from 'react';

const AnalogyContent = () => {
  return (
    <div>
      <p>
        One of the most fascinating properties of vector embeddings is their ability to 
        encode analogical relationships. The classic example is "king - man + woman = queen," 
        demonstrating that the vector space captures gender relationships.
      </p>
      <p>
        The Analogy tool lets you explore these relationships by selecting three words: 
        the first pair establishes a relationship, and the third word serves as the base for 
        finding analogous words. For example, selecting "man," "woman," and "king" would 
        help find "queen."
      </p>
      <p>
        Mathematically, this works by computing vector arithmetic:
        v(word2) - v(word1) + v(word3) = v(result)
        The result is then searched against the embedding database to find the closest match.
      </p>
      <p>
        This capability isn't just a party trick—it reveals how neural networks learn to 
        encode meaningful semantic relationships as geometric relationships in the embedding 
        space. These relationships can include gender, tense, plurality, geography, and 
        countless other linguistic and conceptual patterns.
      </p>
    </div>
  );
};

export default AnalogyContent; 