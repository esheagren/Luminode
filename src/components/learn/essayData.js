// Essay data structure with paragraph-to-diagram mappings
// This allows fine-grained control over which diagram is shown for each part of the essay

// Colors for different diagram sections - increase opacity for better readability
const colors = {
  dictionary: 'rgba(153, 102, 255, 0.6)', // Purple - darker for better visibility
  vector: 'rgba(47, 105, 45, 0.65)',      // Forest green - darker, richer green
  meaning: 'rgba(83, 123, 196, 0.6)',     // Blue - darker for better visibility
  contextual: 'rgba(153, 28, 151, 0.65)', // Light blue - darker for better visibility
  algorithms: 'rgba(255, 142, 83, 0.6)',  // Orange - darker for better visibility
  applications: 'rgba(76, 205, 196, 0.6)', // Teal - darker for better visibility
  summary: 'rgba(255, 165, 0, 0.6)',       // Gold - darker for better visibility
  
  // Essay 2 colors
  dimensionality: 'rgba(160, 91, 210, 0.6)',    // Purple
  neighbors: 'rgba(56, 132, 222, 0.6)',         // Blue
  metrics: 'rgba(92, 179, 99, 0.6)',            // Green
  analogies: 'rgba(240, 110, 90, 0.6)',         // Coral
  crossSections: 'rgba(66, 186, 192, 0.6)',     // Teal
  
  // Essay 3 colors
  vectorDBs: 'rgba(145, 70, 255, 0.6)',        // Purple
  chunking: 'rgba(60, 145, 230, 0.6)',         // Blue
  rag: 'rgba(255, 110, 65, 0.6)',              // Orange
  ecosystem: 'rgba(75, 200, 170, 0.6)'         // Teal-Green
};

// Section order for essay 1 - defines the paragraph ordering for highlighting
// These constants must match the ones in ScrollContext.jsx
export const SECTION_ORDER = {
  'intro': 0,       // Introduction section - paragraphs 1, 2
  'vector': 100,    // What is a Vector - paragraphs 1-6
  'meaning': 200,   // Why Vectors Reflect Meaning - paragraphs 1-4
  'contextual': 300, // Contextual Embeddings - paragraphs 1-6
  'algorithms': 400, // Embedding Algorithms - paragraphs 1-9
  'applications': 500, // Applications - paragraphs 1-8
  'summary': 600,     // Summary - paragraphs 1-3
  
  // Section ordering for Essay 2
  'e2-intro': 0,        // Introduction section
  'dim-reduction': 100, // Dimensionality Reduction section
  'neighbors': 200,     // Nearest Neighbor Search section
  'metrics': 300,       // Distance and Similarity Metrics section
  'analogies': 400,     // Analogization section
  'cross-sections': 500, // Slice and Cross-Sections section
  'e2-summary': 600,     // Conclusion section
  
  // Section ordering for Essay 3
  'e3-intro': 0,           // Introduction section
  'vector-dbs': 100,       // Vector Databases section
  'chunking': 200,         // Chunking section
  'rag': 300,              // RAG section
  'considerations': 400,   // Practical Considerations section
  'e3-summary': 500        // Summary section
};

export const essay1 = {
  title: "Vectors: Meaning in AI Systems",
  content: [
    {
        type: "paragraph",
        id: "intro-p1",
        text: "In modern AI systems, language and meaning are represented mathematically. This on its own is an astonishing fact that deserves study. And for those who wish to understand AI, understanding the mechanics of how meaning can arise at all from raw data is a critical concentual brick that must be laid if sturdy understanding is to be developed later. My hope is this essay and interative tool aids in that endeavor.",
        diagramId: "E1_DictionaryVsAssociation",
        diagramColor: colors.dictionary
      },
    {
      type: "paragraph",
      id: "intro-p1.5",
      text: "When we first learn new words, dictionaries often guide us with neat definitions: \"cat\" is a small, carnivorous mammal, \"house\" is a dwelling where people live, and so on. Yet in actual human communication, words are rarely locked into these one-line definitions. Instead, they come alive through the contexts and connotations they share with other words. If you think about what \"travel\" means in an everyday sense, you might imagine suitcases, tickets, airports—or maybe scenic highways, train stations, and different currencies. All these associations form a dense web of meaning that the word \"travel\" can evoke.",
      diagramId: "E1_DictionaryVsAssociation",
      diagramColor: colors.dictionary
    },
    {
      type: "paragraph",
      id: "intro-p2",
      text: "Modern AI capitalizes on this association-rich view of language by using *vectors*—high-dimensional numeric representations that position words (or documents, images, user profiles, etc.) in a shared \"semantic space.\" When two items are close to each other in that space, it implies they often appear in similar contexts or share similar connotations. That might sound abstract at first, but this vector-based approach underpins a lot of the technologies we now take for granted, from recommendation engines to advanced question-answering systems, and they're simpler than you might think. Here, we will see *why* these embeddings work so well and *how* they are built, setting the stage for deeper explorations later on.",
      diagramId: "E1_DictionaryVsAssociation",
      diagramColor: colors.dictionary
    },
    // What is a Vector section
    {
      type: "heading",
      level: 2,
      id: "vector-heading",
      text: "What is a Vector?"
    },
    {
      type: "paragraph",
      id: "vector-p1",
      text: "Before diving deeper, let's clarify what we mean by \"vector.\" In its simplest form, a vector is just a list of numbers that represents a position in space. If you recall basic coordinate geometry, a point on a two-dimensional plane has an X and Y coordinate, like (3, 4). This is essentially a 2-dimensional vector.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    {
      type: "paragraph",
      id: "vector-p2",
      text: "We can visualize these easily: the X-axis might represent one property and the Y-axis another. For example, if we were looking at articles of clothing, the X-axis could represent \"formality\" while the Y-axis represents \"warmth.\" A winter coat might be at (2, 9)—not very formal, but extremely warm—while a business suit could be at (8, 5)—quite formal and moderately warm.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    {
      type: "paragraph",
      id: "vector-p3",
      text: "But we're not limited to just two dimensions. We can add a third dimension, creating a 3D space (X, Y, Z). Consider adding \"cost\" as our Z-axis: our winter coat might now be at (2, 9, 7)—informal, warm, and somewhat expensive—while the business suit sits at (8, 5, 9)—formal, moderately warm, and very expensive.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    {
      type: "paragraph",
      id: "vector-p4",
      text: "The power of vectors comes when we extend beyond the three dimensions we can easily visualize. Language models typically use hundreds or even thousands of dimensions to capture the subtle nuances of meaning. Each dimension represents some learned aspect or feature of the data, though these dimensions often don't have straightforward human interpretations.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    {
      type: "paragraph",
      id: "vector-p5",
      text: "For example, a vector representing the word \"king\" might have values across 300 dimensions. Some dimensions might capture aspects of royalty, others masculinity, others leadership, and so on. These higher-dimensional vectors are essentially coordinates in a vast \"semantic hyperspace\" where similar concepts cluster together.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    
    // Why Vectors Reflect Meaning section
    {
      type: "heading",
      level: 2,
      id: "meaning-heading",
      text: "Why Vectors Reflect Meaning"
    },
    {
      type: "paragraph",
      id: "meaning-p1",
      text: "When we talk about a \"word embedding,\" we're referring to this vector representation of a word. The term \"embedding\" comes from the mathematical concept of embedding one space within another—in this case, embedding words from language into a continuous vector space where mathematical operations become possible.",
      diagramId: "E1_VectorDimensions",
      diagramColor: colors.vector
    },
    {
      type: "paragraph",
      id: "meaning-p1",
      text: "A central premise of vector embeddings is that **distance corresponds to difference**. When we embed words as points in a high-dimensional space, words that often occupy similar contexts end up clustered near each other. For example, \"food\" and \"meal\" may appear in similar contexts—sentences about eating, restaurants, or cooking. An embedding algorithm will notice that these words co-occur with overlapping sets of neighbors (\"eat,\" \"dinner,\" \"restaurant,\" \"plate\") and consequently place their coordinates close together.",
      diagramId: "E1_SemanticSpace",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p2",
      text: "This numeric closeness not only reveals *synonym-like* relationships but also more subtle ties—words that share a domain or register (e.g., \"budget travel,\" \"cheap flights,\" and \"backpacking\" might huddle together). AI systems can use these tight-knit neighborhoods to approximate real-world meaning. If a new sentence references \"budget travel,\" the system can confidently infer that \"cheap flights\" or \"inexpensive lodging\" might be relevant because they lie in a similar region of the embedding space.",
      diagramId: "E1_SemanticSpace",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p3",
      text: "Traditional methods of storing word meaning—like a dictionary—assume there is a fixed, static definition. By contrast, embeddings treat meaning as *relational*: if two concepts appear in similar contexts, they must be related. This approach naturally captures shifts in how words are used. Consider the word \"stream\": a sentence about \"streaming video\" is very different from one about \"a clear mountain stream.\" In a vector space, these different usages can be teased apart if the model is context-aware (as we will see with modern Transformer architectures).",
      diagramId: "E1_SemanticSpace",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p4",
      text: "By encoding meaning in numbers, we also gain a powerful benefit: mathematics. Distances and angles in that high-dimensional space become *metrics* of semantic similarity or difference, letting the machine quantify how alike two pieces of data are. It is surprisingly elegant: the same geometry that we learn in high school—points, vectors, angles—becomes a roadmap for capturing the messy fluidity of language.",
      diagramId: "E1_SemanticSpace",
      diagramColor: colors.meaning
    },
    // Contextual Embeddings section
    {
      type: "heading",
      level: 2,
      id: "contextual-heading",
      text: "Contextual Embeddings and Polysemy"
    },
    {
      type: "paragraph",
      id: "contextual-p1",
      text: "One of the most significant challenges in language understanding is **polysemy** – the capacity for a single word to carry multiple meanings. Consider the word \"bank\": it can refer to a financial institution, the side of a river, or even the action of tilting an aircraft. Earlier embedding models represented each word with a single fixed vector, essentially averaging all possible meanings together. This creates a significant limitation: the word \"bank\" would be positioned somewhere between the financial and geographical senses, accurately representing neither.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "contextual-p2",
      text: "A related problem occurs with homonyms – entirely different words that happen to be spelled or pronounced the same way. Think of \"bass\" (a type of fish) versus \"bass\" (a low musical tone). In static embeddings, these distinct concepts get merged into a single point in semantic space, blurring their real meanings.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "contextual-p3",
      text: "To address this limitation, modern embedding approaches have introduced **contextual embeddings**. Instead of assigning a fixed vector to each word, these systems generate dynamic embeddings that change based on the surrounding context. When you use \"stream\" in \"I'll stream the movie tonight,\" the embedding tilts toward digital media concepts. Use the same word in \"We sat by the mountain stream,\" and the embedding shifts to align with nature and water-related terms.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "contextual-p4",
      text: "This context-sensitivity represents a fundamental advance in natural language processing. By allowing words to have different vector representations depending on usage, models can: distinguish between multiple senses of the same word, capture nuanced shifts in meaning based on context, understand idioms and metaphorical expressions, and adapt to domain-specific terminology.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "contextual-p5",
      text: "The ability to disambiguate word senses is critical for downstream tasks like machine translation, where translating \"bank\" correctly depends entirely on understanding which sense is intended. Similarly, for search engines, distinguishing between a user looking for banking services versus river ecology information dramatically improves result relevance.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    {
      type: "paragraph",
      id: "contextual-p6",
      text: "What makes contextual embeddings so powerful is their ability to represent the fluid, shifting nature of language without losing the mathematical properties that make vector spaces useful. The word \"light\" might appear in contexts ranging from physics discussions about photons to descriptions of weight (\"a light backpack\") to metaphors about enlightenment. Each usage creates a different vector, but these vectors occupy meaningful positions relative to other concepts in the semantic space.",
      diagramId: "E1_VectorsMeaning",
      diagramColor: colors.contextual
    },
    // Embedding Algorithms section
    {
      type: "heading",
      level: 2,
      id: "algorithms-heading",
      text: "Quick Survey of Embedding Algorithms"
    },
    {
      type: "paragraph",
      id: "algorithms-p1",
      text: "So how do these embeddings actually get built? Over the last decade, several milestone algorithms have paved the way.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p2",
      text: "**Word2Vec**, introduced by a team at Google, was one of the first major breakthroughs in modern embedding techniques. It uses relatively simple neural-network architectures (the \"skip-gram\" or \"CBOW\" models) to learn word vectors by predicting neighboring words. If \"budget\" and \"travel\" frequently show up together, Word2Vec will nudge their embeddings closer. Training on a large corpus—think billions of words—Word2Vec begins to discover that \"king\" and \"queen\" share certain dimensions of meaning related to royalty, while \"run\" and \"walk\" might cluster along a different dimension of movement.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p3",
      text: "**GloVe**, short for Global Vectors, emerged from Stanford, proposing a slightly different method that emphasizes *global* word co-occurrence counts. Instead of scanning text window by window like Word2Vec, GloVe looks at aggregate statistics of how often words appear together across an entire dataset. The resulting vectors similarly place frequently co-occurring words in nearby coordinates. GloVe is famed for capturing many of the same linear relationships that Word2Vec does, such as the famous \"king – man + woman = queen\" vector arithmetic.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p4",
      text: "Both Word2Vec and GloVe create a *single, static* embedding per word. That means \"bank\" has the same coordinates whether you are talking about a financial institution or a riverbank. While this limitation might seem glaring, these early methods were revolutionary in proving how much semantic structure could be learned from raw co-occurrences.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p5",
      text: "Today, **Transformer-based architectures** (like BERT, GPT, and LLaMa) represent the state of the art. They produce *contextual* embeddings, which means that each *instance* of a word gets its own vector representation based on the surrounding sentence or paragraph. For example, \"bank\" in \"The boat drifted to the river bank\" will yield a different embedding than \"I deposited money at the bank.\"",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p6",
      text: "**BERT** (Bidirectional Encoder Representations from Transformers) introduced the idea of \"masked language modeling.\" It randomly hides words in a sentence and trains the network to guess them. By doing so, BERT's internal layers learn how each token relates to every other token, refining embeddings to be context-sensitive.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p7",
      text: "**GPT** (Generative Pre-trained Transformer) takes a generative approach, predicting the next token in a sequence. While it is known for text generation, GPT still relies on learned embeddings that represent each token as it processes context from left to right.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p8",
      text: "**LLaMa**, an open-source family of models originally from Meta, uses similar Transformer mechanisms under the hood but may be trained on different data or with specific architectural choices. This variety reflects how flexible and customizable Transformer embeddings can be.",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    {
      type: "paragraph",
      id: "algorithms-p9",
      text: "Because these models ingest massive corpora—web pages, books, academic articles—they pick up rich, nuanced patterns, making them highly effective at tasks like text classification, summarization, question-answering, and more. Even though the details of each Transformer variant differ, the fundamental principle remains: *words that appear in similar contexts end up with similar vectors.*",
      diagramId: "E1_Algorithms",
      diagramColor: colors.algorithms
    },
    // Applications section
    {
      type: "heading",
      level: 2,
      id: "applications-heading",
      text: "Practical Applications of Embeddings"
    },
    {
      type: "paragraph",
      id: "applications-p1",
      text: "Embeddings are the raw currency that large language models (LLMs) trade in. When you type a question, the model encodes your text into vectors, checks how these vectors align with its internal representation of language, and then computes a response. This vector-based approach handles:",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p2",
      text: "**Synonym recognition**: Even if the user's wording is different from the training data, a model can latch onto the underlying similarity because the embeddings line up.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p3",
      text: "**Contextual disambiguation**: LLMs can interpret \"stream\" in the sense of \"live-streaming\" or \"river stream\" because each usage yields different embeddings that factor in local context.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p4",
      text: "Ultimately, embeddings allow LLMs to \"understand\" language in a mathematically tractable way. The output might be a human-readable sentence, but behind the curtain, the text is represented as coordinate points shifting through a high-dimensional space.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p5",
      text: "Another powerful use of embeddings lies in **recommendation systems**. Here, not only do words get turned into vectors, but also users, products, movies, or any item that you want to recommend. By comparing a user's embedding (derived from their past behavior or explicit ratings) to an item's embedding (derived from user-item interactions or textual descriptions), a system can rank potential matches by their \"distance\" in the embedding space.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p6",
      text: "**E-commerce**: If your purchase history places you deep in the \"casual footwear\" region of the vector space, the algorithm may suggest related sneakers or sandals that share many of the same dimensions.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p7",
      text: "**Streaming services**: You watch a show about cooking adventures in Italy; your \"user vector\" shifts closer to travel and culinary programming. Next time, it recommends a series featuring street food in Asia.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    {
      type: "paragraph",
      id: "applications-p8",
      text: "Because these embeddings compress a lot of relevant signals (keywords, user ratings, co-occurrence patterns) into a numeric form, they make large-scale recommendation engines both faster and more capable of discovering hidden relationships that might be too subtle for simpler rule-based systems.",
      diagramId: "E1_Applications",
      diagramColor: colors.applications
    },
    // Summary section
    {
      type: "heading",
      level: 2,
      id: "summary-heading",
      text: "Summary"
    },
    {
      type: "paragraph",
      id: "summary-p1",
      text: "Vector embeddings have ushered in a new era of AI by revealing the *relational* fabric behind words, documents, products, and more. Rather than relying on rigid definitions, embedding-based methods measure how items behave across vast corpora or user interactions, letting semantic proximity emerge as a numeric property. Foundational methods like Word2Vec and GloVe demonstrated the power of co-occurrence-based embeddings, while Transformer architectures such as BERT, GPT, and LLaMa have taken the idea further by allowing each token to adapt its embedding to the local context.",
      diagramId: "E1_Summary",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "summary-p2",
      text: "In practice, these embeddings form the backbone of both language modeling and recommendation systems. Whether it is a chatbot responding accurately to your query or an e-commerce site suggesting a new product, there is likely a high-dimensional vector somewhere under the hood, capturing all the subtle ways one concept relates to another.",
      diagramId: "E1_Summary",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "summary-p3",
      text: "In the next essays, we will explore how these embeddings can be visualized and manipulated and how they can be stored and retrieved at scale. By the end, you will see how what begins as a simple numeric representation of \"word meaning\" can evolve into a full ecosystem of methods—enabling everything from semantic search to retrieval-augmented generation.",
      diagramId: "E1_Summary",
      diagramColor: colors.summary
    }
  ]
};

// Essay 2: Exploring and Visualizing Vector Embeddings
export const essay2 = {
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

// Export available essays
export const availableEssays = [
  "Vectors: Meaning in AI Systems",
  "Exploring and Visualizing Vector Embeddings",
  "Vector Databases and Large-Scale Retrieval"
];

// Essay 3: Vector Databases and Large-Scale Retrieval
export const essay3 = {
  title: "Vector Databases and Large-Scale Retrieval",
  content: [
    // Introduction
    {
      type: "paragraph",
      id: "e3-intro-p1",
      text: "Vector embeddings become particularly powerful when they are not merely artifacts of an offline model but are *deployed* for real-time retrieval tasks. Whether you are building a semantic search engine, a recommendation system, or a Retrieval-Augmented Generation (RAG) pipeline for large language models, you need infrastructure capable of storing millions—or even billions—of high-dimensional vectors and answering similarity queries in milliseconds. This is precisely the role of **vector databases**. They provide specialized indexing structures and query mechanisms optimized for the geometry of embeddings. Alongside these databases, techniques such as *chunking* help handle large documents, while RAG workflows ensure that language models stay grounded in accurate, up-to-date information.",
      diagramId: "E3_VectorDatabases",
      diagramColor: colors.vectorDBs
    },
    
    // Vector Databases section
    {
      type: "heading",
      level: 2,
      id: "vector-dbs-heading",
      text: "The Rise of Vector Databases"
    },
    {
      type: "paragraph",
      id: "vector-dbs-p1",
      text: "Traditional relational databases excel at searching for exact matches or applying structured filters (e.g., \"give me all records where `price < 100`\"). They do not, however, handle queries like \"find the items whose vectors lie close to this new vector\" particularly well. Similarity search over large datasets is different from the usual SQL-based operations; it demands specialized data structures that can prune the search space quickly.",
      diagramId: "E3_VectorDatabases",
      diagramColor: colors.vectorDBs
    },
    {
      type: "paragraph",
      id: "vector-dbs-p2",
      text: "A **vector database** is designed around this very need: you embed items—whether text snippets, images, or user profiles—into high-dimensional vectors, store them, and later retrieve the closest vectors to a given query vector. The key is to keep retrieval times low, even if the dataset spans millions of items.",
      diagramId: "E3_VectorDatabases",
      diagramColor: colors.vectorDBs
    },
    {
      type: "paragraph",
      id: "vector-dbs-p3",
      text: "Common underlying techniques include approximate nearest neighbor (ANN) search, where the database builds indexes (such as HNSW graphs or inverted file systems) to reduce the search complexity. Rather than comparing a query vector to *every* item, the index routes the search to a subset of likely candidates. This can bring query times down to a fraction of a second, even for large collections. The trade-off is that you might miss a few exact neighbors, though well-tuned ANN algorithms often yield results that are nearly perfect, with a much faster response.",
      diagramId: "E3_VectorDatabases",
      diagramColor: colors.vectorDBs
    },
    {
      type: "paragraph",
      id: "vector-dbs-p4",
      text: "Today, there are multiple implementations. Open-source projects like **Milvus**, **Weaviate**, and **FAISS** let you self-host vector databases, while cloud-based platforms such as **Pinecone** or **Chroma** manage the heavy lifting for you. In either case, you can issue a query embedding, specify how many neighbors you want, and receive a ranked list of the most similar items—often accompanied by their cosine similarities or distance scores.",
      diagramId: "E3_VectorDatabases",
      diagramColor: colors.vectorDBs
    },
    
    // Chunking section
    {
      type: "heading",
      level: 2,
      id: "chunking-heading",
      text: "Chunking and Document Management"
    },
    {
      type: "paragraph",
      id: "chunking-p1",
      text: "Large documents, such as technical manuals or entire books, pose a challenge for embedding-based systems. If you embed them as single vectors, you lose granularity; the entire text collapses to a single representation. Conversely, you could embed each sentence separately, but then you might end up with a massive number of vectors, each capturing only a tiny snippet of context.",
      diagramId: "E3_DocumentChunking",
      diagramColor: colors.chunking
    },
    {
      type: "paragraph",
      id: "chunking-p2",
      text: "A common strategy is **chunking**: you split the text into segments (or \"chunks\") of a manageable size, each chunk receiving its own embedding. This balances granularity and relevance. For instance, if you chunk a large PDF into 500-word blocks, each block can stand alone as a cohesive section but remains small enough that a semantic query can pinpoint relevant paragraphs accurately.",
      diagramId: "E3_DocumentChunking",
      diagramColor: colors.chunking
    },
    {
      type: "paragraph",
      id: "chunking-p3",
      text: "In a vector database, each chunk is stored with metadata such as its parent document, the chunk's position, or a timestamp. When a user's query arrives—say, \"How do I calibrate the camera in this robotics manual?\"—the system transforms that query into a vector and finds the chunks that lie closest in embedding space. By retrieving just the top few chunks, you dramatically reduce the text you need to process further. This is crucial not only for direct retrieval but also for feeding the relevant text into large language models for more advanced tasks.",
      diagramId: "E3_DocumentChunking",
      diagramColor: colors.chunking
    },
    
    // RAG section
    {
      type: "heading",
      level: 2,
      id: "rag-heading",
      text: "Retrieval-Augmented Generation (RAG)"
    },
    {
      type: "paragraph",
      id: "rag-p1",
      text: "Large language models (LLMs) like GPT or LLaMa are trained on vast amounts of text. Yet they can still produce \"hallucinations,\" especially about niche or recent topics not well covered in their training data. **Retrieval-Augmented Generation (RAG)** tackles this limitation by bridging an LLM with an external knowledge store—often a vector database.",
      diagramId: "E3_RAG",
      diagramColor: colors.rag
    },
    {
      type: "paragraph",
      id: "rag-p2",
      text: "The process typically works as follows:\n\n1. **User Query**: A user asks a question, such as \"What are the top three ways to reduce motion blur in low-light photography?\"\n2. **Query Embedding**: A smaller model or an embedding layer transforms this text into a query vector.\n3. **Vector Database Search**: The system searches its database for the closest matching chunks—perhaps from a photography manual, blog posts about camera settings, or relevant Q&A threads.\n4. **Contextual Retrieval**: The top chunks are retrieved and fed back to the language model as context.\n5. **LLM Response**: Equipped with relevant external data, the LLM composes a more accurate, context-aware answer. This final output is then returned to the user.",
      diagramId: "E3_RAG",
      diagramColor: colors.rag
    },
    {
      type: "paragraph",
      id: "rag-p3",
      text: "By bundling the retrieved chunks alongside the user's query, RAG frameworks enable the model to ground its responses in factual information. Rather than relying solely on the LLM's potentially incomplete internal knowledge, the model is nudged to consult external sources. This can mitigate hallucination and also allows for dynamic updating: if your vector database is refreshed regularly, the system can access the latest facts without retraining the LLM.",
      diagramId: "E3_RAG",
      diagramColor: colors.rag
    },
    
    // Practical Considerations section
    {
      type: "heading",
      level: 2,
      id: "considerations-heading",
      text: "Practical Considerations for RAG and Vector Databases"
    },
    {
      type: "paragraph",
      id: "considerations-p1",
      text: "**Index Efficiency**: Storing millions of vectors is not trivial. You need to decide on an indexing method that fits your latency requirements and hardware constraints. Some indexes (like HNSW graphs) can use considerable memory but are extremely fast at search time. Others (like IVF-PQ structures) compress the vectors to reduce storage, trading off some accuracy.",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    },
    {
      type: "paragraph",
      id: "considerations-p2",
      text: "**Filtering and Hybrid Queries**: Beyond pure similarity search, real-world systems often need to filter by date, category, or other metadata. Some vector databases support \"hybrid search,\" letting you combine a similarity score with structured filters (e.g., retrieve only \"how-to guides\" from 2023 that are near the query in embedding space).",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    },
    {
      type: "paragraph",
      id: "considerations-p3",
      text: "**Chunk Sizing**: When chunking documents, the size of each chunk significantly affects precision and recall. Too large, and a chunk might contain multiple topics, diluting the embedding. Too small, and the system might need to retrieve many disjoint snippets, which can complicate reassembly of context. Balanced chunking is often a matter of experimentation, domain knowledge, and user testing.",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    },
    {
      type: "paragraph",
      id: "considerations-p4",
      text: "**Updating Embeddings**: Over time, new documents or product listings may appear, or existing items may need updating. This requires not only embedding generation for the new or changed content but also an index rebuild or insertion. Modern vector databases streamline these operations so that incremental updates can happen without a full re-index.",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    },
    
    // Summary section
    {
      type: "heading",
      level: 2,
      id: "e3-summary-heading",
      text: "Summary"
    },
    {
      type: "paragraph",
      id: "e3-summary-p1",
      text: "Vector embeddings do not live in isolation. To unlock their full potential—fast semantic queries, accurate question-answering, and robust recommendations—you need a backend capable of storing and serving them efficiently. Vector databases fill this role, optimizing for high-dimensional proximity operations at scale. By pairing these databases with chunking strategies, you can store vast amounts of text (or other data) at a fine enough resolution to retrieve precisely what users need. Finally, Retrieval-Augmented Generation pipelines close the loop: they marry the context in a vector database with the generative skills of large language models, producing answers that are both fluent and grounded in real information.",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    },
    {
      type: "paragraph",
      id: "e3-summary-p2",
      text: "As AI systems become more capable, the interplay between embeddings, vector databases, and LLMs will grow even more central. Already, these building blocks power cutting-edge search engines, chatbots that cite specific sources, and recommender platforms that feel uncannily perceptive about user tastes. Whether you are dealing with text, images, or multimodal data, the strategy remains the same: translate content into embeddings, store and query them intelligently, and let retrieval-augmented models bridge the gap between raw data and actionable intelligence.",
      diagramId: "E3_VectorEcosystem",
      diagramColor: colors.ecosystem
    }
  ]
}; 