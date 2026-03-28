import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Alert } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { Send, Tag, Plus, X } from 'lucide-react-native';
import { PrayerCategory } from '@/types';
import { getPrayerCategories } from '@/mocks/readingPlans';

interface PrayerInputProps {
  onSubmit?: () => void;
}

export const PrayerInput: React.FC<PrayerInputProps> = ({ onSubmit }) => {
  const { colors } = useThemeStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>('general');
  const [notes, setNotes] = useState('');
  const [selectedCustomTags, setSelectedCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const { addPrayer, customTags, addCustomTag, removeCustomTag } = usePrayerStore();
  
  const categories = getPrayerCategories();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    
    addPrayer({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      notes: notes.trim() || undefined,
      customTags: selectedCustomTags.length > 0 ? selectedCustomTags : undefined,
    });
    
    setTitle('');
    setContent('');
    setNotes('');
    setSelectedCategory('general');
    setSelectedCustomTags([]);
    setNewTagInput('');
    Keyboard.dismiss();
    
    if (onSubmit) {
      onSubmit();
    }
  };

  const isDisabled = !title.trim() || !content.trim();

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

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.card,
      shadowColor: colors.black,
    }]}>
      <Text style={[styles.label, { color: colors.primary }]}>Today's Prayer</Text>
      
      <TextInput
        style={[styles.titleInput, { 
          backgroundColor: colors.gray[100],
          color: colors.text,
        }]}
        placeholder="Prayer Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.gray[400]}
      />
      
      <TextInput
        style={[styles.contentInput, { 
          backgroundColor: colors.gray[100],
          color: colors.text,
        }]}
        placeholder="Write your prayer here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.gray[400]}
      />
      
      {/* Category Selection */}
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Tag size={16} color={colors.primary} />
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Category</Text>
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
      <View style={styles.customTagsSection}>
        <View style={styles.categoryHeader}>
          <Tag size={16} color={colors.primary} />
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Custom Tags</Text>
        </View>
        
        {/* Add New Tag Input */}
        <View style={styles.newTagContainer}>
          <TextInput
            style={[styles.newTagInput, { 
              backgroundColor: colors.gray[100],
              color: colors.text,
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
      
      <TextInput
        style={[styles.notesInput, { 
          backgroundColor: colors.gray[100],
          color: colors.text,
        }]}
        placeholder="Additional notes (optional)..."
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.gray[400]}
      />
      
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
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  contentInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    marginBottom: 16,
  },
  customTagsSection: {
    marginBottom: 16,
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newTagInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginRight: 8,
  },
  addTagButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTagsScroll: {
    flexDirection: 'row',
  },
  customTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  customTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  customTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeTagButton: {
    marginLeft: 4,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});