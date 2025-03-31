export const getTooltipContent = (tooltipType) => {
  switch (tooltipType) {
    case '3D':
      return {
        title: '3D View',
        content: (
          <>
            <p>Toggle between 2D and 3D visualization of word vectors.</p>
            <h3>How to use:</h3>
            <ul>
              <li>Click to switch between 2D and 3D modes</li>
              <li>In 3D mode, drag to rotate the view</li>
              <li>Use mouse wheel to zoom in and out</li>
            </ul>
          </>
        )
      };
      
    case 'Measure':
      return {
        title: 'Measure Tool',
        content: (
          <>
            <p>
              Activate the ruler tool to measure semantic distances using cosine similarity. 
              Cosine similarity calculates the cosine of the angle between two embedding vectors, 
              providing a mathematical measure of semantic relatedness in the embedding space.
            </p>
            <h3>How to use:</h3>
            <ul>
              <li>Click to activate/deactivate the measurement tool</li>
              <li>When active, click on two words to calculate their embedding vector cosine similarity</li>
              <li>Values range from -1 to 1, displayed as -100% to 100%, where higher values indicate vectors pointing in similar directions</li>
            </ul>
          </>
        )
      };
      
    case 'Neighbors':
      return {
        title: 'Neighbors Tool',
        content: (
          <>
            <p>
              Find the nearest semantic neighbors for all words in your visualization. 
              This tool identifies the most similar words to each of your selected words 
              based on cosine similarity in the embedding space, revealing the local 
              semantic neighborhood structure.
            </p>
            <h3>How to use:</h3>
            <ul>
              <li>Click to activate/deactivate the neighbors search</li>
              <li>When activated, the tool automatically finds the 4 closest neighbors for each word</li>
              <li>Neighbors are connected to their source words with lines indicating semantic similarity</li>
              <li>The closer a neighbor is positioned, the more semantically similar it is to the source word</li>
            </ul>
          </>
        )
      };
      
    case 'Analogy':
      return {
        title: 'Analogy Tool',
        content: (
          <>
            <p>
              Explore semantic relationships through word analogies. This tool solves 
              analogies in the form of "A is to B as C is to ?" using vector arithmetic 
              in the embedding space.
            </p>
            <h3>How to use:</h3>
            <ul>
              <li>Click to enter analogy mode</li>
              <li>Select three words in sequence to form your analogy</li>
              <li>The tool will find words that complete the analogy pattern</li>
              <li>Results show which words best fit the relationship pattern</li>
            </ul>
          </>
        )
      };
      
    case 'Slice':
      return {
        title: 'Slice Tool',
        content: (
          <>
            <p>
              Explore the semantic space between two concepts. The slice tool 
              finds a semantic cross-section between two words, revealing the 
              gradual progression of meaning from one concept to another.
            </p>
            <h3>How to use:</h3>
            <ul>
              <li>Click to enter slice mode</li>
              <li>Select two words to define the start and end points</li>
              <li>The tool will calculate a semantic path between these points</li>
              <li>Results visualize how meaning transitions across the space</li>
            </ul>
          </>
        )
      };
      
    case 'Reset':
      return {
        title: 'Reset',
        content: (
          <>
            <p>Clear the visualization and remove all added words.</p>
          </>
        )
      };
      
    case 'Learn':
      return {
        title: 'Learn',
        content: (
          <>
            <p>View documentation and learning resources about vector embeddings.</p>
          </>
        )
      };
      
    default:
      return {
        title: 'Tool Information',
        content: (
          <>
            <p>Hover over specific tools in the toolbar to learn more about their vector embedding operations and usage methods.</p>
          </>
        )
      };
  }
}; 