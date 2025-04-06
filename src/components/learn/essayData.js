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
  summary: 'rgba(255, 165, 0, 0.6)'       // Gold - darker for better visibility
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
  'summary': 600     // Summary - paragraphs 1-3
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
    {
      type: "paragraph",
      id: "vector-p6",
      text: "When we talk about a \"word embedding,\" we're referring to this vector representation of a word. The term \"embedding\" comes from the mathematical concept of embedding one space within another—in this case, embedding words from language into a continuous vector space where mathematical operations become possible.",
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

// Export available essays
export const availableEssays = [
  "Vectors: Meaning in AI Systems",
  "Exploring and Visualizing Vector Embeddings",
  "Vector Databases and Large-Scale Retrieval"
]; 