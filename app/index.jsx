import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity, SafeAreaView, LogBox } from 'react-native';
import { useRouter } from 'expo-router';
import 'react-native-reanimated';

// Reanimated warnings ignore
LogBox.ignoreLogs(['ReactNativeReanimated:']);

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const quoteFadeAnim = useRef(new Animated.Value(1)).current;
  const quoteSlideAnim = useRef(new Animated.Value(10)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  const quotes = [
    'আল্লাহ আপনার নামাজ, যাকাত এবং রোজাগুলি কবুল করুন।',
    'হাদিস ১: নবী (সঃ) বলেছেন, “যে আল্লাহর প্রতি ভরসা রাখে, আল্লাহ তার জন্য যথেষ্ট।”',
    'হাদিস ২: “সত্যবাদিতা নেককারদের কাছে নেকি বাড়ায়।”',
    'হাদিস ৩: “যে ব্যক্তি অন্যকে ভালো দেখে, আল্লাহও তাকে ভালো দেখেন।”',
    'হাদিস ৪: “জীবনের প্রতিটি নেক কাজের জন্য মানুষ পুরস্কৃত হবে।”'
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Splash animation (logo + button fade)
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true })
      ]),
      Animated.timing(buttonFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true })
    ]).start();
  }, []);

  // Quote animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(quoteFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(quoteSlideAnim, { toValue: -10, duration: 500, useNativeDriver: true })
      ]).start();

      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length);
        quoteSlideAnim.setValue(10);
        Animated.parallel([
          Animated.timing(quoteFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(quoteSlideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
        ]).start();
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://m.media-amazon.com/images/I/61m9TN9GTLL.jpg' }}
        style={styles.background}
      >
        <View style={styles.overlay} />

        <View style={styles.quoteContainer}>
          <Animated.Text
            style={[styles.quote, { opacity: quoteFadeAnim, transform: [{ translateY: quoteSlideAnim }] }]}
          >
            {quotes[currentQuote]}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.logoIcon}>☪️</Text>
          <Text style={styles.tagline}>দৈনিক ইবাদতের সঙ্গী</Text>
        </Animated.View>

        <Animated.View style={[styles.buttonWrapper, { opacity: buttonFadeAnim }]}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.buttonText}>শুরু করুন</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  quoteContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 70,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SplashScreen;
