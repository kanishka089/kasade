// 12 Rashis
export const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrischika",
  "Dhanus",
  "Makara",
  "Kumbha",
  "Meena",
];

// 27 Nakshatras
export const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

// Nakshatra lords (Vimshottari Dasha sequence)
export const NAKSHATRA_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

// Rashi lords
export const RASHI_LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

// Varna for each Rashi: Brahmana(3), Kshatriya(2), Vaishya(1), Shudra(0)
export const RASHI_VARNA = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3];

// Vashya categories for each Rashi
export const RASHI_VASHYA = [
  "Chatushpada",
  "Chatushpada",
  "Manava",
  "Jalachara",
  "Vanachara",
  "Manava",
  "Manava",
  "Keeta",
  "Manava",
  "Chatushpada",
  "Manava",
  "Jalachara",
];

// Yoni animal for each Nakshatra (and gender M/F)
export const NAKSHATRA_YONI: [string, "M" | "F"][] = [
  ["Horse", "M"],
  ["Elephant", "M"],
  ["Sheep", "F"],
  ["Serpent", "M"],
  ["Serpent", "F"],
  ["Dog", "F"],
  ["Cat", "F"],
  ["Sheep", "M"],
  ["Cat", "M"],
  ["Rat", "M"],
  ["Rat", "F"],
  ["Cow", "M"],
  ["Buffalo", "F"],
  ["Tiger", "F"],
  ["Buffalo", "M"],
  ["Tiger", "M"],
  ["Deer", "F"],
  ["Deer", "M"],
  ["Dog", "M"],
  ["Monkey", "M"],
  ["Mongoose", "M"],
  ["Monkey", "F"],
  ["Lion", "F"],
  ["Horse", "F"],
  ["Lion", "M"],
  ["Cow", "F"],
  ["Elephant", "F"],
];

// Gana for each Nakshatra: Deva(0), Manushya(1), Rakshasa(2)
export const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2,
  1, 1, 0,
];

// Nadi for each Nakshatra: Aadi(0), Madhya(1), Antya(2)
export const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0,
  0, 1, 2,
];

// Planetary friendship table for Graha Maitri
export const PLANETARY_FRIENDSHIP: Record<
  string,
  Record<string, "F" | "N" | "E">
> = {
  Sun: {
    Moon: "F",
    Mars: "F",
    Mercury: "N",
    Jupiter: "F",
    Venus: "E",
    Saturn: "E",
    Rahu: "E",
    Ketu: "E",
  },
  Moon: {
    Sun: "F",
    Mars: "N",
    Mercury: "F",
    Jupiter: "F",
    Venus: "N",
    Saturn: "N",
    Rahu: "N",
    Ketu: "N",
  },
  Mars: {
    Sun: "F",
    Moon: "F",
    Mercury: "N",
    Jupiter: "F",
    Venus: "N",
    Saturn: "N",
    Rahu: "N",
    Ketu: "N",
  },
  Mercury: {
    Sun: "F",
    Moon: "N",
    Mars: "N",
    Jupiter: "N",
    Venus: "F",
    Saturn: "N",
    Rahu: "N",
    Ketu: "N",
  },
  Jupiter: {
    Sun: "F",
    Moon: "F",
    Mars: "F",
    Mercury: "E",
    Venus: "E",
    Saturn: "N",
    Rahu: "N",
    Ketu: "N",
  },
  Venus: {
    Sun: "E",
    Moon: "N",
    Mars: "N",
    Mercury: "F",
    Jupiter: "N",
    Saturn: "F",
    Rahu: "N",
    Ketu: "N",
  },
  Saturn: {
    Sun: "E",
    Moon: "E",
    Mars: "N",
    Mercury: "F",
    Jupiter: "N",
    Venus: "F",
    Rahu: "F",
    Ketu: "F",
  },
  Rahu: {
    Sun: "E",
    Moon: "N",
    Mars: "N",
    Mercury: "F",
    Jupiter: "N",
    Venus: "F",
    Saturn: "F",
    Ketu: "N",
  },
  Ketu: {
    Sun: "E",
    Moon: "N",
    Mars: "F",
    Mercury: "N",
    Jupiter: "N",
    Venus: "N",
    Saturn: "F",
    Rahu: "N",
  },
};

// Yoni animals list (index used in compatibility matrix)
export const YONI_ANIMALS = [
  "Horse",
  "Elephant",
  "Sheep",
  "Serpent",
  "Dog",
  "Cat",
  "Rat",
  "Cow",
  "Buffalo",
  "Tiger",
  "Deer",
  "Monkey",
  "Mongoose",
  "Lion",
];

// Full 14x14 yoni compatibility matrix
export const YONI_COMPATIBILITY: number[][] = [
  [4, 2, 2, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1], // Horse
  [2, 4, 3, 2, 2, 2, 2, 2, 1, 0, 1, 2, 1, 0], // Elephant
  [2, 3, 4, 2, 1, 2, 1, 2, 2, 1, 2, 2, 0, 1], // Sheep
  [0, 2, 2, 4, 2, 1, 1, 1, 1, 2, 1, 0, 0, 2], // Serpent
  [2, 2, 1, 2, 4, 1, 2, 2, 2, 1, 0, 2, 1, 1], // Dog
  [2, 2, 2, 1, 1, 4, 0, 2, 2, 1, 2, 2, 1, 1], // Cat
  [2, 2, 1, 1, 2, 0, 4, 2, 2, 1, 2, 1, 0, 2], // Rat
  [1, 2, 2, 1, 2, 2, 2, 4, 3, 0, 2, 2, 1, 1], // Cow
  [1, 1, 2, 1, 2, 2, 2, 3, 4, 1, 2, 1, 1, 1], // Buffalo
  [1, 0, 1, 2, 1, 1, 1, 0, 1, 4, 0, 1, 2, 2], // Tiger
  [1, 1, 2, 1, 0, 2, 2, 2, 2, 0, 4, 2, 1, 1], // Deer
  [1, 2, 2, 0, 2, 2, 1, 2, 1, 1, 2, 4, 2, 2], // Monkey
  [1, 1, 0, 0, 1, 1, 0, 1, 1, 2, 1, 2, 4, 1], // Mongoose
  [1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 4], // Lion
];

// Vashya categories
export const VASHYA_CATEGORIES = [
  "Manava",
  "Vanachara",
  "Chatushpada",
  "Jalachara",
  "Keeta",
];

// Vashya compatibility matrix (5x5), max 2 points
export const VASHYA_COMPATIBILITY: number[][] = [
  [2, 2, 1, 1, 0], // Manava
  [1, 2, 1, 0, 1], // Vanachara
  [0.5, 1, 2, 1, 0], // Chatushpada
  [1, 0, 1, 2, 1], // Jalachara
  [0, 0.5, 0, 0.5, 2], // Keeta
];

// Gana compatibility matrix (3x3), max 6 points
// [Deva, Manushya, Rakshasa] x [Deva, Manushya, Rakshasa]
export const GANA_COMPATIBILITY: number[][] = [
  [6, 6, 0], // Deva
  [5, 6, 0], // Manushya
  [1, 0, 6], // Rakshasa
];
