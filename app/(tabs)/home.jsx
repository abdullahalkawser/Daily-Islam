import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import PrayerPage from "../../components/NamazTime";
import PrayerTimesComponent from "../../components/PrayerTimesScreen";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const scaleFont = (size) => size * (WINDOW_WIDTH / 375); // Base width for scaling

// Dummy Data in Bangla
const HADITHS = [
  { id: 1, text: "সবচেয়ে উত্তম মানুষ হল যারা অন্যদের উপকার করে।", source: "নবী করিম (সা.)" },
  { id: 2, text: "দয়া বিশ্বাসের একটি চিহ্ন, আর যে দয়ালু নয়, তার বিশ্বাস নেই।", source: "নবী করিম (সা.)" },
  { id: 3, text: "বিশ্বাসী সে নয় যে ভুঁড়ি ভর্তি খায় যখন প্রতিবেশী ক্ষুধার্ত থাকে।", source: "নবী করিম (সা.)" },
  { id: 4, text: "ভাল কথা বলুন বা নীরব থাকুন।", source: "নবী করিম (সা.)" },
  { id: 5, text: "আল্লাহর কাছে সবচেয়ে প্রিয় কাজ হলো ধারাবাহিকতা, যদিও তা সামান্য হয়।", source: "নবী করিম (সা.)" },
];

const APP_SECTIONS = [
  { id: 1, title: 'হাদিস', icon: '📖', color: '#6A1B9A', route: '/hadis' },
  { id: 2, title: 'দোয়া', icon: '🤲', color: '#1565C0', route: '/duas' },
  { id: 3, title: 'তাসবিহ', icon: '📿', color: '#D84315', route: '/tasbih' },
  { id: 4, title: 'জাকাত', icon: '💰', color: '#558B2F', route: '/zakat' },
  { id: 5, title: 'ঘুমানোর সময়ের আমল', icon: '📚', color: '#3E2723', route: '/kitab' },
  { id: 6, title: 'সুন্নাহ', icon: '❤️', color: '#B71C1C', route: '/sunnah' },
  { id: 7, title: 'গোসলের আমল', icon: '🧼', color: '#00695C', route: '/gosol' },
  { id: 8, title: 'আরবি ভাষা', icon: '✍️', color: '#5D4037', route: '/arbi' },
  { id: 9, title: 'রমজান', icon: '🌙', color: '#FBC02D', route: '/ramadan' },
];

const SUNNAHS = [
  { id: 1, title: 'মেসওয়াক', icon: '🌿', color: '#4CAF50' },
  { id: 2, title: 'ডান দিক থেকে শুরু', icon: '➡️', color: '#2196F3' },
  { id: 3, title: 'খাবার আগে ও পরে হাত ধোয়া', icon: '💧', color: '#9C27B0' },
  { id: 4, title: 'খাবার সময় তিন আঙুল ব্যবহার', icon: '✋', color: '#FF9800' },
  { id: 5, title: 'শুয়ে ডান কাত হয়ে ঘুমানো', icon: '🛌', color: '#5D4037' },
  { id: 6, title: 'জোরে সালাম দেওয়া', icon: '🗣️', color: '#E91E63' },
  { id: 7, title: 'হাসিমুখে কথা বলা', icon: '😊', color: '#00BCD4' },
  { id: 8, title: 'পোশাক পরিধানে সতর্কতা', icon: '👕', color: '#607D8B' },
  { id: 9, title: 'রোগীর সেবা করা', icon: '🏥', color: '#8BC34A' },
];

const IslamicAppHome = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [userName] = useState('আব্দুল্লাহ আল কাওসার');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHadithIndex(prev => (prev === HADITHS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSectionPress = (section) => {
    if (section.route) router.push(section.route);
  };

  const renderHadithSlider = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>আজকের হাদিস</Text>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={[styles.hadithCard, { minHeight: height * 0.2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.hadithText, { fontSize: scaleFont(16) }]}>"{HADITHS[currentHadithIndex].text}"</Text>
        <Text style={[styles.hadithSource, { fontSize: scaleFont(14) }]}>- {HADITHS[currentHadithIndex].source}</Text>
        <View style={styles.hadithIndicator}>
          {HADITHS.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentHadithIndex && styles.activeDot]} />
          ))}
        </View>
      </LinearGradient>
    </View>
  );

  const renderQuickAccess = () => (
    <View style={styles.sectionContainer}>
      <View style={[styles.quickAccessContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TouchableOpacity 
          style={[styles.quickAccessCardWrapper, { width: '48%' }]} 
          onPress={() => router.push('/amol')}
          activeOpacity={0.7}
        >
          <LinearGradient colors={['#20c525ff', '#304b12ff']} style={[styles.quickAccessCard, { height: height * 0.15 }]}>
            <Text style={[styles.quickAccessIcon, { fontSize: scaleFont(35) }]}>🌙</Text>
            <Text style={[styles.quickAccessTitle, { fontSize: scaleFont(16) }]}>সকাল এবং সন্ধ্যার</Text>
            <Text style={[styles.quickAccessSubtitle, { fontSize: scaleFont(12) }]}>সময় ও দোয়া</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickAccessCardWrapper, { width: '48%' }]} 
          onPress={() => router.push('/namj')}
          activeOpacity={0.7}
        >
          <LinearGradient colors={['#03A9F4', '#2196F3']} style={[styles.quickAccessCard, { height: height * 0.15 }]}>
            <Text style={[styles.quickAccessIcon, { fontSize: scaleFont(35) }]}>⏰</Text>
            <Text style={[styles.quickAccessTitle, { fontSize: scaleFont(16) }]}>আজকের দিনের</Text>
            <Text style={[styles.quickAccessSubtitle, { fontSize: scaleFont(12) }]}>আমল ও দোয়া</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppSections = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>অন্যান্য</Text>
      <View style={[styles.sectionsGrid, { justifyContent: width > 600 ? 'space-between' : 'space-around' }]}>
        {APP_SECTIONS.map(section => (
          <TouchableOpacity
            key={section.id}
            style={[styles.sectionCard, { 
              width: width > 600 ? (width - 80) / 4 : (width - 60) / 3,
              backgroundColor: section.color 
            }]}
            onPress={() => handleSectionPress(section)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionIcon, { fontSize: scaleFont(30) }]}>{section.icon}</Text>
            <Text style={[styles.sectionText, { fontSize: scaleFont(12) }]}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSunnahSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>নবী (সাঃ) এর ৯টি সুন্নাহ 🌙</Text>
      <View style={[styles.sunnahGrid, { justifyContent: width > 600 ? 'space-between' : 'space-around' }]}>
        {SUNNAHS.map(sunnah => (
          <TouchableOpacity
            key={sunnah.id}
            style={[styles.sunnahCard, { 
              width: width > 600 ? (width - 80) / 4 : (width - 60) / 3,
              backgroundColor: sunnah.color 
            }]}
            onPress={() => alert(`${sunnah.title}`)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sunnahIcon, { fontSize: scaleFont(30) }]}>{sunnah.icon}</Text>
            <Text style={[styles.sunnahText, { fontSize: scaleFont(12) }]}>{sunnah.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPrayerTimes = () => (
    <View style={styles.prayerContainer}>
      <PrayerTimesComponent
        latitude={23.8103}
        longitude={90.4125}
        calculation="MuslimWorldLeague"
        madhab="Shafi"
        use12h={true}
      />
    </View>
  );

  const prayerTimes = () => (
    <View style={styles.prayerContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>নামাজের সময় 🕌</Text>
      <PrayerPage />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0dcd0dff" barStyle="light-content" />
      <View style={[styles.header, { paddingTop: height * 0.07 }]}>
        <Text style={[styles.greeting, { fontSize: scaleFont(18) }]}>আসসালামু আলাইকুম</Text>
        <Text style={[styles.userName, { fontSize: scaleFont(28) }]}>{userName}</Text>
        <Text style={[styles.date, { fontSize: scaleFont(14) }]}>
          {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
      >
        {renderPrayerTimes()}
        {renderQuickAccess()}
        {renderAppSections()}
        {renderSunnahSection()}
        {renderHadithSlider()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    marginBottom: '10%'
  },
  header: {
    backgroundColor: '#1ac922ff',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: '3%',
  },
  greeting: { 
    color: '#FFFFFF', 
    fontWeight: '400',
    marginBottom: '2%' 
  },
  userName: { 
    color: '#FFFFFF', 
    fontWeight: 'bold',
    marginTop: '2%' 
  },
  date: { 
    color: '#C8E6C9', 
    marginTop: '2%', 
    fontWeight: '400' 
  },
  scrollView: { 
    flex: 1, 
    paddingHorizontal: '2%' 
  },
  sectionContainer: { 
    marginTop: '5%' 
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    textAlign: 'center',
    marginBottom: '4%' 
  },
  hadithCard: {
    borderRadius: 15,
    padding: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  hadithText: { 
    lineHeight: 24, 
    color: '#FFFFFF', 
    fontStyle: 'italic', 
    marginBottom: '4%', 
    textAlign: 'center' 
  },
  hadithSource: { 
    color: '#E0E0E0', 
    textAlign: 'center', 
    marginBottom: '4%' 
  },
  hadithIndicator: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#E0E0E0', 
    marginHorizontal: 3 
  },
  activeDot: { 
    backgroundColor: '#FFFFFF' 
  },
  quickAccessContainer: { 
    marginTop: '2%' 
  },
  quickAccessCardWrapper: { 
    borderRadius: 15, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5,
    marginHorizontal: '1%', // Small gap between cards
  },
  quickAccessCard: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: '5%',
  },
  quickAccessIcon: { 
    marginBottom: '2%' 
  },
  quickAccessTitle: { 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center', 
    marginBottom: '2%' 
  },
  quickAccessSubtitle: { 
    color: '#FFFFFF', 
    opacity: 0.8, 
    textAlign: 'center' 
  },
  sectionsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  sectionCard: {
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: '2%',
  },
  sectionIcon: { 
    marginBottom: '2%' 
  },
  sectionText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  sunnahGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  sunnahCard: {
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: '2%',
  },
  sunnahIcon: { 
    marginBottom: '2%' 
  },
  sunnahText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  prayerContainer: { 
    marginVertical: '2%' 
  },
});

export default IslamicAppHome;