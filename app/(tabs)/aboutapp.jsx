import React, { useState, useEffect } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// Get screen width for responsive design
const { width } = Dimensions.get('window');

// App Details
const APP_DETAILS = {
  description:
    `এটি একটি সম্পূর্ণ ইসলামিক অ্যাপ, যা বাংলা ভাষায় দৈনিক আমল, জিকির, সুন্নাহ এবং নামাজের সময়সূচী প্রদান করে। এই অ্যাপটি বাংলাদেশের ব্যবহারকারীদের জন্য বিশেষভাবে ডিজাইন করা হয়েছে এবং ২০২৫ সাল থেকে জনপ্রিয়।`,
  features: [
    { title: 'নামাজের সময়', description: '🌙 ফজর, জোহর, আসর, মাগরিব, ঈশা, তাহাজ্জুদ, সাহরি ও ইফতারের সময়সূচী। অটো-লোকেশন ডিটেকশন এবং ট্রাভেলার মোড সহ।' },
    { title: 'কুরআন', description: '📖 বাংলা অনুবাদ ও উচ্চারণ সহ কুরআন, ৭০টির বেশি অনুবাদ এবং তাফসীর (মাওলানা মুহিউদ্দিন খান, তাফসীর ইবনে কাসির, মারিফুল কুরআন)। অডিও এবং অফলাইন সুবিধা।' },
    { title: 'দোয়া ও জিকির', description: '🤲 হিসনুল মুসলিম ভিত্তিক মাসনুন দোয়া (যেমন: সকাল-সন্ধ্যার জিকির, ঘুমের দোয়া, খাওয়ার দোয়া) এবং হাদিসের রেফারেন্স সহ অডিও।' },
    { title: 'সুন্নাহ', description: '🌿 নবী (সা.)-এর সুন্নাহ (যেমন: মেসওয়াক, ডান দিকে শুরু, হাসিমুখে কথা বলা) শেখার সুবিধা।' },
  ],
  otherFeatures: [
    { title: 'ডিজিটাল তাসবিহ কাউন্টার', icon: '📿' },
    { title: 'হজ ও উমরাহ গাইড', icon: '🕋' },
    { title: 'জাকাত ক্যালকুলেটর', icon: '💰' },
    { title: 'নামাজ শিক্ষা (নূরানি পদ্ধতি)', icon: '🕌' },
    { title: '৯৯টি আল্লাহর নাম', icon: '✨' },
    { title: 'বাংলা সাপোর্ট', description: '🇧🇩 সম্পূর্ণ বাংলা ইন্টারফেস, বাংলা অনুবাদ, তাফসীর এবং উচ্চারণ। বাংলাদেশের ৬৪টি জেলার জন্য স্থানীয়করণ।' },
  ],
  version: '1.0.0',
  quranicVerse: [
    `“সুতরাং তোমরা আমাকে স্মরণ করো, আমি তোমাদেরকে স্মরণ করব। আর তোমরা আমার প্রতি কৃতজ্ঞ হও এবং অকৃতজ্ঞ হয়ো না।” (সূরা বাকারা: ১৫২)`,
    `“এবং যারা আল্লাহকে ভয় করে, আল্লাহ তাদের জন্য পথ খুলে দেন।” (সূরা তালাক: ২-৩)`,
    `“নিশ্চয় কষ্টের পর স্বস্তি আছে।” (সূরা ইনশিরাহ: ৫-৬)`,
    `“আর আমি তো কেবল মু'মিনদের জন্যই উপদেশ দিয়ে থাকি।” (সূরা আয-যারিয়াত: ৫৫)`,
    `“আল্লাহর রহমত থেকে নিরাশ হয়ো না।” (সূরা যুমার: ৫৩)`
  ],
};

// Developer Details
const DEVELOPER_DETAILS = {
  logo: 'https://scontent.fjsr6-1.fna.fbcdn.net/v/t39.30808-6/489085217_1225632368983132_9073890756416247574_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEp2EjF5dKG6maYNVO3zPq8_QmJvGbojLn9CYm8ZuiMuVPdNWJoVaZmN0H-BcjyM-f2wgIxKfnYtQc00DxgLKhn&_nc_ohc=4F1nY-uA16AQ7kNvwGFSFbc&_nc_oc=AdlnhcRdKV7NbZ40A5YcYei57JHPmX29RV94D1xT_7zwQCSB4q0yFyQXWwwUUEFKd0Y&_nc_zt=23&_nc_ht=scontent.fjsr6-1.fna&_nc_gid=QSha_HPTVL4DVpLycphY6g&oh=00_AfX50xQQDwRf3PaKNuVVRHi5T_HcauKQkPdKwMIkRwP9uw&oe=68B7D961',
  name: 'Abdullah AL Kawser',
  subtitle: '🚀 Software Engineer | 🤖 Machine Learning | Artificial Intelligence | AI Agent| Deep Learning | Computer Vision',
  contactEmail: 'contact@bytelabs.com',
  website: 'https://bytelabs1.netlify.app/',
};

export default function AboutApp() {
  const float = useSharedValue(0);
  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVerseIndex(prevIndex => (prevIndex + 1) % APP_DETAILS.quranicVerse.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const animatedAppCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: float.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#f0f4f8', '#d9e2ec']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Developer Info Section */}
        <View style={styles.card}>
          <View style={styles.developerHeader}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: DEVELOPER_DETAILS.logo }} style={styles.logo} />
            </View>
            <View style={styles.developerTextContainer}>
              <Text style={styles.developerName}>{DEVELOPER_DETAILS.name}</Text>
              <Text style={styles.developerSubtitle}>{DEVELOPER_DETAILS.subtitle}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(`mailto:${DEVELOPER_DETAILS.contactEmail}`)}
            >
              <Text style={styles.buttonText}>📧 Email Me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(DEVELOPER_DETAILS.website)}
            >
              <Text style={styles.buttonText}>🌐 Visit Website</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Section */}
        <Animated.View style={[styles.card, animatedAppCardStyle]}>
          <Text style={styles.cardHeader}>About this App</Text>
          <Text style={styles.descriptionText}>{APP_DETAILS.description}</Text>

          {/* Features List */}
          <Text style={styles.featuresHeader}>বৈশিষ্ট্য:</Text>
          {APP_DETAILS.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
          
          {/* Other Features List */}
          <Text style={styles.featuresHeader}>অন্যান্য বৈশিষ্ট্য:</Text>
          {APP_DETAILS.otherFeatures.map((feature, index) => (
            <View key={index} style={styles.otherFeatureItem}>
              <Text style={styles.otherFeatureText}>{`${feature.icon || ''} ${feature.title}`}</Text>
            </View>
          ))}

        </Animated.View>

        {/* Quranic Verse */}
        <View style={styles.verseContainer}>
          <Text style={styles.verseTitle}>একটি দিকনির্দেশনামূলক আয়াত</Text>
          <Text style={styles.quranicVerse}>{APP_DETAILS.quranicVerse[verseIndex]}</Text>
        </View>

        {/* Fixed version info section */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{`Version ${APP_DETAILS.version}`}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
     marginTop: 50,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: width * 0.05,
    paddingBottom: 80,
    backgroundColor: 'transparent',
  },
  card: {
    borderLeftWidth: 4,
    borderLeftColor: '#2cc706ff',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: width * 0.06,
    marginBottom: 20,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: width * 0.035,
    color: '#475569',
    lineHeight: width * 0.055,
    textAlign: 'justify',
    marginBottom: 20,
  },
  featuresHeader: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: width * 0.035,
    color: '#475569',
    lineHeight: width * 0.05,
  },
  otherFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  otherFeatureText: {
    fontSize: width * 0.038,
    color: '#475569',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    borderWidth: 3,
    borderColor: '#3b82f6',
    padding: 2,
    marginRight: 15,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.2) / 2,
  },
  developerTextContainer: {
    flex: 1,
  },
  developerName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  developerSubtitle: {
    fontSize: width * 0.035,
    color: '#64748b',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4fe214ff',
    paddingVertical: width * 0.035,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: width * 0.035,
  },
  verseContainer: {
    width: '100%',
    backgroundColor: '#fbfffbff',
    padding: width * 0.05,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#33ff00ff',
    
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  verseTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 8,
    textAlign: 'center',
  },
  quranicVerse: {
    fontSize: width * 0.037,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#000000ff',
    lineHeight: width * 0.06,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
});