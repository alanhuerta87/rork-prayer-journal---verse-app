import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { PrayerCard } from '@/components/PrayerCard';
import { EmptyState } from '@/components/EmptyState';
import { usePrayerStore } from '@/store/prayerStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'expo-router';
import { Plus, Search, X } from 'lucide-react-native';

export default function PrayersScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { prayers } = usePrayerStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrayers = searchQuery
    ? prayers.filter(
        (prayer) =>
          prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prayer.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : prayers;

  const handleAddPrayer = () => {
    router.push('/prayer/new');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.gray[200],
      }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.gray[100] }]}>
          <Search size={18} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search prayers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[400]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPrayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PrayerCard prayer={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState type="prayers" onAction={handleAddPrayer} />
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { 
          backgroundColor: colors.primary,
          shadowColor: colors.black,
        }]}
        onPress={handleAddPrayer}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});