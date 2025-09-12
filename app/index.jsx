import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  LogBox,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';



LogBox.ignoreLogs(['ReactNativeReanimated:']);

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    key: '1',
    icon: '🕌',
    title: 'আপনার দ্বীনি 여정에 স্বাগতম',
    description: 'আপনার দৈনন্দিন ইবাদতের জন্য একটি আধুনিক এবং সহজ সমাধান।',
  },
  {
    key: '2',
    icon: '🕋',
    title: 'সঠিক নামাজের সময়',
    description: 'আপনার অবস্থান অনুযায়ী নামাজের সঠিক সময়সূচী পান এবং জামাতের জন্য প্রস্তুত থাকুন।',
  },
  {
    key: '3',
    icon: '📖',
    title: 'দৈনিক হাদিস ও দোয়া',
    description: 'প্রতিদিন একটি নতুন হাদিস পড়ুন এবং আপনার জ্ঞান বৃদ্ধি করুন।',
  },
  {
    key: '4',
    icon: '✨',
    title: 'যাত্রা শুরু করুন',
    description: 'ইসলামের পথে আপনার পথচলা আরও সহজ ও সুন্দর করতে আমরা প্রস্তুত।',
  },
   {
    key: '1',
    icon: '🕌',
    title: 'নিয়তের হাদিস',
    description: 'রাসূল ﷺ বলেছেন: “কাজের ফলাফল নিয়তের উপর নির্ভর করে।” (বুখারী ও মুসলিম)',
  },
  {
    key: '2',
    icon: '🌍',
    title: 'দুনিয়ার মূল্য',
    description: 'রাসূল ﷺ বলেছেন: “দুনিয়া হলো মুমিনের কারাগার আর কাফেরের জান্নাত।” (মুসলিম)',
  },
  {
    key: '3',
    icon: '🌿',
    title: 'সহজ ইসলাম',
    description: 'রাসূল ﷺ বলেছেন: “ধর্ম সহজ; যে এতে কঠোরতা আনে, সে পরাস্ত হবে।” (বুখারী)',
  },
  {
    key: '4',
    icon: '🤝',
    title: 'সদাচরণ',
    description: 'রাসূল ﷺ বলেছেন: “তোমাদের মধ্যে উত্তম সেই ব্যক্তি, যার চরিত্র উত্তম।” (বুখারী)',
  },
  {
    key: '5',
    icon: '🗣️',
    title: 'সততা',
    description: 'রাসূল ﷺ বলেছেন: “সত্যবাদী ব্যক্তি জান্নাতের দিকে নিয়ে যায়।” (বুখারী ও মুসলিম)',
  },
  {
    key: '6',
    icon: '💖',
    title: 'নরম ব্যবহার',
    description: 'রাসূল ﷺ বলেছেন: “আল্লাহ নরম ব্যবহারকে ভালোবাসেন, আর রূঢ়তাকে অপছন্দ করেন।” (মুসলিম)',
  },
  {
    key: '7',
    icon: '👬',
    title: 'ভাইচারা',
    description: 'রাসূল ﷺ বলেছেন: “তোমাদের কেউ ঈমানদার হবে না, যতক্ষণ না সে নিজের জন্য যা চায়, তার ভাইয়ের জন্যও তা চায়।” (বুখারী ও মুসলিম)',
  },
  {
    key: '8',
    icon: '🎁',
    title: 'সদকা',
    description: 'রাসূল ﷺ বলেছেন: “সদকা সম্পদ কমায় না।” (মুসলিম)',
  },
  {
    key: '9',
    icon: '🛡️',
    title: 'মুসলিমের সংজ্ঞা',
    description: 'রাসূল ﷺ বলেছেন: “সেই ব্যক্তি প্রকৃত মুসলিম, যার হাত ও জিহ্বা থেকে অন্য মুসলিম নিরাপদ থাকে।” (বুখারী ও মুসলিম)',
  },
  {
    key: '10',
    icon: '🙏',
    title: 'দোয়ার গুরুত্ব',
    description: 'রাসূল ﷺ বলেছেন: “দোয়া ইবাদতের মজ্জা।” (তিরমিজি)',
  },
];

// --- Onboarding Item Component ---
// Renders a single slide with animation.
const OnboardingItem = ({ item }) => {
  return (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

// --- Pagination Component ---
// Renders the dots at the bottom to indicate the current slide.
const Pagination = ({ data, scrollX }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return <Animated.View key={idx.toString()} style={[styles.dot, { width: dotWidth, opacity }]} />;
      })}
    </View>
  );
};

// --- Main Onboarding Screen Component ---
const OnboardingScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#24f724ff', '#12994aff']} style={styles.gradientBackground}>
        <View style={{ flex: 3 }}>
          <FlatList
            data={onboardingSlides}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.key}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            ref={slidesRef}
          />
        </View>

        <View style={styles.bottomContainer}>
          <Pagination data={onboardingSlides} scrollX={scrollX} />
          <TouchableOpacity style={styles.button} onPress={scrollTo}>
             <LinearGradient colors={['#61c925ff', '#c4ddbeff']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>
                  {currentIndex === onboardingSlides.length - 1 ? 'শুরু করুন' : 'পরবর্তী'}
                </Text>
             </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18c52fff',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderRadius: 75,
    marginBottom: 40,
    shadowColor: '#e20a0aff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
  button: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
