import { DailyVerse } from "@/types";
import { fetchBibleVerse } from "./bibleContent";
import { DAILY_VERSE_REFERENCES } from "@/constants/colors";

// Seasonal verse collections for special times of the year
const SEASONAL_VERSES = {
  // Christmas/Advent Season (December)
  christmas: [
    { book: 'luke', chapter: 2, verse: 11, season: 'Christmas' }, // "For unto you is born this day..."
    { book: 'matthew', chapter: 1, verse: 23, season: 'Christmas' }, // "Behold, a virgin shall conceive..."
    { book: 'john', chapter: 1, verse: 14, season: 'Christmas' }, // "And the Word became flesh..."
    { book: 'isaiah', chapter: 9, verse: 6, season: 'Christmas' }, // "For unto us a child is born..."
    { book: 'luke', chapter: 2, verse: 14, season: 'Christmas' }, // "Glory to God in the highest..."
    { book: 'matthew', chapter: 2, verse: 10, season: 'Christmas' }, // "When they saw the star..."
    { book: 'luke', chapter: 1, verse: 30, season: 'Christmas' }, // "Fear not, Mary..."
    { book: 'galatians', chapter: 4, verse: 4, season: 'Christmas' }, // "When the fullness of time came..."
    { book: 'titus', chapter: 2, verse: 11, season: 'Christmas' }, // "For the grace of God has appeared..."
    { book: '1timothy', chapter: 3, verse: 16, season: 'Christmas' }, // "Great is the mystery of godliness..."
    { book: 'romans', chapter: 5, verse: 8, season: 'Christmas' }, // "But God demonstrates his love..."
    { book: '1john', chapter: 4, verse: 9, season: 'Christmas' }, // "This is how God showed his love..."
    { book: 'philippians', chapter: 2, verse: 6, season: 'Christmas' }, // "Who, being in very nature God..."
    { book: 'hebrews', chapter: 1, verse: 3, season: 'Christmas' }, // "The Son is the radiance..."
    { book: 'luke', chapter: 2, verse: 7, season: 'Christmas' }, // "And she gave birth to her firstborn..."
    { book: 'matthew', chapter: 1, verse: 21, season: 'Christmas' }, // "She will give birth to a son..."
    { book: 'luke', chapter: 1, verse: 35, season: 'Christmas' }, // "The Holy Spirit will come upon you..."
    { book: 'isaiah', chapter: 7, verse: 14, season: 'Christmas' }, // "Therefore the Lord himself will give you a sign..."
    { book: 'micah', chapter: 5, verse: 2, season: 'Christmas' }, // "But you, Bethlehem Ephrathah..."
    { book: 'luke', chapter: 2, verse: 20, season: 'Christmas' }, // "The shepherds returned, glorifying..."
    { book: 'john', chapter: 3, verse: 16, season: 'Christmas' }, // "For God so loved the world..."
    { book: 'romans', chapter: 6, verse: 23, season: 'Christmas' }, // "For the wages of sin is death..."
    { book: '2corinthians', chapter: 9, verse: 15, season: 'Christmas' }, // "Thanks be to God for his indescribable gift!"
    { book: 'ephesians', chapter: 2, verse: 8, season: 'Christmas' }, // "For it is by grace you have been saved..."
    { book: 'luke', chapter: 2, verse: 10, season: 'Christmas' }, // "But the angel said to them..."
    { book: 'matthew', chapter: 2, verse: 2, season: 'Christmas' }, // "Where is the one who has been born..."
    { book: 'luke', chapter: 1, verse: 46, season: 'Christmas' }, // "And Mary said: My soul glorifies..."
    { book: 'luke', chapter: 1, verse: 68, season: 'Christmas' }, // "Praise be to the Lord..."
    { book: 'isaiah', chapter: 40, verse: 3, season: 'Christmas' }, // "A voice of one calling..."
    { book: 'john', chapter: 1, verse: 1, season: 'Christmas' }, // "In the beginning was the Word..."
    { book: 'colossians', chapter: 1, verse: 15, season: 'Christmas' } // "The Son is the image of the invisible God..."
  ],

  // Easter Season (March-April, calculated based on Easter date)
  easter: [
    { book: 'matthew', chapter: 28, verse: 6, season: 'Easter' }, // "He is not here; he has risen..."
    { book: 'luke', chapter: 24, verse: 34, season: 'Easter' }, // "The Lord has risen indeed..."
    { book: '1corinthians', chapter: 15, verse: 20, season: 'Easter' }, // "But Christ has indeed been raised..."
    { book: 'romans', chapter: 6, verse: 4, season: 'Easter' }, // "We were therefore buried with him..."
    { book: 'john', chapter: 11, verse: 25, season: 'Easter' }, // "I am the resurrection and the life..."
    { book: '1peter', chapter: 1, verse: 3, season: 'Easter' }, // "Praise be to the God and Father..."
    { book: 'romans', chapter: 8, verse: 11, season: 'Easter' }, // "And if the Spirit of him who raised Jesus..."
    { book: '1corinthians', chapter: 15, verse: 55, season: 'Easter' }, // "Where, O death, is your victory?..."
    { book: 'colossians', chapter: 3, verse: 1, season: 'Easter' }, // "Since, then, you have been raised with Christ..."
    { book: 'ephesians', chapter: 2, verse: 6, season: 'Easter' }, // "And God raised us up with Christ..."
    { book: 'romans', chapter: 4, verse: 25, season: 'Easter' }, // "He was delivered over to death..."
    { book: '2corinthians', chapter: 5, verse: 17, season: 'Easter' }, // "Therefore, if anyone is in Christ..."
    { book: 'john', chapter: 20, verse: 20, season: 'Easter' }, // "The disciples were overjoyed..."
    { book: 'luke', chapter: 24, verse: 6, season: 'Easter' }, // "He is not here; he has risen!..."
    { book: 'acts', chapter: 2, verse: 24, season: 'Easter' }, // "But God raised him from the dead..."
    { book: '1corinthians', chapter: 15, verse: 4, season: 'Easter' }, // "That he was buried, that he was raised..."
    { book: 'romans', chapter: 1, verse: 4, season: 'Easter' }, // "And who through the Spirit of holiness..."
    { book: 'philippians', chapter: 3, verse: 10, season: 'Easter' }, // "I want to know Christ—yes, to know the power..."
    { book: '1thessalonians', chapter: 4, verse: 14, season: 'Easter' }, // "For we believe that Jesus died and rose again..."
    { book: 'hebrews', chapter: 7, verse: 25, season: 'Easter' }, // "Therefore he is able to save completely..."
    { book: 'revelation', chapter: 1, verse: 18, season: 'Easter' }, // "I am the Living One; I was dead..."
    { book: 'john', chapter: 14, verse: 19, season: 'Easter' }, // "Because I live, you also will live..."
    { book: 'romans', chapter: 5, verse: 10, season: 'Easter' }, // "For if, while we were God's enemies..."
    { book: '2timothy', chapter: 1, verse: 10, season: 'Easter' }, // "But it has now been revealed through the appearing..."
    { book: 'acts', chapter: 4, verse: 33, season: 'Easter' }, // "With great power the apostles continued..."
    { book: '1john', chapter: 3, verse: 2, season: 'Easter' }, // "Dear friends, now we are children of God..."
    { book: 'romans', chapter: 8, verse: 34, season: 'Easter' }, // "Who then is the one who condemns?..."
    { book: 'ephesians', chapter: 1, verse: 20, season: 'Easter' }, // "Which he exerted when he raised Christ..."
    { book: 'colossians', chapter: 2, verse: 12, season: 'Easter' }, // "Having been buried with him in baptism..."
    { book: '1corinthians', chapter: 6, verse: 14, season: 'Easter' } // "By his power God raised the Lord from the dead..."
  ],

  // Thanksgiving Season (November)
  thanksgiving: [
    { book: 'psalms', chapter: 100, verse: 4, season: 'Thanksgiving' }, // "Enter his gates with thanksgiving..."
    { book: '1thessalonians', chapter: 5, verse: 18, season: 'Thanksgiving' }, // "Give thanks in all circumstances..."
    { book: 'psalms', chapter: 107, verse: 1, season: 'Thanksgiving' }, // "Give thanks to the Lord, for he is good..."
    { book: 'colossians', chapter: 3, verse: 15, season: 'Thanksgiving' }, // "And be thankful..."
    { book: 'ephesians', chapter: 5, verse: 20, season: 'Thanksgiving' }, // "Always giving thanks to God..."
    { book: 'psalms', chapter: 118, verse: 1, season: 'Thanksgiving' }, // "Give thanks to the Lord, for he is good..."
    { book: 'psalms', chapter: 136, verse: 1, season: 'Thanksgiving' }, // "Give thanks to the Lord, for he is good..."
    { book: 'daniel', chapter: 2, verse: 23, season: 'Thanksgiving' }, // "I thank and praise you, God of my ancestors..."
    { book: 'psalms', chapter: 95, verse: 2, season: 'Thanksgiving' }, // "Let us come before him with thanksgiving..."
    { book: 'psalms', chapter: 50, verse: 14, season: 'Thanksgiving' }, // "Sacrifice thank offerings to God..."
    { book: 'hebrews', chapter: 12, verse: 28, season: 'Thanksgiving' }, // "Therefore, since we are receiving a kingdom..."
    { book: 'psalms', chapter: 69, verse: 30, season: 'Thanksgiving' }, // "I will praise God's name in song..."
    { book: '2corinthians', chapter: 9, verse: 11, season: 'Thanksgiving' }, // "You will be enriched in every way..."
    { book: 'psalms', chapter: 103, verse: 2, season: 'Thanksgiving' }, // "Praise the Lord, my soul, and forget not..."
    { book: 'james', chapter: 1, verse: 17, season: 'Thanksgiving' } // "Every good and perfect gift is from above..."
  ],

  // New Year (January)
  newYear: [
    { book: 'jeremiah', chapter: 29, verse: 11, season: 'New Year' }, // "For I know the plans I have for you..."
    { book: 'isaiah', chapter: 43, verse: 19, season: 'New Year' }, // "See, I am doing a new thing!..."
    { book: '2corinthians', chapter: 5, verse: 17, season: 'New Year' }, // "Therefore, if anyone is in Christ, the new creation..."
    { book: 'lamentations', chapter: 3, verse: 22, season: 'New Year' }, // "Because of the Lord's great love we are not consumed..."
    { book: 'philippians', chapter: 3, verse: 13, season: 'New Year' }, // "Forgetting what is behind and straining toward..."
    { book: 'ecclesiastes', chapter: 3, verse: 1, season: 'New Year' }, // "To every thing there is a season..."
    { book: 'psalms', chapter: 90, verse: 12, season: 'New Year' }, // "Teach us to number our days..."
    { book: 'proverbs', chapter: 16, verse: 9, season: 'New Year' }, // "In their hearts humans plan their course..."
    { book: 'james', chapter: 4, verse: 13, season: 'New Year' }, // "Now listen, you who say, 'Today or tomorrow..."
    { book: 'psalms', chapter: 31, verse: 15, season: 'New Year' } // "My times are in your hands..."
  ],

  // Lent Season (February-March)
  lent: [
    { book: 'joel', chapter: 2, verse: 12, season: 'Lent' }, // "Even now, declares the Lord, return to me..."
    { book: 'matthew', chapter: 4, verse: 4, season: 'Lent' }, // "Man shall not live on bread alone..."
    { book: 'psalms', chapter: 51, verse: 10, season: 'Lent' }, // "Create in me a pure heart, O God..."
    { book: '2chronicles', chapter: 7, verse: 14, season: 'Lent' }, // "If my people, who are called by my name..."
    { book: 'isaiah', chapter: 55, verse: 7, season: 'Lent' }, // "Let the wicked forsake their ways..."
    { book: 'acts', chapter: 3, verse: 19, season: 'Lent' }, // "Repent, then, and turn to God..."
    { book: '1john', chapter: 1, verse: 9, season: 'Lent' }, // "If we confess our sins, he is faithful..."
    { book: 'james', chapter: 4, verse: 8, season: 'Lent' }, // "Come near to God and he will come near to you..."
    { book: 'matthew', chapter: 6, verse: 6, season: 'Lent' }, // "But when you pray, go into your room..."
    { book: 'isaiah', chapter: 58, verse: 6, season: 'Lent' } // "Is not this the kind of fasting I have chosen..."
  ]
};

// Function to determine current season based on date
const getCurrentSeason = (date: Date): keyof typeof SEASONAL_VERSES | null => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  
  // Christmas/Advent season (December)
  if (month === 12) {
    return 'christmas';
  }
  
  // New Year season (January)
  if (month === 1) {
    return 'newYear';
  }
  
  // Thanksgiving season (November)
  if (month === 11) {
    return 'thanksgiving';
  }
  
  // Easter season calculation (approximate - March/April)
  // This is a simplified calculation. For exact Easter dates, you'd need a more complex algorithm
  const year = date.getFullYear();
  const easterMonth = getEasterMonth(year);
  const easterDay = getEasterDay(year);
  
  // Easter season: 2 weeks before to 2 weeks after Easter
  if (month === easterMonth) {
    const daysDiff = day - easterDay;
    if (daysDiff >= -14 && daysDiff <= 14) {
      return 'easter';
    }
  }
  
  // Lent season (40 days before Easter, roughly February-March)
  if ((month === 2 && day >= 15) || (month === 3 && day <= 15)) {
    return 'lent';
  }
  
  return null;
};

// Simplified Easter calculation (Western Easter)
const getEasterMonth = (year: number): number => {
  // This is a simplified approximation. Easter typically falls in March or April
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  return month; // 3 = March, 4 = April
};

const getEasterDay = (year: number): number => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const day = Math.floor((h + l - 7 * m + 114) % 31) + 1;
  return day;
};

// Helper function to get a deterministic "random" verse based on date with seasonal priority
const getVerseIndexForDate = (date: Date): { book: string; chapter: number; verse: number; season?: string } => {
  // Check if we're in a special season
  const currentSeason = getCurrentSeason(date);
  
  if (currentSeason && SEASONAL_VERSES[currentSeason]) {
    // Use seasonal verses during special times
    const seasonalVerses = SEASONAL_VERSES[currentSeason];
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const seasonalIndex = dayOfYear % seasonalVerses.length;
    
    console.log(`Date: ${date.toDateString()}, Season: ${currentSeason}, Seasonal verse index: ${seasonalIndex}`);
    
    return seasonalVerses[seasonalIndex];
  }
  
  // Fall back to regular verses for non-seasonal times
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const year = date.getFullYear();
  
  // Use day of year + year offset to ensure different verses each day
  const hash = (dayOfYear + (year * 367)) % DAILY_VERSE_REFERENCES.length;
  
  console.log(`Date: ${date.toDateString()}, Day of year: ${dayOfYear}, Regular verse index: ${hash}, Total verses: ${DAILY_VERSE_REFERENCES.length}`);
  
  return DAILY_VERSE_REFERENCES[hash];
};

// Function to get today's verse from API with enhanced error handling and seasonal support
export const getTodayVerse = async (translation: string = 'kjv'): Promise<DailyVerse> => {
  const today = new Date();
  const verseRef = getVerseIndexForDate(today);
  
  console.log('Getting today\'s verse:', verseRef, 'translation:', translation);
  
  try {
    const apiVerse = await fetchBibleVerse(
      verseRef.book, 
      verseRef.chapter, 
      verseRef.verse, 
      translation
    );
    
    if (apiVerse && apiVerse.text) {
      console.log('Successfully fetched verse from API:', apiVerse);
      return {
        reference: apiVerse.reference,
        text: apiVerse.text,
        translation: translation.toUpperCase(),
        date: today.toISOString(),
      };
    }
  } catch (error) {
    console.error('Error fetching daily verse from API:', error);
  }
  
  console.log('Using fallback verse');
  // Fallback to static verse if API fails
  return getFallbackVerse(verseRef, today, translation);
};

// Expanded fallback verses for when API is unavailable
const fallbackVerses: Omit<DailyVerse, 'date' | 'translation'>[] = [
  {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd, I lack nothing.",
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  },
  {
    reference: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you hope and a future.",
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
  },
  {
    reference: "Ephesians 2:8-9",
    text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
  },
  {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
  },
  {
    reference: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
  },
  {
    reference: "Psalm 46:10",
    text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
  },
  {
    reference: "2 Corinthians 5:17",
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
  },
  {
    reference: "1 Peter 5:7",
    text: "Cast all your anxiety on him because he cares for you.",
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
  },
  {
    reference: "Galatians 5:22",
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness,",
  },
  {
    reference: "Hebrews 11:1",
    text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
  },
  {
    reference: "James 1:2-3",
    text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.",
  },
  {
    reference: "Psalm 100:1",
    text: "Shout for joy to the LORD, all the earth.",
  },
  {
    reference: "Colossians 3:12",
    text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
  },
  {
    reference: "Romans 3:23",
    text: "for all have sinned and fall short of the glory of God,",
  },
  {
    reference: "Acts 1:8",
    text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.",
  },
  {
    reference: "Matthew 5:3",
    text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
  },
  {
    reference: "Luke 4:18",
    text: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the prisoners and recovery of sight for the blind, to set the oppressed free,",
  },
  {
    reference: "John 14:6",
    text: "Jesus answered, \"I am the way and the truth and the life. No one comes to the Father except through me.\"",
  },
  {
    reference: "Revelation 21:4",
    text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.",
  },
  {
    reference: "Psalm 1:1",
    text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,",
  },
  {
    reference: "Genesis 1:1",
    text: "In the beginning God created the heavens and the earth.",
  },
  {
    reference: "Exodus 20:3",
    text: "You shall have no other gods before me.",
  },
  {
    reference: "Matthew 28:19",
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
  },
];

const getFallbackVerse = (verseRef: { book: string; chapter: number; verse: number; season?: string }, date: Date, translation: string): DailyVerse => {
  // Try to find a matching fallback verse, otherwise use the first one
  const matchingVerse = fallbackVerses.find(v => 
    v.reference.toLowerCase().includes(verseRef.book) || 
    v.reference.includes(`${verseRef.chapter}:${verseRef.verse}`)
  );
  
  const selectedVerse = matchingVerse || fallbackVerses[0];
  
  return {
    ...selectedVerse,
    translation: translation.toUpperCase(),
    date: date.toISOString(),
    season: verseRef.season,
  };
};

// Mock data for daily verses history (for backwards compatibility)
export const dailyVerses: DailyVerse[] = fallbackVerses.map((verse, index) => ({
  ...verse,
  translation: 'KJV',
  date: new Date(Date.now() - 86400000 * index).toISOString(),
}));

// Function to get verse for a specific date with enhanced error handling and seasonal support
export const getVerseForDate = async (date: Date, translation: string = 'kjv'): Promise<DailyVerse> => {
  const verseRef = getVerseIndexForDate(date);
  
  console.log('Getting verse for date:', date, verseRef, 'translation:', translation);
  
  try {
    const apiVerse = await fetchBibleVerse(
      verseRef.book, 
      verseRef.chapter, 
      verseRef.verse, 
      translation
    );
    
    if (apiVerse && apiVerse.text) {
      console.log('Successfully fetched verse for date from API:', apiVerse);
      return {
        reference: apiVerse.reference,
        text: apiVerse.text,
        translation: translation.toUpperCase(),
        date: date.toISOString(),
      };
    }
  } catch (error) {
    console.error('Error fetching verse for date from API:', error);
  }
  
  console.log('Using fallback verse for date');
  return getFallbackVerse(verseRef, date, translation);
};