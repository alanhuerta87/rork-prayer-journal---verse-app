import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { bibleTranslations } from '@/constants/colors';
import { BibleTranslation } from '@/types';
import { usePrayerStore } from '@/store/prayerStore';
import { useThemeStore } from '@/store/themeStore';

interface TranslationSelectorProps {
  onSelect?: (translation: BibleTranslation) => void;
}

export const TranslationSelector: React.FC<TranslationSelectorProps> = ({ onSelect }) => {
  const { preferredTranslation, setPreferredTranslation } = usePrayerStore();
  const { colors } = useThemeStore();

  const handleSelect = (translation: BibleTranslation) => {
    setPreferredTranslation(translation);
    if (onSelect) {
      onSelect(translation);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Bible Translation</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bibleTranslations.map((translation) => (
          <TouchableOpacity
            key={translation.id}
            style={[
              styles.translationButton,
              { 
                backgroundColor: colors.gray[100],
                borderColor: colors.gray[200],
              },
              preferredTranslation === translation.id && [
                styles.selectedButton, 
                { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }
              ],
            ]}
            onPress={() => handleSelect(translation.id as BibleTranslation)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.translationText,
                { color: colors.gray[700] },
                preferredTranslation === translation.id && [
                  styles.selectedText,
                  { color: colors.white }
                ],
              ]}
            >
              {translation.id.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  translationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedButton: {
  },
  translationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
  },
});