import { BibleVerse } from '@/types';
import { BIBLE_API_ENDPOINTS, API_BOOK_MAPPINGS, bibleTranslations } from '@/constants/colors';
import { bibleApi } from '@/services/bibleApi';

// Define types for Bible content structure
interface BibleChapters {
  [chapter: string]: BibleVerse[];
}

interface BibleBook {
  name: string;
  chapters: BibleChapters;
}

interface BibleContent {
  [bookId: string]: BibleBook;
}

// Enhanced API service functions with comprehensive Bible API support
export const fetchBibleVerse = async (
  book: string, 
  chapter: number, 
  verse: number, 
  translation: string = 'kjv'
): Promise<{ text: string; reference: string } | null> => {
  try {
    // Try the new comprehensive API service first
    const result = await bibleApi.fetchVerse(book, chapter, verse, translation);
    if (result) {
      return result;
    }
  } catch (error) {
    console.log('Bible API service failed, trying fallback:', error);
  }
  
  // Fallback to local content
  console.log('Using fallback verse content');
  return getFallbackVerse(book, chapter, verse);
};

export const fetchBibleChapter = async (
  book: string, 
  chapter: number, 
  translation: string = 'kjv'
): Promise<BibleVerse[] | null> => {
  try {
    // Try the new comprehensive API service first
    const verses = await bibleApi.fetchChapter(book, chapter, translation);
    if (verses.length > 0) {
      return verses;
    }
  } catch (error) {
    console.log('Bible API service failed, trying fallback:', error);
  }
  
  // Fallback to local content
  console.log('Using fallback chapter content');
  return getFallbackChapter(book, chapter);
};

const parseChapterText = (text: string): BibleVerse[] => {
  const verses: BibleVerse[] = [];
  
  // Try to split by verse numbers (common patterns)
  const versePatterns = [
    /(\d+)\s+([^0-9]+?)(?=\d+\s|$)/g, // Pattern: "1 text 2 text"
    /(\d+)\.?\s*([^0-9]+?)(?=\d+\.?\s*|$)/g, // Pattern: "1. text 2. text"
  ];
  
  for (const pattern of versePatterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      matches.forEach(match => {
        const verseNum = parseInt(match[1]);
        const verseText = match[2].trim();
        if (verseText) {
          verses.push({
            verse: verseNum,
            text: verseText
          });
        }
      });
      break;
    }
  }
  
  return verses;
};

const fetchChapterVerses = async (
  book: string, 
  chapter: number, 
  translation: string = 'kjv',
  maxVerses: number = 50
): Promise<BibleVerse[]> => {
  const verses: BibleVerse[] = [];
  const batchSize = 3; // Smaller batch size to avoid rate limiting
  
  for (let startVerse = 1; startVerse <= maxVerses; startVerse += batchSize) {
    const batchPromises: Promise<{ verse: number; text: string } | null>[] = [];
    
    for (let verse = startVerse; verse < startVerse + batchSize && verse <= maxVerses; verse++) {
      batchPromises.push(
        fetchBibleVerse(book, chapter, verse, translation).then(result => 
          result ? { verse, text: result.text } : null
        )
      );
    }
    
    try {
      const batchResults = await Promise.all(batchPromises);
      let foundVerses = false;
      
      for (const result of batchResults) {
        if (result && result.text) {
          verses.push(result);
          foundVerses = true;
        }
      }
      
      // If no verses found in this batch, we've likely reached the end
      if (!foundVerses && verses.length > 0) {
        break;
      }
      
      // Add a delay between batches to be respectful to the API
      if (startVerse + batchSize <= maxVerses) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error fetching verse batch starting at ${startVerse}:`, error);
      break;
    }
  }
  
  // If we still don't have verses, use fallback
  if (verses.length === 0) {
    return getFallbackChapter(book, chapter);
  }
  
  return verses.sort((a, b) => a.verse - b.verse);
};

// Function to get book info including chapter count
export const getBookInfo = async (bookId: string, translation: string = 'kjv') => {
  // For now, return static info since the API structure is unclear
  return {
    name: API_BOOK_MAPPINGS[bookId] || bookId,
    chapters: null
  };
};

// Function to validate if a chapter exists
export const validateChapter = async (
  bookId: string, 
  chapter: number, 
  translation: string = 'kjv'
): Promise<boolean> => {
  try {
    // Use the new API service for validation
    return await bibleApi.validateChapter(bookId, chapter, translation);
  } catch (error) {
    // Fallback validation
    const fallbackData = fallbackBibleContent[bookId];
    return fallbackData && fallbackData.chapters[chapter.toString()] !== undefined;
  }
};

// Enhanced fallback functions
const getFallbackVerse = (book: string, chapter: number, verse: number): { text: string; reference: string } | null => {
  const fallbackData = fallbackBibleContent[book];
  if (fallbackData && fallbackData.chapters[chapter.toString()]) {
    const chapterVerses = fallbackData.chapters[chapter.toString()];
    const foundVerse = chapterVerses.find(v => v.verse === verse);
    if (foundVerse) {
      return {
        text: foundVerse.text,
        reference: `${fallbackData.name} ${chapter}:${verse}`
      };
    }
  }
  return null;
};

const getFallbackChapter = (book: string, chapter: number): BibleVerse[] => {
  const fallbackData = fallbackBibleContent[book];
  if (fallbackData && fallbackData.chapters[chapter.toString()]) {
    return fallbackData.chapters[chapter.toString()];
  }
  return [];
};

// Comprehensive fallback Bible content for all 66 books
export const fallbackBibleContent: BibleContent = {
  // Old Testament
  genesis: {
    name: 'Genesis',
    chapters: {
      '1': [
        { verse: 1, text: "In the beginning God created the heavens and the earth." },
        { verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
        { verse: 3, text: "And God said, \"Let there be light,\" and there was light." },
        { verse: 27, text: "So God created mankind in his own image, in the image of God he created them; male and female he created them." },
      ],
    }
  },
  exodus: {
    name: 'Exodus',
    chapters: {
      '20': [
        { verse: 3, text: "You shall have no other gods before me." },
        { verse: 4, text: "You shall not make idols." },
        { verse: 7, text: "You shall not misuse the name of the LORD your God." },
        { verse: 8, text: "Remember the Sabbath day by keeping it holy." },
      ],
    }
  },
  leviticus: {
    name: 'Leviticus',
    chapters: {
      '19': [
        { verse: 18, text: "Do not seek revenge or bear a grudge against anyone among your people, but love your neighbor as yourself. I am the LORD." },
      ],
    }
  },
  numbers: {
    name: 'Numbers',
    chapters: {
      '6': [
        { verse: 24, text: "The LORD bless you and keep you;" },
        { verse: 25, text: "the LORD make his face shine on you and be gracious to you;" },
        { verse: 26, text: "the LORD turn his face toward you and give you peace." },
      ],
    }
  },
  deuteronomy: {
    name: 'Deuteronomy',
    chapters: {
      '6': [
        { verse: 4, text: "Hear, O Israel: The LORD our God, the LORD is one." },
        { verse: 5, text: "Love the LORD your God with all your heart and with all your soul and with all your strength." },
      ],
    }
  },
  joshua: {
    name: 'Joshua',
    chapters: {
      '1': [
        { verse: 9, text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." },
      ],
    }
  },
  judges: {
    name: 'Judges',
    chapters: {
      '21': [
        { verse: 25, text: "In those days Israel had no king; everyone did as they saw fit." },
      ],
    }
  },
  ruth: {
    name: 'Ruth',
    chapters: {
      '1': [
        { verse: 16, text: "But Ruth replied, \"Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.\"" },
      ],
    }
  },
  '1samuel': {
    name: '1 Samuel',
    chapters: {
      '16': [
        { verse: 7, text: "But the LORD said to Samuel, \"Do not consider his appearance or his height, for I have rejected him. The LORD does not look at the things people look at. People look at the outward appearance, but the LORD looks at the heart.\"" },
      ],
    }
  },
  '2samuel': {
    name: '2 Samuel',
    chapters: {
      '7': [
        { verse: 22, text: "How great you are, Sovereign LORD! There is no one like you, and there is no God but you, as we have heard with our own ears." },
      ],
    }
  },
  '1kings': {
    name: '1 Kings',
    chapters: {
      '3': [
        { verse: 9, text: "So give your servant a discerning heart to govern your people and to distinguish between right and wrong. For who is able to govern this great people of yours?" },
      ],
    }
  },
  '2kings': {
    name: '2 Kings',
    chapters: {
      '6': [
        { verse: 16, text: "\"Don't be afraid,\" the prophet answered. \"Those who are with us are more than those who are with them.\"" },
      ],
    }
  },
  '1chronicles': {
    name: '1 Chronicles',
    chapters: {
      '16': [
        { verse: 11, text: "Look to the LORD and his strength; seek his face always." },
      ],
    }
  },
  '2chronicles': {
    name: '2 Chronicles',
    chapters: {
      '7': [
        { verse: 14, text: "if my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land." },
      ],
    }
  },
  ezra: {
    name: 'Ezra',
    chapters: {
      '7': [
        { verse: 10, text: "For Ezra had devoted himself to the study and observance of the Law of the LORD, and to teaching its decrees and laws in Israel." },
      ],
    }
  },
  nehemiah: {
    name: 'Nehemiah',
    chapters: {
      '8': [
        { verse: 10, text: "Nehemiah said, \"Go and enjoy choice food and sweet drinks, and send some to those who have nothing prepared. This day is holy to our Lord. Do not grieve, for the joy of the LORD is your strength.\"" },
      ],
    }
  },
  esther: {
    name: 'Esther',
    chapters: {
      '4': [
        { verse: 14, text: "For if you remain silent at this time, relief and deliverance for the Jews will arise from another place, but you and your father's family will perish. And who knows but that you have come to your royal position for such a time as this?" },
      ],
    }
  },
  job: {
    name: 'Job',
    chapters: {
      '19': [
        { verse: 25, text: "I know that my redeemer lives, and that in the end he will stand on the earth." },
      ],
    }
  },
  psalms: {
    name: 'Psalms',
    chapters: {
      '1': [
        { verse: 1, text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers," },
        { verse: 2, text: "but whose delight is in the law of the LORD, and who meditates on his law day and night." },
        { verse: 3, text: "That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers." },
      ],
      '23': [
        { verse: 1, text: "The LORD is my shepherd, I lack nothing." },
        { verse: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
        { verse: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
        { verse: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
        { verse: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
        { verse: 6, text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever." },
      ],
      '46': [
        { verse: 1, text: "God is our refuge and strength, an ever-present help in trouble." },
        { verse: 10, text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth." },
      ],
      '100': [
        { verse: 1, text: "Shout for joy to the LORD, all the earth." },
        { verse: 2, text: "Worship the LORD with gladness; come before him with joyful songs." },
        { verse: 3, text: "Know that the LORD is God. It is he who made us, and we are his; we are his people, the sheep of his pasture." },
        { verse: 4, text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name." },
        { verse: 5, text: "For the LORD is good and his love endures forever; his faithfulness continues through all generations." },
      ],
    }
  },
  proverbs: {
    name: 'Proverbs',
    chapters: {
      '3': [
        { verse: 5, text: "Trust in the LORD with all your heart and lean not on your own understanding;" },
        { verse: 6, text: "in all your ways submit to him, and he will make your paths straight." },
      ],
    }
  },
  ecclesiastes: {
    name: 'Ecclesiastes',
    chapters: {
      '3': [
        { verse: 1, text: "There is a time for everything, and a season for every activity under the heavens:" },
      ],
    }
  },
  songofsolomon: {
    name: 'Song of Solomon',
    chapters: {
      '2': [
        { verse: 10, text: "My beloved spoke and said to me, \"Arise, my darling, my beautiful one, come with me.\"" },
      ],
    }
  },
  isaiah: {
    name: 'Isaiah',
    chapters: {
      '41': [
        { verse: 10, text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand." },
      ],
      '53': [
        { verse: 5, text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed." },
      ],
    }
  },
  jeremiah: {
    name: 'Jeremiah',
    chapters: {
      '29': [
        { verse: 11, text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you hope and a future." },
      ],
    }
  },
  lamentations: {
    name: 'Lamentations',
    chapters: {
      '3': [
        { verse: 22, text: "Because of the LORD's great love we are not consumed, for his compassions never fail." },
        { verse: 23, text: "They are new every morning; great is your faithfulness." },
      ],
    }
  },
  ezekiel: {
    name: 'Ezekiel',
    chapters: {
      '36': [
        { verse: 26, text: "I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh." },
      ],
    }
  },
  daniel: {
    name: 'Daniel',
    chapters: {
      '3': [
        { verse: 17, text: "If we are thrown into the blazing furnace, the God we serve is able to deliver us from it, and he will deliver us from Your Majesty's hand." },
      ],
    }
  },
  hosea: {
    name: 'Hosea',
    chapters: {
      '6': [
        { verse: 6, text: "For I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings." },
      ],
    }
  },
  joel: {
    name: 'Joel',
    chapters: {
      '2': [
        { verse: 28, text: "And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions." },
      ],
    }
  },
  amos: {
    name: 'Amos',
    chapters: {
      '5': [
        { verse: 24, text: "But let justice roll on like a river, righteousness like a never-failing stream!" },
      ],
    }
  },
  obadiah: {
    name: 'Obadiah',
    chapters: {
      '1': [
        { verse: 15, text: "The day of the LORD is near for all nations. As you have done, it will be done to you; your deeds will return upon your own head." },
      ],
    }
  },
  jonah: {
    name: 'Jonah',
    chapters: {
      '2': [
        { verse: 8, text: "Those who cling to worthless idols turn away from God's love for them." },
      ],
    }
  },
  micah: {
    name: 'Micah',
    chapters: {
      '6': [
        { verse: 8, text: "He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God." },
      ],
    }
  },
  nahum: {
    name: 'Nahum',
    chapters: {
      '1': [
        { verse: 7, text: "The LORD is good, a refuge in times of trouble. He cares for those who trust in him," },
      ],
    }
  },
  habakkuk: {
    name: 'Habakkuk',
    chapters: {
      '3': [
        { verse: 19, text: "The Sovereign LORD is my strength; he makes my feet like the feet of a deer, he enables me to tread on the heights." },
      ],
    }
  },
  zephaniah: {
    name: 'Zephaniah',
    chapters: {
      '3': [
        { verse: 17, text: "The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing." },
      ],
    }
  },
  haggai: {
    name: 'Haggai',
    chapters: {
      '2': [
        { verse: 4, text: "But now be strong, Zerubbabel,' declares the LORD. 'Be strong, Joshua son of Jozadak, the high priest. Be strong, all you people of the land,' declares the LORD, 'and work. For I am with you,' declares the LORD Almighty." },
      ],
    }
  },
  zechariah: {
    name: 'Zechariah',
    chapters: {
      '4': [
        { verse: 6, text: "So he said to me, \"This is the word of the LORD to Zerubbabel: 'Not by might nor by power, but by my Spirit,' says the LORD Almighty.\"" },
      ],
    }
  },
  malachi: {
    name: 'Malachi',
    chapters: {
      '3': [
        { verse: 10, text: "Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this,\" says the LORD Almighty, \"and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it." },
      ],
    }
  },
  
  // New Testament
  matthew: {
    name: 'Matthew',
    chapters: {
      '5': [
        { verse: 3, text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven." },
        { verse: 4, text: "Blessed are those who mourn, for they will be comforted." },
        { verse: 16, text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven." },
      ],
      '11': [
        { verse: 28, text: "Come to me, all you who are weary and burdened, and I will give you rest." },
        { verse: 29, text: "Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls." },
        { verse: 30, text: "For my yoke is easy and my burden is light." },
      ],
      '28': [
        { verse: 19, text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit," },
        { verse: 20, text: "and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age." },
      ],
    }
  },
  mark: {
    name: 'Mark',
    chapters: {
      '16': [
        { verse: 15, text: "He said to them, \"Go into all the world and preach the gospel to all creation.\"" },
      ],
    }
  },
  luke: {
    name: 'Luke',
    chapters: {
      '4': [
        { verse: 18, text: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the prisoners and recovery of sight for the blind, to set the oppressed free," },
      ],
    }
  },
  john: {
    name: 'John',
    chapters: {
      '1': [
        { verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { verse: 2, text: "He was with God in the beginning." },
        { verse: 3, text: "Through him all things were made; without him nothing was made that has been made." },
        { verse: 4, text: "In him was life, and that life was the light of all mankind." },
        { verse: 5, text: "The light shines in the darkness, and the darkness has not overcome it." },
        { verse: 14, text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth." },
      ],
      '3': [
        { verse: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
        { verse: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
      ],
      '14': [
        { verse: 1, text: "Do not let your hearts be troubled. You believe in God; believe also in me." },
        { verse: 6, text: "Jesus answered, \"I am the way and the truth and the life. No one comes to the Father except through me.\"" },
      ],
    }
  },
  acts: {
    name: 'Acts',
    chapters: {
      '1': [
        { verse: 8, text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth." },
      ],
    }
  },
  romans: {
    name: 'Romans',
    chapters: {
      '3': [
        { verse: 23, text: "for all have sinned and fall short of the glory of God," },
        { verse: 24, text: "and all are justified freely by his grace through the redemption that came by Christ Jesus." },
      ],
      '8': [
        { verse: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
        { verse: 31, text: "What, then, shall we say in response to these things? If God is for us, who can be against us?" },
        { verse: 38, text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers," },
        { verse: 39, text: "neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord." },
      ],
      '12': [
        { verse: 1, text: "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship." },
        { verse: 2, text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will." },
      ],
    }
  },
  '1corinthians': {
    name: '1 Corinthians',
    chapters: {
      '13': [
        { verse: 4, text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud." },
        { verse: 13, text: "And now these three remain: faith, hope and love. But the greatest of these is love." },
      ],
    }
  },
  '2corinthians': {
    name: '2 Corinthians',
    chapters: {
      '5': [
        { verse: 17, text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!" },
      ],
    }
  },
  galatians: {
    name: 'Galatians',
    chapters: {
      '5': [
        { verse: 22, text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness," },
        { verse: 23, text: "gentleness and self-control. Against such things there is no law." },
      ],
    }
  },
  ephesians: {
    name: 'Ephesians',
    chapters: {
      '2': [
        { verse: 8, text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—" },
        { verse: 9, text: "not by works, so that no one can boast." },
      ],
    }
  },
  philippians: {
    name: 'Philippians',
    chapters: {
      '4': [
        { verse: 4, text: "Rejoice in the Lord always. I will say it again: Rejoice!" },
        { verse: 6, text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
        { verse: 7, text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." },
        { verse: 13, text: "I can do all this through him who gives me strength." },
      ],
    }
  },
  colossians: {
    name: 'Colossians',
    chapters: {
      '3': [
        { verse: 12, text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience." },
      ],
    }
  },
  '1thessalonians': {
    name: '1 Thessalonians',
    chapters: {
      '5': [
        { verse: 16, text: "Rejoice always," },
        { verse: 17, text: "pray continually," },
        { verse: 18, text: "give thanks in all circumstances; for this is God's will for you in Christ Jesus." },
      ],
    }
  },
  '2thessalonians': {
    name: '2 Thessalonians',
    chapters: {
      '3': [
        { verse: 16, text: "Now may the Lord of peace himself give you peace at all times and in every way. The Lord be with all of you." },
      ],
    }
  },
  '1timothy': {
    name: '1 Timothy',
    chapters: {
      '4': [
        { verse: 12, text: "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity." },
      ],
    }
  },
  '2timothy': {
    name: '2 Timothy',
    chapters: {
      '3': [
        { verse: 16, text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness," },
      ],
    }
  },
  titus: {
    name: 'Titus',
    chapters: {
      '3': [
        { verse: 5, text: "he saved us through the washing of rebirth and renewal by the Holy Spirit," },
      ],
    }
  },
  philemon: {
    name: 'Philemon',
    chapters: {
      '1': [
        { verse: 6, text: "I pray that your partnership with us in the faith may be effective in deepening your understanding of every good thing we share for the sake of Christ." },
      ],
    }
  },
  hebrews: {
    name: 'Hebrews',
    chapters: {
      '11': [
        { verse: 1, text: "Now faith is confidence in what we hope for and assurance about what we do not see." },
      ],
    }
  },
  james: {
    name: 'James',
    chapters: {
      '1': [
        { verse: 2, text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds," },
        { verse: 3, text: "because you know that the testing of your faith produces perseverance." },
      ],
    }
  },
  '1peter': {
    name: '1 Peter',
    chapters: {
      '5': [
        { verse: 7, text: "Cast all your anxiety on him because he cares for you." },
      ],
    }
  },
  '2peter': {
    name: '2 Peter',
    chapters: {
      '3': [
        { verse: 9, text: "The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you, not wanting anyone to perish, but everyone to come to repentance." },
      ],
    }
  },
  '1john': {
    name: '1 John',
    chapters: {
      '4': [
        { verse: 8, text: "Whoever does not love does not know God, because God is love." },
        { verse: 19, text: "We love because he first loved us." },
      ],
    }
  },
  '2john': {
    name: '2 John',
    chapters: {
      '1': [
        { verse: 6, text: "And this is love: that we walk in obedience to his commands. As you have heard from the beginning, his command is that you walk in love." },
      ],
    }
  },
  '3john': {
    name: '3 John',
    chapters: {
      '1': [
        { verse: 4, text: "I have no greater joy than to hear that my children are walking in the truth." },
      ],
    }
  },
  jude: {
    name: 'Jude',
    chapters: {
      '1': [
        { verse: 24, text: "To him who is able to keep you from stumbling and to present you before his glorious presence without fault and with great joy—" },
      ],
    }
  },
  revelation: {
    name: 'Revelation',
    chapters: {
      '21': [
        { verse: 4, text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away." },
      ],
    }
  },
};

// Main export - will use API when available, fallback when not
export const bibleContent = fallbackBibleContent;