import colors from './colors';

// Essay 1: Vectors: Meaning in AI Systems
const essay1 = {
  title: "Vectors: Meaning in AI Systems",
  content: [
    {
      type: "paragraph",
      id: "intro-p1",
      text: "One of the key concepts for understanding modern AI systems is what are called **vector embeddings** – mathematical representations of words, images, or other data as points in high-dimensional space. At their heart, vector embeddings store *meaning -* and fascinatingly they do so algorithmically.",
      diagramId: "",
      diagramColor: colors.dictionary
    },
    {
      type: "paragraph",
      id: "intro-p2",
      text: "Here we will dig into what vector embeddings are, look deeping into their technical mechanics and the specific tools in Luminode, and survey real-world applications from vector databases to retrieval-augmented generation (RAG).",
      diagramId: "",
      diagramColor: colors.dictionary
    },
    {
      type: "paragraph",
      id: "intro-p3",
      text: "Glad to have you with us.",
      diagramId: "",
      diagramColor: colors.dictionary
    },
    
    // How Meaning Can Exist in Vector Embeddings section
    {
      type: "heading",
      level: 2,
      id: "meaning-heading",
      text: "1. How Meaning Can Exist in Vector Embeddings"
    },
    {
      type: "paragraph",
      id: "meaning-p1",
      text: "Imagine a simple X–Y coordinate plane. We can represent real-world things as points by assigning meaningful numerical features to each axis. For example, let's say we plot animals by **weight** on the X-axis and **height** on the Y-axis. A giraffe might sit far to the right (very tall) and somewhat right (heavy), while a mouse would be far left (light) and low (short). In this 2D space, similar animals cluster together: mice and rats appear near each other, while giraffes cluster with elephants. In a crude way, the spatial closeness of points reflects conceptual similarity.",
      diagramId: "",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p2",
      text: "Now extend this idea to hundreds or even thousands of dimensions. In **vector embeddings**, each word or concept is a point in a high-dimensional space where each dimension captures some latent feature of meaning. Crucially, *nearby points have similar meanings*. This is grounded in the linguistic principle that *\"a word is characterized by the company it keeps,\"* as J.R. Firth famously quipped in 1957. In practice, words that appear in similar contexts (the \"company\" they keep) end up with vectors that are close together in the embedding space. For example, **\"walk\"** and **\"ran\"** or **\"but\"** and **\"however\"** end up nearby, reflecting their similar usage. Each dimension of the vector doesn't correspond to an obvious human-defined trait, but collectively the coordinates position a word among its peers in meaning.",
      diagramId: "",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p3",
      text: "**Distributed representation** is the term often used for this – the idea that a concept's meaning is distributed across many numerical features rather than one hot symbol. Unlike a dictionary definition or a one-hot code (where, say, \"cat\" might be represented by a single 1 in a long vector of zeros), an embedding spreads the concept of \"cat\" across perhaps 300 dimensions. One dimension might (implicitly) correspond to *animalness*, another to *furriness*, another to *pet-related*, etc., though typically these features are not so cleanly interpretable. What matters is that the **geometry** of the space captures relationships. Distance corresponds to similarity, and directions can correspond to abstract relations.",
      diagramId: "",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p4",
      text: "One powerful demonstration of meaning in vectors is the existence of **analogy relationships** encoded as vector arithmetic. A classic example is the analogy *\"king is to queen as man is to woman.\"* Amazingly, if you subtract the embedding vector for **\"man\"** from **\"king\"**, and then add the vector for **\"woman,\"** you get a result very close to the vector for **\"queen.\"** In other words, **king – man + woman ≈ queen**. This suggests the vector differences are capturing the concept of *royalty* and *gender*. The diagram below illustrates this geometrically as a parallelogram:",
      diagramId: "",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p5",
      text: "*Illustration: In a simplified 2D semantic space, the relationship between \"man\"→\"woman\" is parallel to \"king\"→\"queen.\" Each word is a point in the space, and the consistent vector offset (dashed lines) represents the conceptual analogy of gender and royalty.*",
      diagramId: "",
      diagramColor: colors.meaning
    },
    {
      type: "paragraph",
      id: "meaning-p6",
      text: "Such analogies show that certain directions in the space correspond to meaningful concepts (here, a \"gender\" direction and a \"royalty/status\" direction). More generally, we find that clusters of points represent semantic categories (e.g. **animals**, **colors**, **programming languages** might each form a cluster), and axes or directions can encode latent attributes (e.g. plural–singular, positive–negative sentiment, etc.). The **meaning exists in the embedding** because the training process arranges these vectors so that the geometry (distances and directions) reflects real-world semantic relationships. In summary, by mapping words or other items to a high-dimensional coordinate system, we gain a *\"semantic map\"* where nearness implies similarity and where moving in certain directions corresponds to consistent changes in meaning.",
      diagramId: "",
      diagramColor: colors.meaning
    },
    
    // Summary
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
      diagramId: "",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "summary-p2",
      text: "In practice, these embeddings form the backbone of both language modeling and recommendation systems. Whether it is a chatbot responding accurately to your query or an e-commerce site suggesting a new product, there is likely a high-dimensional vector somewhere under the hood, capturing all the subtle ways one concept relates to another.",
      diagramId: "",
      diagramColor: colors.summary
    },
    {
      type: "paragraph",
      id: "summary-p3",
      text: "In the next essays, we will explore how these embeddings can be visualized and manipulated and how they can be stored and retrieved at scale. By the end, you will see how what begins as a simple numeric representation of \"word meaning\" can evolve into a full ecosystem of methods—enabling everything from semantic search to retrieval-augmented generation.",
      diagramId: "",
      diagramColor: colors.summary
    }
  ]
};

export default essay1; 