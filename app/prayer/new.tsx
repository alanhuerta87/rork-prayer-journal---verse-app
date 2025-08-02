import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { Send, Tag, ArrowLeft, Plus, X } from 'lucide-react-native';
import { PrayerCategory } from '@/types';
import { getPrayerCategories } from '@/mocks/readingPlans';

export default function NewPrayerScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { addPrayer, customTags, addCustomTag, removeCustomTag } = usePrayerStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>('general');
  const [notes, setNotes] = useState('');
  const [selectedCustomTags, setSelectedCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  
  const categories = getPrayerCategories();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please enter both a title and prayer content.');
      return;
    }
    
    addPrayer({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      notes: notes.trim() || undefined,
      customTags: selectedCustomTags.length > 0 ? selectedCustomTags : undefined,
    });
    
    Alert.alert('Prayer Saved', 'Your prayer has been added to your journal.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleBack = () => {
    if (title.trim() || content.trim() || notes.trim() || selectedCustomTags.length > 0) {
      Alert.alert(
        'Discard Prayer?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleAddCustomTag = () => {
    const trimmedTag = newTagInput.trim();
    if (!trimmedTag) return;
    
    if (customTags.includes(trimmedTag)) {
      Alert.alert('Tag exists', 'This tag already exists in your custom tags.');
      return;
    }
    
    addCustomTag(trimmedTag);
    setSelectedCustomTags([...selectedCustomTags, trimmedTag]);
    setNewTagInput('');
  };

  const handleToggleCustomTag = (tag: string) => {
    if (selectedCustomTags.includes(tag)) {
      setSelectedCustomTags(selectedCustomTags.filter(t => t !== tag));
    } else {
      setSelectedCustomTags([...selectedCustomTags, tag]);
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    Alert.alert(
      'Remove Tag',
      `Are you sure you want to remove "${tag}" from your custom tags? This will remove it from all prayers.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeCustomTag(tag);
            setSelectedCustomTags(selectedCustomTags.filter(t => t !== tag));
          }
        }
      ]
    );
  };

  const isDisabled = !title.trim() || !content.trim();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'New Prayer',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Prayer Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.titleInput, { 
                backgroundColor: colors.gray[100],
                color: colors.text,
                borderColor: colors.gray[200],
              }]}
              placeholder="Enter prayer title..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.gray[400]}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Prayer</Text>
            <TextInput
              style={[styles.contentInput, { 
                backgroundColor: colors.gray[100],
                color: colors.text,
                borderColor: colors.gray[200],
              }]}
              placeholder="Write your prayer here..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor={colors.gray[400]}
            />
          </View>
          
          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <View style={styles.categoryHeader}>
              <Tag size={16} color={colors.primary} />
              <Text style={[styles.label, { color: colors.text, marginLeft: 6 }]}>Category</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { 
                      backgroundColor: selectedCategory === category.id ? category.color : colors.gray[100],
                      borderColor: category.color,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    { 
                      color: selectedCategory === category.id ? colors.white : colors.text 
                    }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Custom Tags Section */}
          <View style={styles.inputGroup}>
            <View style={styles.categoryHeader}>
              <Tag size={16} color={colors.primary} />
              <Text style={[styles.label, { color: colors.text, marginLeft: 6 }]}>Custom Tags</Text>
            </View>
            
            {/* Add New Tag Input */}
            <View style={styles.newTagContainer}>
              <TextInput
                style={[styles.newTagInput, { 
                  backgroundColor: colors.gray[100],
                  color: colors.text,
                  borderColor: colors.gray[200],
                }]}
                placeholder="Add custom tag..."
                value={newTagInput}
                onChangeText={setNewTagInput}
                placeholderTextColor={colors.gray[400]}
                onSubmitEditing={handleAddCustomTag}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addTagButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCustomTag}
                disabled={!newTagInput.trim()}
              >
                <Plus size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            {/* Custom Tags List */}
            {customTags.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customTagsScroll}>
                {customTags.map((tag) => (
                  <View key={tag} style={styles.customTagContainer}>
                    <TouchableOpacity
                      style={[
                        styles.customTagChip,
                        { 
                          backgroundColor: selectedCustomTags.includes(tag) ? colors.primary : colors.gray[100],
                          borderColor: colors.primary,
                        }
                      ]}
                      onPress={() => handleToggleCustomTag(tag)}
                    >
                      <Text style={[
                        styles.customTagText,
                        { 
                          color: selectedCustomTags.includes(tag) ? colors.white : colors.text 
                        }
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.removeTagButton, { backgroundColor: colors.error }]}
                      onPress={() => handleRemoveCustomTag(tag)}
                    >
                      <X size={12} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.notesInput, { 
                backgroundColor: colors.gray[100],
                color: colors.text,
                borderColor: colors.gray[200],
              }]}
              placeholder="Additional notes or reflections..."
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              placeholderTextColor={colors.gray[400]}
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.bottomContainer, { backgroundColor: colors.card, borderTopColor: colors.gray[200] }]}>
        <TouchableOpacity
          style={[
            styles.submitButton, 
            { backgroundColor: colors.primary },
            isDisabled && [styles.disabledButton, { backgroundColor: colors.gray[400] }]
          ]}
          onPress={handleSubmit}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.submitText, { color: colors.white }]}>Save Prayer</Text>
          <Send size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  contentInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
  },
  notesInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 80,
    borderWidth: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
  },
  submitText: {
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newTagInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    marginRight: 8,
    borderWidth: 1,
  },
  addTagButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTagsScroll: {
    flexDirection: 'row',
  },
  customTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  customTagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  customTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeTagButton: {
    marginLeft: 4,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});