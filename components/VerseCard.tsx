import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Share, Platform, Alert, Linking, ImageBackground } from 'react-native';
import { DailyVerse } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { Share2, Image as ImageIcon, Palette } from 'lucide-react-native';

interface VerseCardProps {
  verse: DailyVerse;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const { colors } = useThemeStore();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  
  const handleShare = async () => {
    const shareText = `"${verse.text}" - ${verse.reference} (${verse.translation})`;
    
    if (Platform.OS === 'web') {
      // Web sharing options
      Alert.alert(
        'Share Verse',
        'Choose how to share this verse:',
        [
          {
            text: 'Copy to Clipboard',
            onPress: () => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText);
                Alert.alert('Copied!', 'Verse copied to clipboard');
              }
            }
          },
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
              const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareText)}`;
              Linking.openURL(facebookUrl);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      // Mobile sharing
      try {
        const result = await Share.share({
          message: shareText,
          title: 'Daily Verse',
        });
        
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('Shared via:', result.activityType);
          } else {
            console.log('Shared successfully');
          }
        }
      } catch (error) {
        console.error('Error sharing verse:', error);
        Alert.alert('Error', 'Unable to share verse');
      }
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'instagram' | 'sms') => {
    const shareText = `"${verse.text}" - ${verse.reference} (${verse.translation})`;
    
    switch (platform) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        Linking.openURL(twitterUrl);
        break;
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
        Linking.openURL(facebookUrl);
        break;
      case 'instagram':
        // Instagram doesn't support direct text sharing, so we'll copy to clipboard
        if (Platform.OS !== 'web' && navigator.clipboard) {
          navigator.clipboard.writeText(shareText);
          Alert.alert('Copied!', 'Verse copied to clipboard. You can now paste it in Instagram.');
        }
        break;
      case 'sms':
        const smsUrl = Platform.OS === 'ios' 
          ? `sms:&body=${encodeURIComponent(shareText)}`
          : `sms:?body=${encodeURIComponent(shareText)}`;
        Linking.openURL(smsUrl);
        break;
    }
  };

  const getRandomUnsplashImage = async () => {
    try {
      // Using Unsplash Source API for random nature/spiritual images
      const categories = ['nature', 'landscape', 'sky', 'mountains', 'ocean', 'forest'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const imageUrl = `https://source.unsplash.com/800x400/?${randomCategory}`;
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

  const removeBackground = () => {
    setBackgroundImage(null);
  };

  const toggleBackgroundOptions = () => {
    setShowBackgroundOptions(!showBackgroundOptions);
  };

  const CardContent = () => (
    <View style={[styles.cardContent, backgroundImage && styles.overlayContent]}>
      <View style={styles.header}>
        <Text style={[
          styles.title, 
          { color: backgroundImage ? colors.white : colors.primary }
        ]}>
          Verse of the Day
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: backgroundImage ? 'rgba(255,255,255,0.2)' : colors.gray[100] }]} 
            onPress={toggleBackgroundOptions}
            activeOpacity={0.7}
          >
            <Palette size={18} color={backgroundImage ? colors.white : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: backgroundImage ? 'rgba(255,255,255,0.2)' : colors.gray[100] }]} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={18} color={backgroundImage ? colors.white : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[
        styles.verseText, 
        { color: backgroundImage ? colors.white : colors.text }
      ]}>
        "{verse.text}"
      </Text>
      
      <Text style={[
        styles.reference, 
        { color: backgroundImage ? 'rgba(255,255,255,0.9)' : colors.textLight }
      ]}>
        {verse.reference} ({verse.translation})
      </Text>

      {showBackgroundOptions && (
        <View style={[styles.backgroundOptions, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={[styles.backgroundButton, { borderColor: colors.gray[300] }]}
            onPress={getRandomUnsplashImage}
          >
            <ImageIcon size={16} color={colors.primary} />
            <Text style={[styles.backgroundButtonText, { color: colors.text }]}>Add Background</Text>
          </TouchableOpacity>
          {backgroundImage && (
            <TouchableOpacity 
              style={[styles.backgroundButton, { borderColor: colors.gray[300] }]}
              onPress={removeBackground}
            >
              <Text style={[styles.backgroundButtonText, { color: colors.text }]}>Remove Background</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.card,
      shadowColor: colors.black,
    }]}>
      {backgroundImage ? (
        <ImageBackground 
          source={{ uri: backgroundImage }} 
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.overlay}>
            <CardContent />
          </View>
        </ImageBackground>
      ) : (
        <CardContent />
      )}
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
  backgroundOptions: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
  },
  backgroundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  backgroundButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});