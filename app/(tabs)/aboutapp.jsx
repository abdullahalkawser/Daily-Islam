import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// App Details (unchanged)
const APP_DETAILS = {
  logo: 'https://scontent.fjsr6-1.fna.fbcdn.net/v/t39.30808-6/489085217_1225632368983132_9073890756416247574_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEp2EjF5dKG6maYNVO3zPq8_QmJvGbojLn9CYm8ZuiMuVPdNWJoVaZmN0H-BcjyM-f2wgIxKfnYtQc00DxgLKhn&_nc_ohc=4F1nY-uA16AQ7kNvwGFSFbc&_nc_oc=AdlnhcRdKV7NbZ40A5YcYei57JHPmX29RV94D1xT_7zwQCSB4q0yFyQXWwwUUEFKd0Y&_nc_zt=23&_nc_ht=scontent.fjsr6-1.fna&_nc_gid=QSha_HPTVL4DVpLycphY6g&oh=00_AfX50xQQDwRf3PaKNuVVRHi5T_HcauKQkPdKwMIkRwP9uw&oe=68B7D961',
  name: 'Abdullah AL Kawser',
  subtitle: '🚀 Software Engineer | 🤖 Machine Learning | Artificial Intelligence (AI) AI agent Deep Learning Computer Vision',
  description:
    'Clean App is designed to simplify your daily tasks with a focus on a user-friendly and aesthetic interface. We believe in providing a seamless experience.',
  version: '1.0.0',
  quranicVerse: '“And for those who fear Allah, He will make their path easy.”',
};

const DEVELOPER_DETAILS = {
  name: 'Your Name',
  contactEmail: 'contact@yourapp.com',
  website: 'https://www.yourapp.com',
};

export default function AboutApp() {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    // Subtle pulsing for the main card
    pulse.value = withRepeat(
      withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#14532d', '#052e16', '#064e3b']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Info Section */}
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: APP_DETAILS.logo }} style={styles.logo} />
          </View>

          <Text style={styles.appName}>{APP_DETAILS.name}</Text>
          <Text style={styles.appSubtitle}>{APP_DETAILS.subtitle}</Text>
          <Text style={styles.description}>{APP_DETAILS.description}</Text>
        </Animated.View>

        {/* Developer Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Developed By</Text>
          <Text style={styles.devName}>{DEVELOPER_DETAILS.name}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Linking.openURL(`mailto:${DEVELOPER_DETAILS.contactEmail}`)
            }
          >
            <Text style={styles.buttonText}>📧 Email Us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(DEVELOPER_DETAILS.website)}
          >
            <Text style={styles.buttonText}>🌐 Visit Website</Text>
          </TouchableOpacity>
        </View>

        {/* Quranic Verse */}
        <View style={styles.verseContainer}>
          <Text style={styles.quranicVerse}>{APP_DETAILS.quranicVerse}</Text>
        </View>

        {/* Version Info */}
        <Text style={styles.version}>Version {APP_DETAILS.version}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#10b981', // Emerald shadow for a glowing effect
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 100,
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#34d399', // A bright emerald green
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6ee7b7',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#a7f3d0',
  },
  devName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#d1fae5',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857', // A dark, solid green
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#e0f2f1',
    fontWeight: '600',
    fontSize: 15,
  },
  verseContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quranicVerse: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#6ee7b7',
  },
  version: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 15,
    textAlign: 'center',
  },
});