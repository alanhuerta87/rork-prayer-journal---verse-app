import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePrayerStore } from '@/store/prayerStore';
import { useThemeStore } from '@/store/themeStore';
import { Save, Trash2, Heart, PlusCircle } from 'lucide-react-native';

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useThemeStore();
  const { prayers, updatePrayer, deletePrayer, addPrayer } = usePrayerStore();
  
  const isNewPrayer = id === 'new';
  const existingPrayer = !isNewPrayer ? prayers.find(p => p.id === id) : null;
  
  const [title, setTitle] = useState(existingPrayer?.title || '');
  const [content, setContent] = useState(existingPrayer?.content || '');
  const [notes, setNotes] = useState(existingPrayer?.notes || '');
  const [isFavorite, setIsFavorite] = useState(existingPrayer?.isFavorite || false);
  const [showAddendum, setShowAddendum] = useState(false);
  const [addendum, setAddendum] = useState('');

  useEffect(() => {
    if (!isNewPrayer && !existingPrayer) {
      Alert.alert('Error', 'Prayer not found');
      router.back();
    }
  }, [existingPrayer, isNewPrayer, router]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and prayer content are required');
      return;
    }

    // If there's an addendum, append it to the content
    const updatedContent = addendum.trim() 
      ? `${content.trim()}\n\n--- ${new Date().toLocaleDateString()} ---\n${addendum.trim()}`
      : content.trim();

    if (isNewPrayer) {
      addPrayer({
        title: title.trim(),
        content: updatedContent,
        notes: notes.trim(),
      });
    } else if (existingPrayer) {
      updatePrayer({
        ...existingPrayer,
        title: title.trim(),
        content: updatedContent,
        notes: notes.trim(),
        isFavorite,
      });
    }

    router.back();
  };

  const handleDelete = () => {
    if (isNewPrayer) {
      router.back();
      return;
    }

    Alert.alert(
      'Delete Prayer',
      'Are you sure you want to delete this prayer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deletePrayer(id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleAddendum = () => {
    setShowAddendum(!showAddendum);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.text }]}>Title</Text>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <Heart 
              size={24} 
              color={isFavorite ? colors.secondary : colors.gray[400]} 
              fill={isFavorite ? colors.secondary : 'none'} 
            />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={[styles.titleInput, { 
            backgroundColor: colors.card,
            borderColor: colors.gray[200],
            color: colors.text,
          }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Prayer Title"
          placeholderTextColor={colors.gray[400]}
        />
        
        <Text style={[styles.label, { color: colors.text }]}>Prayer</Text>
        <TextInput
          style={[styles.contentInput, { 
            backgroundColor: colors.card,
            borderColor: colors.gray[200],
            color: colors.text,
          }]}
          value={content}
          onChangeText={setContent}
          placeholder="Write your prayer here..."
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.gray[400]}
          editable={isNewPrayer} // Only editable if it's a new prayer
        />
        
        {!isNewPrayer && (
          <>
            <View style={styles.addendumHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Add to Prayer</Text>
              <TouchableOpacity 
                style={[styles.addendumButton, { backgroundColor: colors.primary }]} 
                onPress={toggleAddendum}
                activeOpacity={0.7}
              >
                <PlusCircle size={20} color={colors.white} />
                <Text style={[styles.addendumButtonText, { color: colors.white }]}>
                  {showAddendum ? 'Cancel' : 'Add to Prayer'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showAddendum && (
              <TextInput
                style={[styles.addendumInput, { 
                  backgroundColor: colors.card,
                  borderColor: colors.gray[200],
                  color: colors.text,
                }]}
                value={addendum}
                onChangeText={setAddendum}
                placeholder="Add to your existing prayer..."
                multiline
                textAlignVertical="top"
                placeholderTextColor={colors.gray[400]}
              />
            )}
          </>
        )}
        
        <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
        <TextInput
          style={[styles.notesInput, { 
            backgroundColor: colors.card,
            borderColor: colors.gray[200],
            color: colors.text,
          }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add personal notes, reflections, or answered prayers..."
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.gray[400]}
        />
      </ScrollView>
      
      <View style={[styles.footer, { 
        backgroundColor: colors.card,
        borderTopColor: colors.gray[200],
      }]}>
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: colors.gray[100] }]} 
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={24} color={colors.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={[styles.saveButtonText, { color: colors.white }]}>Save Prayer</Text>
          <Save size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  contentInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 16,
    borderWidth: 1,
  },
  addendumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addendumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addendumButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addendumInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
  },
  notesInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
});