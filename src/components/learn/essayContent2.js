import colors from './colors';

// Essay 2: Exploring and Visualizing Vector Embeddings
const essay2 = {
  title: "Exploring and Visualizing Vector Embeddings",
  content: [
    {
      type: "paragraph",
      id: "e2-intro-p1",
      text: "In our previous essay, we explored how vector embeddings can capture meaning by representing words and concepts as points in a high-dimensional space. Now, let's examine the practical ways we can explore, visualize, and manipulate these embeddings to extract valuable insights.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dictionary
    },
    {
      type: "paragraph",
      id: "e2-intro-p2",
      text: "As we'll see, these techniques not only help us understand the embeddings better but also form the foundation for powerful applications in search, recommendation systems, and AI-powered tools.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dictionary
    },
    
    // Dimensionality Reduction section
    {
      type: "heading",
      level: 2,
      id: "dim-reduction-heading",
      text: "1. Dimensionality Reduction for Visualization"
    },
    {
      type: "paragraph",
      id: "dim-reduction-p1",
      text: "Vector embeddings typically exist in hundreds of dimensions—far more than humans can visualize directly. To make them interpretable, we need to project them down to two or three dimensions while preserving their relationships as much as possible.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "dim-reduction-p2",
      text: "The most common techniques for this include Principal Component Analysis (PCA), t-SNE (t-Distributed Stochastic Neighbor Embedding), and UMAP (Uniform Manifold Approximation and Projection). Each has different strengths: PCA preserves global structure but often loses local relationships, t-SNE excels at preserving local clusters but can distort global structure, while UMAP attempts to balance both.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.meaning
    },
    
    // Nearest Neighbor Search section
    {
      type: "heading",
      level: 2,
      id: "neighbors-heading",
      text: "2. Finding Similar Words with Nearest Neighbors"
    },
    {
      type: "paragraph",
      id: "neighbors-p1",
      text: "One of the most intuitive ways to explore vector embeddings is to find the nearest neighbors of a given word—those words whose vectors are closest in the embedding space. This directly leverages the property that similar words have similar vectors.",
      diagramId: "E2_NearestNeighbor",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "neighbors-p2",
      text: "For example, the nearest neighbors of \"computer\" might include \"laptop,\" \"desktop,\" and \"PC.\" This can reveal semantic relationships, synonyms, and even domain-specific terminology clusters.",
      diagramId: "E2_NearestNeighbor",
      diagramColor: colors.contextual
    },
    
    // Distance Metrics section
    {
      type: "heading",
      level: 2,
      id: "metrics-heading",
      text: "3. Distance and Similarity Metrics"
    },
    {
      type: "paragraph",
      id: "metrics-p1",
      text: "To compare vectors, we need ways to measure distance or similarity. The most common metrics include cosine similarity (which measures the angle between vectors), Euclidean distance (the straight-line distance), and dot product (which combines both direction and magnitude).",
      diagramId: "E2_DistanceMetrics",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "metrics-p2",
      text: "Different applications may call for different metrics. Cosine similarity is often preferred for text embeddings because it focuses on direction rather than magnitude, making it less sensitive to document length variations.",
      diagramId: "E2_DistanceMetrics",
      diagramColor: colors.algorithms
    },
    
    // Vector Analogies section
    {
      type: "heading",
      level: 2,
      id: "analogies-heading",
      text: "4. Exploring Analogies"
    },
    {
      type: "paragraph",
      id: "analogies-p1",
      text: "As mentioned in our previous essay, vector embeddings can capture analogical relationships. Given three words A, B, and C, we can find a fourth word D such that the relationship A:B is similar to C:D by computing A - B + C and finding the nearest word to that result.",
      diagramId: "E2_VectorAnalogies",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "analogies-p2",
      text: "This is how we can discover relations like \"king - man + woman ≈ queen\" or \"Paris - France + Italy ≈ Rome\". These analogies reveal how the embedding space has organized semantic concepts along consistent dimensions.",
      diagramId: "E2_VectorAnalogies",
      diagramColor: colors.applications
    },
    
    // Cross Sections section
    {
      type: "heading",
      level: 2,
      id: "cross-sections-heading",
      text: "5. Vector Slices and Cross-Sections"
    },
    {
      type: "paragraph",
      id: "cross-sections-p1",
      text: "We can also explore the space between concepts by taking slices or cross-sections of the embedding space. By interpolating between two word vectors, we can find concepts that lie conceptually \"between\" them.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "cross-sections-p2",
      text: "For instance, the midpoint between \"hot\" and \"cold\" might be near \"lukewarm\" or \"tepid\". This technique can reveal nuanced relationships and gradations of meaning that exist in the embedding space.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.summary
    },
    
    // Summary
    {
      type: "heading",
      level: 2,
      id: "e2-summary-heading",
      text: "Summary"
    },
    {
      type: "paragraph",
      id: "e2-summary-p1",
      text: "The techniques we've explored in this essay—dimensionality reduction, nearest neighbor search, distance metrics, analogies, and cross-sections—provide powerful ways to navigate and understand the rich semantic space captured by vector embeddings.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "e2-summary-p2",
      text: "By applying these methods, we can move beyond treating embeddings as abstract mathematical objects and begin to intuitively grasp how they represent meaning. In the next essay, we'll explore how these embeddings can be stored and retrieved at scale using vector databases and how they can be integrated into systems for retrieval-augmented generation.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.summary
    }
  ]
};

export default essay2; 