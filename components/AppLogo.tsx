import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookOpen, Heart } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface AppLogoProps {
  size?: number;
  showBackground?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 32, showBackground = false }) => {
  const { colors } = useThemeStore();
  
  return (
    <View style={[
      styles.container,
      { 
        width: size, 
        height: size,
        backgroundColor: showBackground ? '#E85A4F' : 'transparent',
        borderRadius: showBackground ? size / 8 : 0,
      }
    ]}>
      <View style={styles.bookContainer}>
        <BookOpen 
          size={size * 0.6} 
          color={showBackground ? '#FFFFFF' : colors.primary} 
          strokeWidth={2.5}
        />
        <View style={[
          styles.heartContainer,
          {
            top: size * 0.25,
            left: size * 0.25,
          }
        ]}>
          <Heart 
            size={size * 0.3} 
            color={showBackground ? '#FFFFFF' : colors.primary}
            fill={showBackground ? '#FFFFFF' : colors.primary}
            strokeWidth={2}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bookContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainer: {
    position: 'absolute',
  },
});