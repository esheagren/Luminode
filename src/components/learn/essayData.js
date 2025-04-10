// Import essay content from separate files
import essay1 from './essayContent1';
import essay2 from './essayContent2';
import essay3 from './essayContent3';

// Section order for essays - defines the paragraph ordering for highlighting
// These constants must match the ones in ScrollContext.jsx
export const SECTION_ORDER = {
  // Essay 1 sections
  'intro': 0,       // Introduction section - paragraphs 1, 2
  'vector': 100,    // What is a Vector - paragraphs 1-6
  'meaning': 200,   // Why Vectors Reflect Meaning - paragraphs 1-4
  'contextual': 300, // Contextual Embeddings - paragraphs 1-6
  'algorithms': 400, // Embedding Algorithms - paragraphs 1-9
  'applications': 500, // Applications - paragraphs 1-8
  'summary': 600,     // Summary - paragraphs 1-3
  
  // Essay 2 sections
  'e2-intro': 0,        // Introduction section
  'dim-reduction': 100, // Dimensionality Reduction section
  'neighbors': 200,     // Nearest Neighbor Search section
  'metrics': 300,       // Distance and Similarity Metrics section
  'analogies': 400,     // Analogization section
  'cross-sections': 500, // Slice and Cross-Sections section
  'e2-summary': 600,     // Conclusion section
  
  // Essay 3 sections
  'e3-intro': 0,           // Introduction section
  'vector-dbs': 100,       // Vector Databases section
  'chunking': 200,         // Chunking section
  'rag': 300,              // RAG section
  'considerations': 400,   // Practical Considerations section
  'e3-summary': 500        // Summary section
};

// Export all three essays
export { essay1, essay2, essay3 };

// Export available essays list
export const availableEssays = [
  "Vectors: Meaning in AI Systems",
  "Exploring and Visualizing Vector Embeddings",
  "Vector Databases and Large-Scale Retrieval"
]; 