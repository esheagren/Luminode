// Array of 200 words for the suggested words section, organized by categories
const suggestedWords = [
  // Animals
  "cat", "dog", "lion", "tiger", "elephant", "giraffe", "zebra", "penguin", "dolphin", "whale",
  "bear", "wolf", "fox", "deer", "rabbit", "horse", "monkey", "eagle", "owl", "snake",
  
  // Nature
  "tree", "flower", "river", "ocean", "mountain", "forest", "beach", "desert", "sky", "sun",
  "moon", "star", "cloud", "rain", "snow", "wind", "leaf", "grass", "garden", "lake",
  
  // Emotions & Feelings
  "happy", "sad", "angry", "excited", "calm", "peaceful", "anxious", "love", "hate", "fear",
  "joy", "hope", "worry", "pride", "shame", "guilt", "envy", "trust", "doubt", "courage",
  
  // Actions & Activities
  "run", "walk", "jump", "swim", "fly", "dance", "sing", "play", "work", "study",
  "read", "write", "sleep", "eat", "drink", "laugh", "cry", "think", "speak", "listen",
  
  // Objects & Items
  "book", "phone", "computer", "chair", "table", "bed", "door", "window", "clock", "lamp",
  "car", "bike", "train", "plane", "boat", "key", "bag", "pen", "paper", "mirror",
  
  // Places & Locations
  "house", "home", "school", "office", "store", "park", "city", "town", "country", "street",
  "building", "hospital", "library", "museum", "restaurant", "airport", "station", "market", "garden", "theater",
  
  // Time & Concepts
  "time", "day", "night", "morning", "evening", "today", "tomorrow", "yesterday", "week", "month",
  "year", "future", "past", "present", "moment", "forever", "never", "always", "soon", "late",
  
  // People & Relationships
  "friend", "family", "mother", "father", "sister", "brother", "child", "baby", "teacher", "student",
  "doctor", "neighbor", "partner", "colleague", "stranger", "leader", "hero", "enemy", "guest", "host",
  
  // Abstract Concepts
  "truth", "beauty", "wisdom", "knowledge", "power", "freedom", "peace", "justice", "faith", "destiny",
  "dream", "idea", "thought", "memory", "spirit", "soul", "mind", "life", "death", "change",
  
  // Elements & Materials
  "water", "fire", "earth", "air", "metal", "wood", "stone", "glass", "plastic", "paper",
  "gold", "silver", "iron", "steel", "copper", "oil", "gas", "ice", "steam", "smoke",
  
  // Food & Drink
  "food", "bread", "rice", "meat", "fish", "fruit", "apple", "orange", "banana", "vegetable",
  "water", "milk", "coffee", "tea", "juice", "wine", "cake", "sugar", "salt", "honey",
  
  // Arts & Entertainment
  "music", "art", "dance", "movie", "book", "game", "sport", "story", "picture", "song",
  "poetry", "painting", "theater", "concert", "festival", "show", "party", "fun", "play", "adventure"
];

/**
 * Get random words from the suggested words list
 * @param {number} count - Number of words to return
 * @param {string[]} excludeWords - Words to exclude from results
 * @returns {string[]} - Array of random words
 */
export const getRandomSuggestions = (count = 8, excludeWords = []) => {
  // Create a copy of the array and filter out excluded words
  const availableWords = suggestedWords.filter(word => !excludeWords.includes(word));
  
  // If we need more words than available, just return all available words
  if (count >= availableWords.length) {
    return [...availableWords];
  }
  
  // Shuffle array and take first 'count' elements
  return [...availableWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

export default suggestedWords; 