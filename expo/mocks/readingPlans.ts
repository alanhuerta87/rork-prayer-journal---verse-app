import { ReadingPlan } from '@/types';

export const readingPlans: ReadingPlan[] = [
  {
    id: 'one-year-chronological',
    name: 'One Year Chronological',
    description: 'Read through the entire Bible in chronological order over 365 days',
    duration: 365,
    readings: [
      // Day 1
      {
        day: 1,
        readings: [
          { bookId: 'genesis', chapter: 1 },
          { bookId: 'genesis', chapter: 2 },
          { bookId: 'genesis', chapter: 3 }
        ]
      },
      // Day 2
      {
        day: 2,
        readings: [
          { bookId: 'genesis', chapter: 4 },
          { bookId: 'genesis', chapter: 5 },
          { bookId: 'genesis', chapter: 6 }
        ]
      },
      // Day 3
      {
        day: 3,
        readings: [
          { bookId: 'genesis', chapter: 7 },
          { bookId: 'genesis', chapter: 8 },
          { bookId: 'genesis', chapter: 9 }
        ]
      },
      // Day 4
      {
        day: 4,
        readings: [
          { bookId: 'genesis', chapter: 10 },
          { bookId: 'genesis', chapter: 11 },
          { bookId: 'genesis', chapter: 12 }
        ]
      },
      // Day 5
      {
        day: 5,
        readings: [
          { bookId: 'genesis', chapter: 13 },
          { bookId: 'genesis', chapter: 14 },
          { bookId: 'genesis', chapter: 15 }
        ]
      },
      // Continue pattern for more days...
      // For demo purposes, adding a few more days
      {
        day: 6,
        readings: [
          { bookId: 'genesis', chapter: 16 },
          { bookId: 'genesis', chapter: 17 },
          { bookId: 'genesis', chapter: 18 }
        ]
      },
      {
        day: 7,
        readings: [
          { bookId: 'genesis', chapter: 19 },
          { bookId: 'genesis', chapter: 20 },
          { bookId: 'genesis', chapter: 21 }
        ]
      }
    ]
  },
  {
    id: 'six-month-new-testament',
    name: '6 Month New Testament',
    description: 'Read through the New Testament in 6 months with daily devotions',
    duration: 180,
    readings: [
      // Day 1
      {
        day: 1,
        readings: [
          { bookId: 'matthew', chapter: 1 },
          { bookId: 'matthew', chapter: 2 }
        ]
      },
      // Day 2
      {
        day: 2,
        readings: [
          { bookId: 'matthew', chapter: 3 },
          { bookId: 'matthew', chapter: 4 }
        ]
      },
      // Day 3
      {
        day: 3,
        readings: [
          { bookId: 'matthew', chapter: 5 }
        ]
      },
      // Day 4
      {
        day: 4,
        readings: [
          { bookId: 'matthew', chapter: 6 },
          { bookId: 'matthew', chapter: 7 }
        ]
      },
      // Day 5
      {
        day: 5,
        readings: [
          { bookId: 'matthew', chapter: 8 },
          { bookId: 'matthew', chapter: 9 }
        ]
      }
    ]
  },
  {
    id: 'psalms-proverbs-30-days',
    name: '30 Days of Wisdom',
    description: 'Read through Psalms and Proverbs for daily wisdom and worship',
    duration: 30,
    readings: [
      {
        day: 1,
        readings: [
          { bookId: 'psalms', chapter: 1 },
          { bookId: 'proverbs', chapter: 1 }
        ]
      },
      {
        day: 2,
        readings: [
          { bookId: 'psalms', chapter: 2 },
          { bookId: 'proverbs', chapter: 2 }
        ]
      },
      {
        day: 3,
        readings: [
          { bookId: 'psalms', chapter: 3 },
          { bookId: 'proverbs', chapter: 3 }
        ]
      },
      {
        day: 4,
        readings: [
          { bookId: 'psalms', chapter: 4 },
          { bookId: 'proverbs', chapter: 4 }
        ]
      },
      {
        day: 5,
        readings: [
          { bookId: 'psalms', chapter: 5 },
          { bookId: 'proverbs', chapter: 5 }
        ]
      }
    ]
  },
  {
    id: 'gospels-90-days',
    name: '90 Days Through the Gospels',
    description: 'Journey through the life of Jesus in Matthew, Mark, Luke, and John',
    duration: 90,
    readings: [
      {
        day: 1,
        readings: [
          { bookId: 'matthew', chapter: 1 },
          { bookId: 'matthew', chapter: 2 }
        ]
      },
      {
        day: 2,
        readings: [
          { bookId: 'matthew', chapter: 3 },
          { bookId: 'matthew', chapter: 4 }
        ]
      },
      {
        day: 3,
        readings: [
          { bookId: 'matthew', chapter: 5 }
        ]
      }
    ]
  }
];

export const getPrayerCategories = (): { id: PrayerCategory; name: string; description: string; color: string }[] => [
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Prayers of thanksgiving and appreciation',
    color: '#10B981' // green
  },
  {
    id: 'requests',
    name: 'Requests',
    description: 'Personal needs and petitions',
    color: '#3B82F6' // blue
  },
  {
    id: 'intercession',
    name: 'Intercession',
    description: 'Prayers for others',
    color: '#8B5CF6' // purple
  },
  {
    id: 'praise',
    name: 'Praise',
    description: 'Worship and adoration',
    color: '#F59E0B' // amber
  },
  {
    id: 'confession',
    name: 'Confession',
    description: 'Repentance and forgiveness',
    color: '#EF4444' // red
  },
  {
    id: 'general',
    name: 'General',
    description: 'Other prayers and reflections',
    color: '#6B7280' // gray
  }
];

export const getPrayerStatuses = (): { id: PrayerStatus; name: string; description: string; color: string }[] => [
  {
    id: 'ongoing',
    name: 'Ongoing',
    description: 'Currently praying about this',
    color: '#3B82F6' // blue
  },
  {
    id: 'answered',
    name: 'Answered',
    description: 'God has answered this prayer',
    color: '#10B981' // green
  },
  {
    id: 'archived',
    name: 'Archived',
    description: 'No longer actively praying about this',
    color: '#6B7280' // gray
  }
];

import { PrayerCategory, PrayerStatus } from '@/types';