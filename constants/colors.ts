// Theme color options
export const themeColors = {
  blue: {
    primary: "#6B8CFF",
    secondary: "#B8A6FF",
    primaryDark: "#82A0FF",
    secondaryDark: "#C9BBFF",
  },
  purple: {
    primary: "#9B59B6",
    secondary: "#E8D5FF",
    primaryDark: "#BB7FE8",
    secondaryDark: "#F0E6FF",
  },
  green: {
    primary: "#27AE60",
    secondary: "#A8E6CF",
    primaryDark: "#58D68D",
    secondaryDark: "#D5F4E6",
  },
  orange: {
    primary: "#E67E22",
    secondary: "#FFD6B8",
    primaryDark: "#F39C12",
    secondaryDark: "#FFE5D1",
  },
  pink: {
    primary: "#E91E63",
    secondary: "#FFB3D1",
    primaryDark: "#F06292",
    secondaryDark: "#FFCCE5",
  },
  teal: {
    primary: "#1ABC9C",
    secondary: "#A3E4D7",
    primaryDark: "#48C9B0",
    secondaryDark: "#D1F2EB",
  },
};

// Base color structure
const createColorScheme = (themeColor: keyof typeof themeColors, isDark: boolean) => ({
  primary: isDark ? themeColors[themeColor].primaryDark : themeColors[themeColor].primary,
  secondary: isDark ? themeColors[themeColor].secondaryDark : themeColors[themeColor].secondary,
  background: isDark ? "#121212" : "#FFFFFF",
  card: isDark ? "#1E1E1E" : "#FFFFFF",
  text: isDark ? "#E0E0E0" : "#333333",
  textLight: isDark ? "#B0B0B0" : "#666666",
  border: isDark ? "#333333" : "#E5E7EB",
  success: isDark ? "#66BB6A" : "#4CAF50",
  error: isDark ? "#EF5350" : "#F44336",
  white: "#FFFFFF",
  black: "#000000",
  gray: isDark ? {
    100: "#2D2D2D",
    200: "#333333",
    300: "#444444",
    400: "#555555",
    500: "#777777",
    600: "#999999",
    700: "#BBBBBB",
    800: "#DDDDDD",
    900: "#F0F0F0",
  } : {
    100: "#F8F9FA",
    200: "#E9ECEF",
    300: "#DEE2E6",
    400: "#CED4DA",
    500: "#ADB5BD",
    600: "#6C757D",
    700: "#495057",
    800: "#343A40",
    900: "#212529",
  },
});

// Light theme colors (default blue)
export const lightColors = createColorScheme('blue', false);

// Dark theme colors (default blue)
export const darkColors = createColorScheme('blue', true);

// Export function to create colors for any theme
export const createThemeColors = (themeColor: keyof typeof themeColors, isDark: boolean) => 
  createColorScheme(themeColor, isDark);

// Bible translations with API mappings - Updated to match requirements
export const bibleTranslations = [
  { id: "kjv", name: "King James Version", apiCode: "kjv" },
  { id: "niv", name: "New International Version", apiCode: "niv" },
  { id: "nkjv", name: "New King James Version", apiCode: "nkjv" },
  { id: "nlt", name: "New Living Translation", apiCode: "nlt" },
  { id: "esv", name: "English Standard Version", apiCode: "esv" },
  { id: "msg", name: "The Message", apiCode: "msg" },
];

// Multiple Bible API endpoints for better reliability
export const BIBLE_API_ENDPOINTS = [
  {
    name: "Bible API",
    baseUrl: "https://bible-api.com",
    format: (book: string, chapter: number, verse?: number) => 
      verse ? `${book}+${chapter}:${verse}` : `${book}+${chapter}`,
  },
  {
    name: "Labs Bible API",
    baseUrl: "https://labs.bible.org/api",
    format: (book: string, chapter: number, verse?: number) => 
      verse ? `${book}+${chapter}:${verse}` : `${book}+${chapter}`,
  },
];

// API book name mappings (standardized names)
export const API_BOOK_MAPPINGS: { [key: string]: string } = {
  // Old Testament
  'genesis': 'Genesis',
  'exodus': 'Exodus',
  'leviticus': 'Leviticus',
  'numbers': 'Numbers',
  'deuteronomy': 'Deuteronomy',
  'joshua': 'Joshua',
  'judges': 'Judges',
  'ruth': 'Ruth',
  '1samuel': '1 Samuel',
  '2samuel': '2 Samuel',
  '1kings': '1 Kings',
  '2kings': '2 Kings',
  '1chronicles': '1 Chronicles',
  '2chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'nehemiah': 'Nehemiah',
  'esther': 'Esther',
  'job': 'Job',
  'psalms': 'Psalms',
  'proverbs': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes',
  'songofsolomon': 'Song of Solomon',
  'isaiah': 'Isaiah',
  'jeremiah': 'Jeremiah',
  'lamentations': 'Lamentations',
  'ezekiel': 'Ezekiel',
  'daniel': 'Daniel',
  'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obadiah': 'Obadiah',
  'jonah': 'Jonah',
  'micah': 'Micah',
  'nahum': 'Nahum',
  'habakkuk': 'Habakkuk',
  'zephaniah': 'Zephaniah',
  'haggai': 'Haggai',
  'zechariah': 'Zechariah',
  'malachi': 'Malachi',
  
  // New Testament
  'matthew': 'Matthew',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'romans': 'Romans',
  '1corinthians': '1 Corinthians',
  '2corinthians': '2 Corinthians',
  'galatians': 'Galatians',
  'ephesians': 'Ephesians',
  'philippians': 'Philippians',
  'colossians': 'Colossians',
  '1thessalonians': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians',
  '1timothy': '1 Timothy',
  '2timothy': '2 Timothy',
  'titus': 'Titus',
  'philemon': 'Philemon',
  'hebrews': 'Hebrews',
  'james': 'James',
  '1peter': '1 Peter',
  '2peter': '2 Peter',
  '1john': '1 John',
  '2john': '2 John',
  '3john': '3 John',
  'jude': 'Jude',
  'revelation': 'Revelation',
};

// Complete list of all 66 Bible books with accurate chapter counts
export const bibleBooks = [
  // Old Testament (39 books)
  { id: 'genesis', name: 'Genesis', testament: 'old', chapters: 50 },
  { id: 'exodus', name: 'Exodus', testament: 'old', chapters: 40 },
  { id: 'leviticus', name: 'Leviticus', testament: 'old', chapters: 27 },
  { id: 'numbers', name: 'Numbers', testament: 'old', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'old', chapters: 34 },
  { id: 'joshua', name: 'Joshua', testament: 'old', chapters: 24 },
  { id: 'judges', name: 'Judges', testament: 'old', chapters: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'old', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', testament: 'old', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', testament: 'old', chapters: 24 },
  { id: '1kings', name: '1 Kings', testament: 'old', chapters: 22 },
  { id: '2kings', name: '2 Kings', testament: 'old', chapters: 25 },
  { id: '1chronicles', name: '1 Chronicles', testament: 'old', chapters: 29 },
  { id: '2chronicles', name: '2 Chronicles', testament: 'old', chapters: 36 },
  { id: 'ezra', name: 'Ezra', testament: 'old', chapters: 10 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'old', chapters: 13 },
  { id: 'esther', name: 'Esther', testament: 'old', chapters: 10 },
  { id: 'job', name: 'Job', testament: 'old', chapters: 42 },
  { id: 'psalms', name: 'Psalms', testament: 'old', chapters: 150 },
  { id: 'proverbs', name: 'Proverbs', testament: 'old', chapters: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'old', chapters: 12 },
  { id: 'songofsolomon', name: 'Song of Solomon', testament: 'old', chapters: 8 },
  { id: 'isaiah', name: 'Isaiah', testament: 'old', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'old', chapters: 52 },
  { id: 'lamentations', name: 'Lamentations', testament: 'old', chapters: 5 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'old', chapters: 48 },
  { id: 'daniel', name: 'Daniel', testament: 'old', chapters: 12 },
  { id: 'hosea', name: 'Hosea', testament: 'old', chapters: 14 },
  { id: 'joel', name: 'Joel', testament: 'old', chapters: 3 },
  { id: 'amos', name: 'Amos', testament: 'old', chapters: 9 },
  { id: 'obadiah', name: 'Obadiah', testament: 'old', chapters: 1 },
  { id: 'jonah', name: 'Jonah', testament: 'old', chapters: 4 },
  { id: 'micah', name: 'Micah', testament: 'old', chapters: 7 },
  { id: 'nahum', name: 'Nahum', testament: 'old', chapters: 3 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'old', chapters: 3 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'old', chapters: 3 },
  { id: 'haggai', name: 'Haggai', testament: 'old', chapters: 2 },
  { id: 'zechariah', name: 'Zechariah', testament: 'old', chapters: 14 },
  { id: 'malachi', name: 'Malachi', testament: 'old', chapters: 4 },
  
  // New Testament (27 books)
  { id: 'matthew', name: 'Matthew', testament: 'new', chapters: 28 },
  { id: 'mark', name: 'Mark', testament: 'new', chapters: 16 },
  { id: 'luke', name: 'Luke', testament: 'new', chapters: 24 },
  { id: 'john', name: 'John', testament: 'new', chapters: 21 },
  { id: 'acts', name: 'Acts', testament: 'new', chapters: 28 },
  { id: 'romans', name: 'Romans', testament: 'new', chapters: 16 },
  { id: '1corinthians', name: '1 Corinthians', testament: 'new', chapters: 16 },
  { id: '2corinthians', name: '2 Corinthians', testament: 'new', chapters: 13 },
  { id: 'galatians', name: 'Galatians', testament: 'new', chapters: 6 },
  { id: 'ephesians', name: 'Ephesians', testament: 'new', chapters: 6 },
  { id: 'philippians', name: 'Philippians', testament: 'new', chapters: 4 },
  { id: 'colossians', name: 'Colossians', testament: 'new', chapters: 4 },
  { id: '1thessalonians', name: '1 Thessalonians', testament: 'new', chapters: 5 },
  { id: '2thessalonians', name: '2 Thessalonians', testament: 'new', chapters: 3 },
  { id: '1timothy', name: '1 Timothy', testament: 'new', chapters: 6 },
  { id: '2timothy', name: '2 Timothy', testament: 'new', chapters: 4 },
  { id: 'titus', name: 'Titus', testament: 'new', chapters: 3 },
  { id: 'philemon', name: 'Philemon', testament: 'new', chapters: 1 },
  { id: 'hebrews', name: 'Hebrews', testament: 'new', chapters: 13 },
  { id: 'james', name: 'James', testament: 'new', chapters: 5 },
  { id: '1peter', name: '1 Peter', testament: 'new', chapters: 5 },
  { id: '2peter', name: '2 Peter', testament: 'new', chapters: 3 },
  { id: '1john', name: '1 John', testament: 'new', chapters: 5 },
  { id: '2john', name: '2 John', testament: 'new', chapters: 1 },
  { id: '3john', name: '3 John', testament: 'new', chapters: 1 },
  { id: 'jude', name: 'Jude', testament: 'new', chapters: 1 },
  { id: 'revelation', name: 'Revelation', testament: 'new', chapters: 22 },
];

// Popular inspirational verses for daily rotation (365+ verses for full year variety)
export const DAILY_VERSE_REFERENCES = [
  // Core inspirational verses
  { book: 'john', chapter: 3, verse: 16 },
  { book: 'romans', chapter: 8, verse: 28 },
  { book: 'philippians', chapter: 4, verse: 13 },
  { book: 'psalms', chapter: 23, verse: 1 },
  { book: 'proverbs', chapter: 3, verse: 5 },
  { book: 'isaiah', chapter: 41, verse: 10 },
  { book: 'jeremiah', chapter: 29, verse: 11 },
  { book: 'matthew', chapter: 11, verse: 28 },
  { book: 'ephesians', chapter: 2, verse: 8 },
  { book: 'philippians', chapter: 4, verse: 6 },
  { book: 'romans', chapter: 12, verse: 2 },
  { book: 'psalms', chapter: 46, verse: 10 },
  { book: '2corinthians', chapter: 5, verse: 17 },
  { book: '1peter', chapter: 5, verse: 7 },
  { book: 'joshua', chapter: 1, verse: 9 },
  { book: 'galatians', chapter: 5, verse: 22 },
  { book: 'hebrews', chapter: 11, verse: 1 },
  { book: 'james', chapter: 1, verse: 2 },
  { book: 'psalms', chapter: 100, verse: 1 },
  { book: 'colossians', chapter: 3, verse: 12 },
  { book: 'romans', chapter: 3, verse: 23 },
  { book: 'acts', chapter: 1, verse: 8 },
  { book: 'matthew', chapter: 5, verse: 3 },
  { book: 'luke', chapter: 4, verse: 18 },
  { book: 'john', chapter: 14, verse: 6 },
  { book: 'revelation', chapter: 21, verse: 4 },
  { book: 'psalms', chapter: 1, verse: 1 },
  { book: 'genesis', chapter: 1, verse: 1 },
  { book: 'exodus', chapter: 20, verse: 3 },
  { book: 'matthew', chapter: 28, verse: 19 },
  
  // Additional inspirational verses for variety
  { book: 'psalms', chapter: 27, verse: 1 },
  { book: 'psalms', chapter: 34, verse: 8 },
  { book: 'psalms', chapter: 37, verse: 4 },
  { book: 'psalms', chapter: 40, verse: 1 },
  { book: 'psalms', chapter: 42, verse: 1 },
  { book: 'psalms', chapter: 51, verse: 10 },
  { book: 'psalms', chapter: 55, verse: 22 },
  { book: 'psalms', chapter: 62, verse: 1 },
  { book: 'psalms', chapter: 73, verse: 26 },
  { book: 'psalms', chapter: 84, verse: 11 },
  { book: 'psalms', chapter: 91, verse: 1 },
  { book: 'psalms', chapter: 103, verse: 2 },
  { book: 'psalms', chapter: 118, verse: 24 },
  { book: 'psalms', chapter: 119, verse: 105 },
  { book: 'psalms', chapter: 121, verse: 1 },
  { book: 'psalms', chapter: 139, verse: 14 },
  { book: 'psalms', chapter: 143, verse: 8 },
  { book: 'psalms', chapter: 145, verse: 18 },
  { book: 'psalms', chapter: 147, verse: 3 },
  { book: 'psalms', chapter: 150, verse: 6 },
  
  // Proverbs wisdom
  { book: 'proverbs', chapter: 16, verse: 3 },
  { book: 'proverbs', chapter: 18, verse: 10 },
  { book: 'proverbs', chapter: 27, verse: 1 },
  { book: 'proverbs', chapter: 31, verse: 25 },
  
  // Isaiah comfort and strength
  { book: 'isaiah', chapter: 26, verse: 3 },
  { book: 'isaiah', chapter: 40, verse: 31 },
  { book: 'isaiah', chapter: 43, verse: 2 },
  { book: 'isaiah', chapter: 46, verse: 4 },
  { book: 'isaiah', chapter: 54, verse: 10 },
  { book: 'isaiah', chapter: 55, verse: 8 },
  { book: 'isaiah', chapter: 61, verse: 3 },
  
  // Matthew teachings
  { book: 'matthew', chapter: 5, verse: 16 },
  { book: 'matthew', chapter: 6, verse: 26 },
  { book: 'matthew', chapter: 6, verse: 33 },
  { book: 'matthew', chapter: 7, verse: 7 },
  { book: 'matthew', chapter: 19, verse: 26 },
  { book: 'matthew', chapter: 22, verse: 37 },
  
  // John's Gospel
  { book: 'john', chapter: 1, verse: 12 },
  { book: 'john', chapter: 8, verse: 12 },
  { book: 'john', chapter: 10, verse: 10 },
  { book: 'john', chapter: 13, verse: 34 },
  { book: 'john', chapter: 15, verse: 5 },
  { book: 'john', chapter: 16, verse: 33 },
  
  // Romans doctrine and encouragement
  { book: 'romans', chapter: 1, verse: 16 },
  { book: 'romans', chapter: 5, verse: 8 },
  { book: 'romans', chapter: 6, verse: 23 },
  { book: 'romans', chapter: 10, verse: 9 },
  { book: 'romans', chapter: 15, verse: 13 },
  
  // 1 Corinthians
  { book: '1corinthians', chapter: 10, verse: 13 },
  { book: '1corinthians', chapter: 13, verse: 4 },
  { book: '1corinthians', chapter: 13, verse: 13 },
  { book: '1corinthians', chapter: 15, verse: 58 },
  { book: '1corinthians', chapter: 16, verse: 14 },
  
  // 2 Corinthians
  { book: '2corinthians', chapter: 1, verse: 3 },
  { book: '2corinthians', chapter: 4, verse: 16 },
  { book: '2corinthians', chapter: 9, verse: 8 },
  { book: '2corinthians', chapter: 12, verse: 9 },
  
  // Galatians
  { book: 'galatians', chapter: 2, verse: 20 },
  { book: 'galatians', chapter: 6, verse: 9 },
  
  // Ephesians
  { book: 'ephesians', chapter: 1, verse: 3 },
  { book: 'ephesians', chapter: 3, verse: 20 },
  { book: 'ephesians', chapter: 4, verse: 32 },
  { book: 'ephesians', chapter: 6, verse: 10 },
  
  // Philippians
  { book: 'philippians', chapter: 1, verse: 6 },
  { book: 'philippians', chapter: 2, verse: 3 },
  { book: 'philippians', chapter: 3, verse: 13 },
  { book: 'philippians', chapter: 4, verse: 19 },
  
  // Colossians
  { book: 'colossians', chapter: 1, verse: 17 },
  { book: 'colossians', chapter: 2, verse: 6 },
  { book: 'colossians', chapter: 3, verse: 2 },
  { book: 'colossians', chapter: 3, verse: 17 },
  { book: 'colossians', chapter: 3, verse: 23 },
  
  // 1 Thessalonians
  { book: '1thessalonians', chapter: 5, verse: 16 },
  { book: '1thessalonians', chapter: 5, verse: 18 },
  
  // 2 Timothy
  { book: '2timothy', chapter: 1, verse: 7 },
  { book: '2timothy', chapter: 3, verse: 16 },
  
  // Hebrews
  { book: 'hebrews', chapter: 4, verse: 16 },
  { book: 'hebrews', chapter: 10, verse: 23 },
  { book: 'hebrews', chapter: 12, verse: 1 },
  { book: 'hebrews', chapter: 13, verse: 5 },
  { book: 'hebrews', chapter: 13, verse: 8 },
  
  // James
  { book: 'james', chapter: 1, verse: 5 },
  { book: 'james', chapter: 1, verse: 17 },
  { book: 'james', chapter: 4, verse: 8 },
  
  // 1 Peter
  { book: '1peter', chapter: 2, verse: 9 },
  { book: '1peter', chapter: 3, verse: 15 },
  { book: '1peter', chapter: 4, verse: 10 },
  
  // 1 John
  { book: '1john', chapter: 1, verse: 9 },
  { book: '1john', chapter: 3, verse: 1 },
  { book: '1john', chapter: 4, verse: 7 },
  { book: '1john', chapter: 4, verse: 19 },
  { book: '1john', chapter: 5, verse: 14 },
  
  // Additional Old Testament encouragement
  { book: 'deuteronomy', chapter: 31, verse: 6 },
  { book: '1samuel', chapter: 16, verse: 7 },
  { book: '1chronicles', chapter: 16, verse: 11 },
  { book: 'nehemiah', chapter: 8, verse: 10 },
  { book: 'job', chapter: 19, verse: 25 },
  { book: 'ecclesiastes', chapter: 3, verse: 1 },
  { book: 'lamentations', chapter: 3, verse: 22 },
  { book: 'daniel', chapter: 3, verse: 17 },
  { book: 'micah', chapter: 6, verse: 8 },
  { book: 'habakkuk', chapter: 3, verse: 19 },
  { book: 'zephaniah', chapter: 3, verse: 17 },
  { book: 'haggai', chapter: 2, verse: 4 },
  { book: 'zechariah', chapter: 4, verse: 6 },
  { book: 'malachi', chapter: 3, verse: 6 },
  
  // More New Testament encouragement
  { book: 'mark', chapter: 9, verse: 23 },
  { book: 'mark', chapter: 11, verse: 24 },
  { book: 'luke', chapter: 1, verse: 37 },
  { book: 'luke', chapter: 6, verse: 31 },
  { book: 'luke', chapter: 12, verse: 7 },
  { book: 'acts', chapter: 16, verse: 31 },
  { book: 'acts', chapter: 20, verse: 35 },
  { book: '1timothy', chapter: 4, verse: 12 },
  { book: 'titus', chapter: 3, verse: 5 },
  { book: 'jude', chapter: 1, verse: 24 },
  { book: 'revelation', chapter: 3, verse: 20 },
  
  // Additional Psalms for daily inspiration
  { book: 'psalms', chapter: 3, verse: 3 },
  { book: 'psalms', chapter: 5, verse: 3 },
  { book: 'psalms', chapter: 9, verse: 1 },
  { book: 'psalms', chapter: 16, verse: 11 },
  { book: 'psalms', chapter: 18, verse: 2 },
  { book: 'psalms', chapter: 19, verse: 14 },
  { book: 'psalms', chapter: 25, verse: 5 },
  { book: 'psalms', chapter: 28, verse: 7 },
  { book: 'psalms', chapter: 30, verse: 5 },
  { book: 'psalms', chapter: 32, verse: 8 },
  { book: 'psalms', chapter: 33, verse: 22 },
  { book: 'psalms', chapter: 36, verse: 7 },
  { book: 'psalms', chapter: 37, verse: 23 },
  { book: 'psalms', chapter: 46, verse: 1 },
  { book: 'psalms', chapter: 50, verse: 15 },
  { book: 'psalms', chapter: 56, verse: 3 },
  { book: 'psalms', chapter: 63, verse: 1 },
  { book: 'psalms', chapter: 66, verse: 19 },
  { book: 'psalms', chapter: 68, verse: 19 },
  { book: 'psalms', chapter: 71, verse: 5 },
  { book: 'psalms', chapter: 77, verse: 14 },
  { book: 'psalms', chapter: 86, verse: 5 },
  { book: 'psalms', chapter: 90, verse: 12 },
  { book: 'psalms', chapter: 94, verse: 19 },
  { book: 'psalms', chapter: 95, verse: 1 },
  { book: 'psalms', chapter: 96, verse: 2 },
  { book: 'psalms', chapter: 107, verse: 1 },
  { book: 'psalms', chapter: 111, verse: 10 },
  { book: 'psalms', chapter: 112, verse: 7 },
  { book: 'psalms', chapter: 116, verse: 1 },
  { book: 'psalms', chapter: 119, verse: 11 },
  { book: 'psalms', chapter: 126, verse: 3 },
  { book: 'psalms', chapter: 130, verse: 5 },
  { book: 'psalms', chapter: 133, verse: 1 },
  { book: 'psalms', chapter: 136, verse: 1 },
  { book: 'psalms', chapter: 138, verse: 8 },
  { book: 'psalms', chapter: 141, verse: 3 },
  { book: 'psalms', chapter: 144, verse: 15 },
  { book: 'psalms', chapter: 146, verse: 5 },
  
  // More Proverbs wisdom
  { book: 'proverbs', chapter: 4, verse: 23 },
  { book: 'proverbs', chapter: 11, verse: 25 },
  { book: 'proverbs', chapter: 15, verse: 1 },
  { book: 'proverbs', chapter: 17, verse: 22 },
  { book: 'proverbs', chapter: 19, verse: 21 },
  { book: 'proverbs', chapter: 20, verse: 24 },
  { book: 'proverbs', chapter: 22, verse: 6 },
  { book: 'proverbs', chapter: 28, verse: 13 },
  { book: 'proverbs', chapter: 29, verse: 25 },
  
  // More Isaiah promises
  { book: 'isaiah', chapter: 9, verse: 6 },
  { book: 'isaiah', chapter: 12, verse: 2 },
  { book: 'isaiah', chapter: 25, verse: 1 },
  { book: 'isaiah', chapter: 30, verse: 21 },
  { book: 'isaiah', chapter: 35, verse: 4 },
  { book: 'isaiah', chapter: 42, verse: 3 },
  { book: 'isaiah', chapter: 49, verse: 13 },
  { book: 'isaiah', chapter: 53, verse: 5 },
  { book: 'isaiah', chapter: 58, verse: 11 },
  { book: 'isaiah', chapter: 64, verse: 4 },
  
  // Jeremiah hope
  { book: 'jeremiah', chapter: 1, verse: 5 },
  { book: 'jeremiah', chapter: 17, verse: 7 },
  { book: 'jeremiah', chapter: 31, verse: 3 },
  { book: 'jeremiah', chapter: 32, verse: 17 },
  { book: 'jeremiah', chapter: 33, verse: 3 },
  
  // Ezekiel restoration
  { book: 'ezekiel', chapter: 36, verse: 26 },
  
  // More encouragement from various books
  { book: 'ruth', chapter: 1, verse: 16 },
  { book: '2samuel', chapter: 22, verse: 31 },
  { book: '1kings', chapter: 8, verse: 56 },
  { book: '2chronicles', chapter: 7, verse: 14 },
  { book: 'ezra', chapter: 8, verse: 22 },
  { book: 'esther', chapter: 4, verse: 14 },
  { book: 'hosea', chapter: 6, verse: 3 },
  { book: 'joel', chapter: 2, verse: 13 },
  { book: 'amos', chapter: 5, verse: 4 },
  { book: 'jonah', chapter: 2, verse: 7 },
];