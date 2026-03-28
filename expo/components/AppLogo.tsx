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
        borderRadius: showBackground ? size / 6 : 0,
      }
    ]}>
      <View style={styles.bookContainer}>
        <BookOpen 
          size={size * 0.65} 
          color={showBackground ? '#FFFFFF' : colors.primary} 
          strokeWidth={showBackground ? 3 : 2.5}
          fill="none"
        />
        <View style={[
          styles.heartContainer,
          {
            top: size * 0.28,
            left: size * 0.28,
          }
        ]}>
          <Heart 
            size={size * 0.32} 
            color={showBackground ? '#FFFFFF' : colors.primary}
            fill={showBackground ? '#FFFFFF' : colors.primary}
            strokeWidth={showBackground ? 2.5 : 2}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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