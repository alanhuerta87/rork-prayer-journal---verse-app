import { DailyVerse } from "@/types";
import { fetchBibleVerse } from "./bibleContent";
import { DAILY_VERSE_REFERENCES } from "@/constants/colors";

// Helper function to get a deterministic "random" verse based on date
const getVerseIndexForDate = (date: Date): number => {
  // Create a simple hash from the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Simple hash function to get a deterministic index
  return (day * month * year) % DAILY_VERSE_REFERENCES.length;
};

// Function to get today's verse from API with enhanced error handling
export const getTodayVerse = async (translation: string = 'kjv'): Promise<DailyVerse> => {
  const today = new Date();
  const verseIndex = getVerseIndexForDate(today);
  const verseRef = DAILY_VERSE_REFERENCES[verseIndex];
  
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
  return getFallbackVerse(verseIndex, today, translation);
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

const getFallbackVerse = (index: number, date: Date, translation: string): DailyVerse => {
  const fallbackIndex = index % fallbackVerses.length;
  return {
    ...fallbackVerses[fallbackIndex],
    translation: translation.toUpperCase(),
    date: date.toISOString(),
  };
};

// Mock data for daily verses history (for backwards compatibility)
export const dailyVerses: DailyVerse[] = fallbackVerses.map((verse, index) => ({
  ...verse,
  translation: 'KJV',
  date: new Date(Date.now() - 86400000 * index).toISOString(),
}));

// Function to get verse for a specific date with enhanced error handling
export const getVerseForDate = async (date: Date, translation: string = 'kjv'): Promise<DailyVerse> => {
  const verseIndex = getVerseIndexForDate(date);
  const verseRef = DAILY_VERSE_REFERENCES[verseIndex];
  
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
  return getFallbackVerse(verseIndex, date, translation);
};