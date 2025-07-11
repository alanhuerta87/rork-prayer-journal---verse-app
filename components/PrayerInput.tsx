import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { Send } from 'lucide-react-native';

interface PrayerInputProps {
  onSubmit?: () => void;
}

export const PrayerInput: React.FC<PrayerInputProps> = ({ onSubmit }) => {
  const { colors } = useThemeStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addPrayer } = usePrayerStore();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    
    addPrayer({
      title: title.trim(),
      content: content.trim(),
    });
    
    setTitle('');
    setContent('');
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
});