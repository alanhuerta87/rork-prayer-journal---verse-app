import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Prayer } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { Heart, Edit, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePrayerStore } from '@/store/prayerStore';

interface PrayerCardProps {
  prayer: Prayer;
  compact?: boolean;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, compact = false }) => {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { toggleFavorite, deletePrayer } = usePrayerStore();
  
  const formattedDate = new Date(prayer.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleEdit = () => {
    router.push(`/prayer/${prayer.id}`);
  };

  const handleDelete = () => {
    deletePrayer(prayer.id);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(prayer.id);
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { borderBottomColor: colors.gray[200] }]} 
        onPress={handleEdit}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>{prayer.title}</Text>
          <Text style={[styles.compactDate, { color: colors.gray[500] }]}>{formattedDate}</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleToggleFavorite}
        >
          <Heart 
            size={16} 
            color={prayer.isFavorite ? colors.secondary : colors.gray[400]} 
            fill={prayer.isFavorite ? colors.secondary : 'none'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.card,
      shadowColor: colors.black,
      borderColor: colors.gray[200],
    }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{prayer.title}</Text>
        <Text style={[styles.date, { color: colors.gray[500] }]}>{formattedDate}</Text>
      </View>
      
      <Text style={[styles.content, { color: colors.textLight }]} numberOfLines={3}>
        {prayer.content}
      </Text>
      
      {prayer.notes && (
        <View style={[styles.notesContainer, { backgroundColor: colors.gray[100] }]}>
          <Text style={[styles.notesLabel, { color: colors.gray[600] }]}>Notes:</Text>
          <Text style={[styles.notes, { color: colors.gray[700] }]} numberOfLines={2}>{prayer.notes}</Text>
        </View>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.favoriteButton, { backgroundColor: colors.gray[100] }]} 
          onPress={handleToggleFavorite}
        >
          <Heart 
            size={18} 
            color={prayer.isFavorite ? colors.secondary : colors.gray[500]} 
            fill={prayer.isFavorite ? colors.secondary : 'none'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton, { backgroundColor: colors.gray[100] }]} 
          onPress={handleEdit}
        >
          <Edit size={18} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: colors.gray[100] }]} 
          onPress={handleDelete}
        >
          <Trash2 size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  notesContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  favoriteButton: {
  },
  editButton: {
  },
  deleteButton: {
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  compactDate: {
    fontSize: 12,
  },
});