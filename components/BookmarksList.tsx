import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { useRouter } from 'expo-router';
import { Bookmark, Trash2, Book } from 'lucide-react-native';
import { bibleBooks } from '@/constants/colors';

export const BookmarksList: React.FC = () => {
  const { colors } = useThemeStore();
  const { getBookmarks, removeBookmark } = usePrayerStore();
  const router = useRouter();
  
  const bookmarks = getBookmarks();
  
  const handleBookmarkPress = (bookId: string, chapter: number) => {
    router.push({
      pathname: '/bible/reader',
      params: { book: bookId }
    });
  };
  
  const handleRemoveBookmark = (bookId: string, chapter: number) => {
    removeBookmark(bookId, chapter);
  };
  
  const getBookName = (bookId: string) => {
    const book = bibleBooks.find(b => b.id === bookId);
    return book?.name || bookId;
  };
  
  if (bookmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Bookmark size={48} color={colors.gray[300]} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookmarks Yet</Text>
        <Text style={[styles.emptyMessage, { color: colors.textLight }]}>
          Bookmark chapters while reading to save your place
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => `${item.bookId}-${item.chapter}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.bookmarkItem, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.gray[200]
          }]}
          onPress={() => handleBookmarkPress(item.bookId, item.chapter)}
          activeOpacity={0.7}
        >
          <View style={styles.bookmarkContent}>
            <Book size={20} color={colors.primary} style={styles.bookIcon} />
            <View style={styles.bookmarkInfo}>
              <Text style={[styles.bookmarkTitle, { color: colors.text }]}>
                {getBookName(item.bookId)} {item.chapter}
              </Text>
              <Text style={[styles.bookmarkSubtitle, { color: colors.textLight }]}>
                {item.translation.toUpperCase()} • {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveBookmark(item.bookId, item.chapter)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookIcon: {
    marginRight: 12,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookmarkSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
});