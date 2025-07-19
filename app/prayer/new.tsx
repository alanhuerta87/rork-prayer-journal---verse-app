import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { Send, Tag, ArrowLeft } from 'lucide-react-native';
import { PrayerCategory } from '@/types';
import { getPrayerCategories } from '@/mocks/readingPlans';

export default function NewPrayerScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { addPrayer } = usePrayerStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>('general');
  const [notes, setNotes] = useState('');
  
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
    });
    
    Alert.alert('Prayer Saved', 'Your prayer has been added to your journal.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleBack = () => {
    if (title.trim() || content.trim() || notes.trim()) {
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
});