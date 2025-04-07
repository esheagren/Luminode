import React from 'react';

const SliceContent = () => {
  return (
    <div>
      <p>
        The Slice tool allows you to explore the semantic space between two words by
        finding intermediate concepts that connect them. Unlike the direct line of a
        midpoint calculation, a slice finds a path through the embedding space that
        follows the contours of meaning.
      </p>
      <p>
        When you select two words and perform a slice operation, the system identifies 
        a series of words that represent semantic stepping stones between your endpoints. 
        This is similar to finding points along a path through the semantic landscape.
      </p>
      <p>
        This tool is particularly useful for understanding gradual transitions between
        concepts. For example, a slice between "ice" and "steam" might reveal words like
        "water," "vapor," and "liquid," showing the conceptual progression between
        different states of matter.
      </p>
      <p>
        Slices provide insight into how concepts relate across semantic space and can
        help uncover unexpected connections or intermediary concepts that bridge seemingly
        unrelated words. They demonstrate how the embedding space is densely populated with
        meaningful semantic relationships.
      </p>
    </div>
  );
};

export default SliceContent; 