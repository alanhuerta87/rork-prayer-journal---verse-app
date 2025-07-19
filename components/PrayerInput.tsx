import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { Send, Tag } from 'lucide-react-native';
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
  const { addPrayer } = usePrayerStore();
  
  const categories = getPrayerCategories();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    
    addPrayer({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      notes: notes.trim() || undefined,
    });
    
    setTitle('');
    setContent('');
    setNotes('');
    setSelectedCategory('general');
    Keyboard.dismiss();
    
    if (onSubmit) {
      onSubmit();
    }
  };

  const isDisabled = !title.trim() || !content.trim();

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
});