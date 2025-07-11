import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert, Platform, Share } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { TranslationSelector } from '@/components/TranslationSelector';
import { usePrayerStore } from '@/store/prayerStore';
import { themeColors } from '@/constants/colors';
import { Bell, Moon, Sun, Trash2, Share2, Info, Palette } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, themeColor, colors, toggleTheme, setThemeColor } = useThemeStore();
  const [notifications, setNotifications] = React.useState(true);
  const { prayers } = usePrayerStore();

  const toggleNotifications = () => {
    setNotifications(previous => !previous);
    // In a real app, this would update notification settings
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all your prayers? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, this would clear all user data
            Alert.alert("Data Cleared", "All your prayers have been deleted.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      const appStoreUrl = 'https://apps.apple.com/app/my-prayer-journal';
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.myprayerjournal';
      
      const message = `Check out My Prayer Journal - A beautiful app to record your prayers and grow in your faith journey!

📱 Download:
iOS: ${appStoreUrl}
Android: ${playStoreUrl}`;
      
      if (Platform.OS === 'web') {
        // Web sharing options
        const shareOptions = [
          {
            text: 'Share on Twitter',
            onPress: () => {
              const tweetText = encodeURIComponent(`Check out My Prayer Journal - A beautiful app for your spiritual journey! ${appStoreUrl}`);
              window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
            }
          },
          {
            text: 'Share on Facebook',
            onPress: () => {
              const fbUrl = encodeURIComponent(appStoreUrl);
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`, '_blank');
            }
          },
          {
            text: 'Copy Link',
            onPress: () => {
              navigator.clipboard.writeText(appStoreUrl);
              Alert.alert('Link Copied', 'App store link copied to clipboard!');
            }
          },
          { 
            text: 'Cancel', 
            style: 'cancel' as const
          }
        ];
        
        Alert.alert(
          'Share My Prayer Journal',
          'Choose how you would like to share:',
          shareOptions
        );
      } else {
        // Native sharing
        await Share.share({
          message,
          title: 'My Prayer Journal',
          url: Platform.OS === 'ios' ? appStoreUrl : playStoreUrl,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Unable to share at this time. Please try again later.');
    }
  };

  const handleAbout = () => {
    // In a real app, this would show about information
    Alert.alert("About", "My Prayer Journal App v1.0\n\nA place to record your prayers and grow in your faith journey.");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { 
        backgroundColor: colors.card,
        shadowColor: colors.black,
      }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}>
          <View style={styles.settingInfo}>
            {theme === 'dark' ? (
              <Moon size={22} color={colors.text} style={styles.settingIcon} />
            ) : (
              <Sun size={22} color={colors.text} style={styles.settingIcon} />
            )}
            <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}>
          <View style={styles.settingInfo}>
            <Bell size={22} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Daily Reminders</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}>
          <View style={styles.settingInfo}>
            <Palette size={22} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Theme Color</Text>
          </View>
        </View>
        
        <View style={styles.colorPalette}>
          {Object.entries(themeColors).map(([colorKey, colorValue]) => (
            <TouchableOpacity
              key={colorKey}
              style={[
                styles.colorOption,
                { backgroundColor: theme === 'dark' ? colorValue.primaryDark : colorValue.primary },
                themeColor === colorKey && [styles.selectedColor, { borderColor: colors.text }]
              ]}
              onPress={() => setThemeColor(colorKey as keyof typeof themeColors)}
              activeOpacity={0.8}
            >
              {themeColor === colorKey && (
                <View style={[styles.colorCheckmark, { backgroundColor: colors.white }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={[styles.section, { 
        backgroundColor: colors.card,
        shadowColor: colors.black,
      }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bible</Text>
        <TranslationSelector />
      </View>
      
      <View style={[styles.section, { 
        backgroundColor: colors.card,
        shadowColor: colors.black,
      }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{prayers.length}</Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Total Prayers</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {prayers.filter(prayer => prayer.isFavorite).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Favorites</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {prayers.length > 0 
                ? Math.floor((new Date().getTime() - new Date(prayers[prayers.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
                : 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Days Active</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { 
        backgroundColor: colors.card,
        shadowColor: colors.black,
      }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App</Text>
        
        <TouchableOpacity 
          style={[styles.actionItem, { borderBottomColor: colors.gray[200] }]} 
          onPress={handleShare}
        >
          <View style={styles.actionInfo}>
            <Share2 size={22} color={colors.text} style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: colors.text }]}>Share App</Text>
          </View>
          <View style={[styles.actionArrow, { borderColor: colors.gray[400] }]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionItem, { borderBottomColor: colors.gray[200] }]} 
          onPress={handleAbout}
        >
          <View style={styles.actionInfo}>
            <Info size={22} color={colors.text} style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: colors.text }]}>About</Text>
          </View>
          <View style={[styles.actionArrow, { borderColor: colors.gray[400] }]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionItem, styles.dangerAction]} 
          onPress={handleClearData}
        >
          <View style={styles.actionInfo}>
            <Trash2 size={22} color={colors.error} style={styles.actionIcon} />
            <Text style={[styles.actionText, styles.dangerText, { color: colors.error }]}>Clear All Data</Text>
          </View>
          <View style={[styles.actionArrow, { borderColor: colors.gray[400] }]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
  },
  actionArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  dangerAction: {
    borderBottomWidth: 0,
  },
  dangerText: {
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
  },
  colorCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});