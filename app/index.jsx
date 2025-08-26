import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const quoteFadeAnim = useRef(new Animated.Value(1)).current; // Quote fade animation

  const quotes = [
    'আল্লাহ আপনার নামাজ, যাকাত এবং রোজাগুলি কবুল করুন।',
    'হাদিস ১: নবী (সঃ) বলেছেন, “যে আল্লাহর প্রতি ভরসা রাখে, আল্লাহ তার জন্য যথেষ্ট।”',
    'হাদিস ২: “সত্যবাদিতা নেককারদের কাছে নেকি বাড়ায়।”',
    'হাদিস ৩: “যে ব্যক্তি অন্যকে ভালো দেখে, আল্লাহও তাকে ভালো দেখেন।”',
    'হাদিস ৪: “জীবনের প্রতিটি নেক কাজের জন্য মানুষ পুরস্কৃত হবে।”'
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Quote পরিবর্তন প্রতি 3 সেকেন্ডে smooth fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(quoteFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(quoteFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Splash animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGetStarted = () => {
    navigation.replace('Home');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://m.media-amazon.com/images/I/61m9TN9GTLL.jpg' }}
      style={styles.background}
    >
      {/* Linear Gradient overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.gradient}
      >
        {/* উপরের হাদিস অংশ */}
        <View style={styles.quoteContainer}>
          <Animated.Text style={[styles.quote, { opacity: quoteFadeAnim }]}>
            {quotes[currentQuote]}
          </Animated.Text>
        </View>

        {/* Center অংশ (Logo + Tagline + Button) */}
        <Animated.View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>☪️</Text>
            <Text style={styles.tagline}>দৈনিক ইবাদতের সঙ্গী</Text>
          </View>

          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>শুরু করুন</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  gradient: { flex: 1 },
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
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIcon: { fontSize: 80, color: 'white', marginBottom: 5 },
  tagline: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  getStartedButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default SplashScreen;
