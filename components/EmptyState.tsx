import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { PlusCircle, BookOpen, BookText } from 'lucide-react-native';

interface EmptyStateProps {
  type: 'prayers' | 'bible';
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const { colors } = useThemeStore();
  
  const renderContent = () => {
    switch (type) {
      case 'prayers':
        return {
          icon: <PlusCircle size={60} color={colors.gray[300]} />,
          title: "Today's Prayer",
          message: "Share your thoughts, gratitude, and requests with God today.",
          actionText: "Write Today's Prayer",
        };
      case 'bible':
        return {
          icon: <BookOpen size={60} color={colors.gray[300]} />,
          title: "Bible Reader",
          message: "Select a book, chapter, and verse to start reading.",
          actionText: "Open Bible",
        };
      default:
        return {
          icon: <BookText size={60} color={colors.gray[300]} />,
          title: "Nothing Here Yet",
          message: "There's nothing to display at the moment.",
          actionText: "Get Started",
        };
    }
  };

  const content = renderContent();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {content.icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
      <Text style={[styles.message, { color: colors.gray[600] }]}>{content.message}</Text>
      {onAction && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionText, { color: colors.white }]}>{content.actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 16,
  },
});