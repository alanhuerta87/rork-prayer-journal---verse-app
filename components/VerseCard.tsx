import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Share, Platform, Alert, Linking, ImageBackground, ScrollView } from 'react-native';
import { DailyVerse } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { Share2, Image as ImageIcon, Palette, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';

interface VerseCardProps {
  verse: DailyVerse;
}

type BackgroundType = 'none' | 'image' | 'gradient' | 'solid';

interface BackgroundOption {
  id: string;
  type: BackgroundType;
  name: string;
  value?: string;
  colors?: string[];
}

const backgroundOptions: BackgroundOption[] = [
  { id: 'none', type: 'none', name: 'None' },
  { id: 'nature1', type: 'image', name: 'Mountain', value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop' },
  { id: 'nature2', type: 'image', name: 'Ocean', value: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=400&fit=crop' },
  { id: 'nature3', type: 'image', name: 'Forest', value: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop' },
  { id: 'nature4', type: 'image', name: 'Sky', value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop' },
  { id: 'gradient1', type: 'gradient', name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4'] },
  { id: 'gradient2', type: 'gradient', name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { id: 'gradient3', type: 'gradient', name: 'Forest', colors: ['#134E5E', '#71B280'] },
  { id: 'solid1', type: 'solid', name: 'Navy', value: '#2C3E50' },
  { id: 'solid2', type: 'solid', name: 'Purple', value: '#8E44AD' },
  { id: 'solid3', type: 'solid', name: 'Teal', value: '#16A085' },
];

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const { colors } = useThemeStore();
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(backgroundOptions[0]);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  
  const handleShare = async () => {
    // Use the enhanced social sharing function
    await handleSocialShare();
  };

  const handleSocialShare = async () => {
    const shareText = `"${verse.text}" - ${verse.reference} (${verse.translation})`;
    
    const shareOptions = [
      {
        text: 'Share on X (Twitter)',
        onPress: () => {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          Linking.openURL(twitterUrl);
        }
      },
      {
        text: 'Share on Facebook',
        onPress: () => {
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
          Linking.openURL(facebookUrl);
        }
      },
      {
        text: 'Share on Instagram',
        onPress: async () => {
          if (Platform.OS !== 'web') {
            // For mobile, use native sharing which can include Instagram
            try {
              const isAvailable = await Sharing.isAvailableAsync();
              if (isAvailable) {
                await Share.share({
                  message: shareText,
                  title: 'Daily Verse',
                });
              } else {
                Alert.alert('Sharing not available', 'Sharing is not available on this device.');
              }
            } catch (error) {
              console.error('Error sharing to Instagram:', error);
              Alert.alert('Error', 'Unable to share at this time.');
            }
          } else {
            Alert.alert('Instagram', 'Instagram sharing is not available on web. Text copied to clipboard.');
            navigator.clipboard?.writeText(shareText);
          }
        }
      },
      {
        text: 'Copy to Clipboard',
        onPress: () => {
          if (Platform.OS === 'web') {
            navigator.clipboard?.writeText(shareText);
          }
          Alert.alert('Copied!', 'Verse copied to clipboard');
        }
      },
      {
        text: 'More Options',
        onPress: async () => {
          // Use native share sheet for more options
          try {
            await Share.share({
              message: shareText,
              title: 'Daily Verse',
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        }
      },
      { text: 'Cancel', style: 'cancel' as const }
    ];
    
    Alert.alert('Share Verse', 'Choose how to share:', shareOptions);
  };

  const selectBackground = (option: BackgroundOption) => {
    setSelectedBackground(option);
    setShowBackgroundOptions(false);
  };

  const toggleBackgroundOptions = () => {
    setShowBackgroundOptions(!showBackgroundOptions);
  };

  const hasBackground = selectedBackground.type !== 'none';
  const textColor = hasBackground ? colors.white : colors.text;
  const titleColor = hasBackground ? colors.white : colors.primary;
  const referenceColor = hasBackground ? 'rgba(255,255,255,0.9)' : colors.textLight;

  const CardContent = () => (
    <View style={[styles.cardContent, hasBackground && styles.overlayContent]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: titleColor }]}>
          Verse of the Day
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: hasBackground ? 'rgba(255,255,255,0.2)' : colors.gray[100] }]} 
            onPress={toggleBackgroundOptions}
            activeOpacity={0.7}
          >
            <Palette size={18} color={hasBackground ? colors.white : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: hasBackground ? 'rgba(255,255,255,0.2)' : colors.gray[100] }]} 
            onPress={handleSocialShare}
            activeOpacity={0.7}
          >
            <Share2 size={18} color={hasBackground ? colors.white : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.verseText, { color: textColor }]}>
        "{verse.text}"
      </Text>
      
      <Text style={[styles.reference, { color: referenceColor }]}>
        {verse.reference} ({verse.translation})
      </Text>

      {showBackgroundOptions && (
        <View style={[styles.backgroundOptionsModal, { backgroundColor: colors.card }]}>
          <View style={styles.backgroundOptionsHeader}>
            <Text style={[styles.backgroundOptionsTitle, { color: colors.text }]}>Choose Background</Text>
            <TouchableOpacity onPress={() => setShowBackgroundOptions(false)}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.backgroundOptionsScroll}>
            {backgroundOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.backgroundOptionItem,
                  selectedBackground.id === option.id && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => selectBackground(option)}
              >
                {option.type === 'image' && option.value && (
                  <ImageBackground source={{ uri: option.value }} style={styles.backgroundPreview} imageStyle={styles.backgroundPreviewImage}>
                    <View style={styles.backgroundPreviewOverlay} />
                  </ImageBackground>
                )}
                {option.type === 'gradient' && option.colors && (
                  <LinearGradient colors={option.colors && option.colors.length >= 2 ? [option.colors[0], option.colors[1], ...(option.colors.slice(2) || [])] as readonly [string, string, ...string[]] : ['#000000', '#ffffff']} style={styles.backgroundPreview} />
                )}
                {option.type === 'solid' && option.value && (
                  <View style={[styles.backgroundPreview, { backgroundColor: option.value }]} />
                )}
                {option.type === 'none' && (
                  <View style={[styles.backgroundPreview, { backgroundColor: colors.gray[200] }]} />
                )}
                <Text style={[styles.backgroundOptionName, { color: colors.text }]}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderCard = () => {
    if (selectedBackground.type === 'image' && selectedBackground.value) {
      return (
        <ImageBackground 
          source={{ uri: selectedBackground.value }} 
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.overlay}>
            <CardContent />
          </View>
        </ImageBackground>
      );
    }
    
    if (selectedBackground.type === 'gradient' && selectedBackground.colors) {
      return (
        <LinearGradient colors={selectedBackground.colors && selectedBackground.colors.length >= 2 ? [selectedBackground.colors[0], selectedBackground.colors[1], ...(selectedBackground.colors.slice(2) || [])] as readonly [string, string, ...string[]] : ['#000000', '#ffffff']} style={styles.backgroundImage}>
          <View style={styles.overlay}>
            <CardContent />
          </View>
        </LinearGradient>
      );
    }
    
    if (selectedBackground.type === 'solid' && selectedBackground.value) {
      return (
        <View style={[styles.backgroundImage, { backgroundColor: selectedBackground.value }]}>
          <View style={styles.overlay}>
            <CardContent />
          </View>
        </View>
      );
    }
    
    return <CardContent />;
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: selectedBackground.type === 'none' ? colors.card : 'transparent',
      shadowColor: colors.black,
    }]}>
      {renderCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  backgroundImage: {
    width: '100%',
  },
  backgroundImageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
  },
  overlayContent: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  reference: {
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '500',
  },
  backgroundOptionsModal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  backgroundOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backgroundOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  backgroundOptionsScroll: {
    flexDirection: 'row',
  },
  backgroundOptionItem: {
    marginRight: 12,
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
  },
  backgroundPreview: {
    width: 60,
    height: 40,
    borderRadius: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  backgroundPreviewImage: {
    borderRadius: 6,
  },
  backgroundPreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backgroundOptionName: {
    fontSize: 12,
    textAlign: 'center',
  },
});