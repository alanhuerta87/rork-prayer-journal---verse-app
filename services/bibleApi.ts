import { BibleVerse } from '@/types';
import { bibleTranslations, API_BOOK_MAPPINGS } from '@/constants/colors';

// Comprehensive Bible API service with multiple endpoints and fallbacks
export class BibleApiService {
  private static instance: BibleApiService;
  private cache: Map<string, any> = new Map();
  
  static getInstance(): BibleApiService {
    if (!BibleApiService.instance) {
      BibleApiService.instance = new BibleApiService();
    }
    return BibleApiService.instance;
  }
  
  // Primary API endpoints with different capabilities
  private apiEndpoints = [
    {
      name: 'Bible API',
      baseUrl: 'https://bible-api.com',
      supportsTranslations: ['kjv', 'niv', 'nlt', 'esv'],
      formatVerse: (book: string, chapter: number, verse: number, translation: string) => 
        `${book}+${chapter}:${verse}?translation=${translation}`,
      formatChapter: (book: string, chapter: number, translation: string) => 
        `${book}+${chapter}?translation=${translation}`,
    },
    {
      name: 'Labs Bible API',
      baseUrl: 'https://labs.bible.org/api',
      supportsTranslations: ['kjv', 'asv'],
      formatVerse: (book: string, chapter: number, verse: number, translation: string) => 
        `?passage=${encodeURIComponent(book)}%20${chapter}:${verse}&type=json&version=${translation}`,
      formatChapter: (book: string, chapter: number, translation: string) => 
        `?passage=${encodeURIComponent(book)}%20${chapter}&type=json&version=${translation}`,
    },
  ];
  
  async fetchVerse(
    bookId: string, 
    chapter: number, 
    verse: number, 
    translation: string = 'kjv'
  ): Promise<{ text: string; reference: string } | null> {
    const cacheKey = `${bookId}-${chapter}-${verse}-${translation}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const apiBook = API_BOOK_MAPPINGS[bookId] || bookId;
    const translationData = bibleTranslations.find(t => t.id === translation);
    const apiTranslation = translationData?.apiCode || 'kjv';
    
    // Try each API endpoint
    for (const endpoint of this.apiEndpoints) {
      if (!endpoint.supportsTranslations.includes(apiTranslation.toLowerCase())) {
        continue;
      }
      
      try {
        const url = `${endpoint.baseUrl}/${endpoint.formatVerse(apiBook, chapter, verse, apiTranslation)}`;
        console.log(`Trying ${endpoint.name}:`, url);
        
        const response = await this.fetchWithTimeout(url, 8000);
        
        if (response.ok) {
          const data = await response.json();
          const result = this.parseVerseResponse(data, apiBook, chapter, verse);
          
          if (result) {
            this.cache.set(cacheKey, result);
            return result;
          }
        }
      } catch (error) {
        console.log(`${endpoint.name} failed:`, error);
        continue;
      }
    }
    
    // Fallback to different translation if original fails
    if (translation !== 'kjv') {
      console.log('Trying fallback to KJV');
      return this.fetchVerse(bookId, chapter, verse, 'kjv');
    }
    
    return null;
  }
  
  async fetchChapter(
    bookId: string, 
    chapter: number, 
    translation: string = 'kjv'
  ): Promise<BibleVerse[]> {
    const cacheKey = `chapter-${bookId}-${chapter}-${translation}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const apiBook = API_BOOK_MAPPINGS[bookId] || bookId;
    const translationData = bibleTranslations.find(t => t.id === translation);
    const apiTranslation = translationData?.apiCode || 'kjv';
    
    // Try to fetch entire chapter first
    for (const endpoint of this.apiEndpoints) {
      if (!endpoint.supportsTranslations.includes(apiTranslation.toLowerCase())) {
        continue;
      }
      
      try {
        const url = `${endpoint.baseUrl}/${endpoint.formatChapter(apiBook, chapter, apiTranslation)}`;
        console.log(`Trying chapter from ${endpoint.name}:`, url);
        
        const response = await this.fetchWithTimeout(url, 12000);
        
        if (response.ok) {
          const data = await response.json();
          const verses = this.parseChapterResponse(data);
          
          if (verses.length > 0) {
            this.cache.set(cacheKey, verses);
            return verses;
          }
        }
      } catch (error) {
        console.log(`${endpoint.name} chapter fetch failed:`, error);
        continue;
      }
    }
    
    // If chapter fetch fails, try verse-by-verse
    console.log('Trying verse-by-verse fetch');
    const verses = await this.fetchVerseByVerse(bookId, chapter, translation);
    
    if (verses.length > 0) {
      this.cache.set(cacheKey, verses);
      return verses;
    }
    
    // Final fallback to KJV
    if (translation !== 'kjv') {
      console.log('Final fallback to KJV');
      return this.fetchChapter(bookId, chapter, 'kjv');
    }
    
    return [];
  }
  
  private async fetchVerseByVerse(
    bookId: string, 
    chapter: number, 
    translation: string,
    maxVerses: number = 50
  ): Promise<BibleVerse[]> {
    const verses: BibleVerse[] = [];
    const batchSize = 5;
    
    for (let startVerse = 1; startVerse <= maxVerses; startVerse += batchSize) {
      const batchPromises: Promise<{ verse: number; text: string } | null>[] = [];
      
      for (let verse = startVerse; verse < startVerse + batchSize && verse <= maxVerses; verse++) {
        batchPromises.push(
          this.fetchVerse(bookId, chapter, verse, translation).then(result => 
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
        
        // Rate limiting
        if (startVerse + batchSize <= maxVerses) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error(`Error fetching verse batch starting at ${startVerse}:`, error);
        break;
      }
    }
    
    return verses.sort((a, b) => a.verse - b.verse);
  }
  
  private parseVerseResponse(data: any, book: string, chapter: number, verse: number): { text: string; reference: string } | null {
    let text = '';
    let reference = '';
    
    if (data.text) {
      text = data.text;
      reference = data.reference || `${book} ${chapter}:${verse}`;
    } else if (data.verses && data.verses.length > 0) {
      text = data.verses[0].text;
      reference = data.verses[0].reference || `${book} ${chapter}:${verse}`;
    } else if (Array.isArray(data) && data.length > 0) {
      text = data[0].text || data[0].verse;
      reference = `${book} ${chapter}:${verse}`;
    } else if (typeof data === 'string') {
      text = data;
      reference = `${book} ${chapter}:${verse}`;
    }
    
    if (text && text.trim()) {
      return {
        text: text.trim(),
        reference: reference
      };
    }
    
    return null;
  }
  
  private parseChapterResponse(data: any): BibleVerse[] {
    let verses: BibleVerse[] = [];
    
    if (data.verses && Array.isArray(data.verses)) {
      verses = data.verses.map((verse: any, index: number) => ({
        verse: verse.verse || index + 1,
        text: verse.text || verse.content || ''
      }));
    } else if (Array.isArray(data)) {
      verses = data.map((verse: any, index: number) => ({
        verse: verse.verse || index + 1,
        text: verse.text || verse.verse || ''
      }));
    } else if (data.text) {
      verses = this.parseChapterText(data.text);
    }
    
    return verses.filter(v => v.text && v.text.trim());
  }
  
  private parseChapterText(text: string): BibleVerse[] {
    const verses: BibleVerse[] = [];
    
    // Try different verse parsing patterns
    const patterns = [
      /(\\d+)\\s+([^0-9]+?)(?=\\d+\\s|$)/g,
      /(\\d+)\\.?\\s*([^0-9]+?)(?=\\d+\\.?\\s*|$)/g,
    ];
    
    for (const pattern of patterns) {
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
  }
  
  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'MyPrayerJournal/1.0',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Validate if a chapter exists for a book
  async validateChapter(bookId: string, chapter: number, translation: string = 'kjv'): Promise<boolean> {
    try {
      const verses = await this.fetchChapter(bookId, chapter, translation);
      return verses.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
  
  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const bibleApi = BibleApiService.getInstance();