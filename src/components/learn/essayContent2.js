import colors from './colors';

// Essay 2: Exploring and Visualizing Vector Embeddings
const essay2 = {
  title: "Exploring and Visualizing Vector Embeddings",
  content: [
    // Introduction
    {
      type: "paragraph",
      id: "e2-intro-p1",
      text: "Vector embeddings translate words, documents, or other entities into points in a high-dimensional space. Suppose you have 50,000 English words, each embedded by a LLaMa-based model into a coordinate of several hundred dimensions. While these vectors capture rich semantic relationships, they are not automatically understandable in their raw numeric form. To truly grasp the geometry of your embeddings, you need systematic methods for visualization and exploration. Below, we focus on five major techniques: dimensionality reduction, nearest neighbor search, distance and similarity metrics, vector analogies, and midpoint-based cross-sections.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dimensionality
    },
    
    // Dimensionality Reduction section
    {
      type: "heading",
      level: 2,
      id: "dim-reduction-heading",
      text: "Dimensionality Reduction for Visualization"
    },
    {
      type: "paragraph",
      id: "dim-reduction-p1",
      text: "One major challenge with embeddings is their high dimensionality, which far exceeds the human capacity to visualize data in two or three dimensions. Techniques such as Principal Component Analysis (PCA), t-SNE, and UMAP help project these high-dimensional vectors onto a more manageable 2D or 3D plane.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dimensionality
    },
    {
      type: "paragraph",
      id: "dim-reduction-p2",
      text: "PCA is a linear method: it computes the covariance matrix of your dataset and performs an eigenvalue (or SVD) decomposition to identify the principal components along which the data varies the most. You then select the top two or three components as the axes of your projection. This yields a quick, interpretable overview. However, because PCA is linear, it can flatten non-linear structures or tight local clusters in ways that might obscure meaningful relationships.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dimensionality
    },
    {
      type: "paragraph",
      id: "dim-reduction-p3",
      text: "Non-linear methods like t-SNE (t-distributed Stochastic Neighbor Embedding) and UMAP (Uniform Manifold Approximation and Projection) aim to preserve local neighborhoods more faithfully. They compare high-dimensional distances between points, convert these distances into probabilities, and then find a low-dimensional layout that mirrors those probabilities. The result is often a vivid map of natural clusters—for instance, synonyms might form small, tightly knit islands. While these algorithms can reveal subtle groupings more effectively than PCA, they may distort global distances or require careful tuning of parameters (like perplexity in t-SNE or n_neighbors in UMAP). Still, if you want to see how words group by topic or nuance in a visually clear way, they are invaluable.",
      diagramId: "E2_DimensionalityReduction",
      diagramColor: colors.dimensionality
    },
    
    // Nearest Neighbor Search section
    {
      type: "heading",
      level: 2,
      id: "neighbors-heading",
      text: "Nearest Neighbor Search"
    },
    {
      type: "paragraph",
      id: "neighbors-p1",
      text: "Once your embeddings are in place, a fundamental operation is finding the nearest neighbors of any given vector—essentially searching for items that share similar coordinates. In a small dataset, you can measure the distance between your query vector and every vector in the collection, then rank the results. However, this becomes computationally expensive if you have millions of embeddings. Approximate Nearest Neighbor (ANN) approaches like Annoy, FAISS, or HNSW accelerate searches by building spatial indexes that prune the search space.",
      diagramId: "E2_NearestNeighbor",
      diagramColor: colors.neighbors
    },
    {
      type: "paragraph",
      id: "neighbors-p2",
      text: "In practice, you might embed a query word—like \"budget travel\"—and ask for the top k nearest words. If you see results like \"cheap flights\" and \"hostels,\" that is a good sign your model has learned coherent associations. If you see irrelevant terms, you may need to refine your training or check if your chosen distance metric aligns with your data.",
      diagramId: "E2_NearestNeighbor",
      diagramColor: colors.neighbors
    },
    
    // Distance and Similarity Metrics section
    {
      type: "heading",
      level: 2,
      id: "metrics-heading",
      text: "Distance and Similarity Metrics"
    },
    {
      type: "paragraph",
      id: "metrics-p1",
      text: "Defining \"closeness\" precisely is central to embedding-based methods. Two of the most common metrics are **cosine similarity** and **Euclidean distance**. Cosine similarity treats each vector as an arrow from the origin in high-dimensional space, measuring how closely two arrows align. Formally,\n\n$$\\mathrm{CosSim}(\\mathbf{a}, \\mathbf{b}) = \\frac{\\mathbf{a}\\cdot \\mathbf{b}}{\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|}$$\n\nIf $\\mathbf{a}$ and $\\mathbf{b}$ point in the same direction, their cosine similarity is close to 1; if they are orthogonal, it is 0; and if they point in opposite directions, the similarity becomes negative. Because embeddings for language often emphasize direction over magnitude, cosine similarity frequently works well.",
      diagramId: "E2_DistanceMetrics",
      diagramColor: colors.metrics
    },
    {
      type: "paragraph",
      id: "metrics-p2",
      text: "Euclidean distance is a more general geometric measure:\n\n$$d_{\\mathrm{euclid}}(\\mathbf{a}, \\mathbf{b}) = \\|\\mathbf{a} - \\mathbf{b}\\|_2 = \\sqrt{\\sum_{i}(a_i - b_i)^2}$$\n\nThis distance function treats embeddings as coordinates and measures the straight-line separation. Some systems normalize vectors to unit length, making cosine similarity and Euclidean distance effectively interchangeable up to scaling. Which metric performs better can depend on how your embeddings were trained and whether vector length encodes important information.",
      diagramId: "E2_DistanceMetrics",
      diagramColor: colors.metrics
    },
    
    // Analogization section
    {
      type: "heading",
      level: 2,
      id: "analogies-heading",
      text: "Analogization"
    },
    {
      type: "paragraph",
      id: "analogies-p1",
      text: "A striking property of many embedding spaces is that some relationships emerge as linear transformations. The classic example is:\n\n$$\\text{king} - \\text{man} + \\text{woman} \\approx \\text{queen}$$\n\nAlthough this equation looks almost whimsical, it highlights that certain \"gender\" and \"royalty\" dimensions can be isolated and recombined through simple arithmetic. In practice, you compute the vector for \"king,\" subtract the vector for \"man,\" then add the vector for \"woman.\" The result often lands near \"queen.\" This kind of analogization demonstrates that embeddings frequently encode conceptual offsets—like pluralization, opposites, or even country-capital pairs—in linear directions. Contextual embeddings (such as those from Transformers) complicate this arithmetic by making each token embedding dependent on surrounding text, but the principle remains that differences in vectors can map to meaningful differences in concepts.",
      diagramId: "E2_VectorAnalogies",
      diagramColor: colors.analogies
    },
    
    // Slice and Cross-Sections section
    {
      type: "heading",
      level: 2,
      id: "cross-sections-heading",
      text: "Slice and Cross-Sections"
    },
    {
      type: "paragraph",
      id: "cross-sections-p1",
      text: "Beyond direct arithmetic analogies, you can gain insight by examining midpoints or cross-sections. Given two vectors $\\mathbf{A}$ and $\\mathbf{B}$, you can compute their midpoint,\n\n$$\\mathbf{M} = \\frac{\\mathbf{A} + \\mathbf{B}}{2}$$\n\nand then look for the nearest neighbors to $\\mathbf{M}$. If $\\mathbf{A}$ represents \"budget travel\" and $\\mathbf{B}$ represents \"luxury travel,\" their midpoint might correspond to mid-tier travel options. Similarly, combining embeddings for different music genres could point you to a \"fusion\" zone. This midpoint-based technique sometimes reveals hidden overlaps in semantic space, showing how your embedding model transitions from one concept to another.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.crossSections
    },
    
    // Conclusion
    {
      type: "heading",
      level: 2,
      id: "e2-summary-heading",
      text: "Conclusion"
    },
    {
      type: "paragraph",
      id: "e2-summary-p1",
      text: "Techniques for visualizing and exploring embeddings are essential for interpreting the vast web of numeric relationships learned by modern models. Dimensionality reduction methods like PCA, t-SNE, or UMAP let you see at a glance how words cluster and diverge, nearest neighbor searches allow you to confirm local associations, and mathematically defined metrics like cosine similarity and Euclidean distance anchor these explorations in robust geometry. Vector arithmetic—whether it is subtracting and adding vectors for analogies or finding midpoints—can expose subtler aspects of your training data, hinting at how a model internally represents abstractions like gender, royalty, musical genres, or product categories.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.crossSections
    },
    {
      type: "paragraph",
      id: "e2-summary-p2",
      text: "By diligently applying these techniques, you can debug your embedding space, tune hyperparameters, or simply marvel at the patterns that emerge when language is expressed as coordinates. In the next essay, we will shift from analyzing embeddings locally to the large-scale infrastructure needed to store, query, and harness them in real-world AI applications, covering vector databases, chunking, and retrieval-augmented generation.",
      diagramId: "E2_CrossSections",
      diagramColor: colors.crossSections
    }
  ]
};

export default essay2; 