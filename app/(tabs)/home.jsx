import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import PrayerTimesComponent  from "../../components/PrayerTimesScreen"
import PrayerPage  from "../../components/NamazTime";

const { width } = Dimensions.get('window');

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

// Sunnah Section
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
      <Text style={styles.sectionTitle}>আজকের হাদিস</Text>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.hadithCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.hadithText}>"{HADITHS[currentHadithIndex].text}"</Text>
        <Text style={styles.hadithSource}>- {HADITHS[currentHadithIndex].source}</Text>
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
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity style={styles.quickAccessCardWrapper} onPress={() => router.push('/amol')}>
          <LinearGradient colors={['#20c525ff', '#304b12ff']} style={styles.quickAccessCard}>
            <Text style={styles.quickAccessIcon}>🌙</Text>
            <Text style={styles.quickAccessTitle}>সকাল এবং সন্ধ্যার</Text>
            <Text style={styles.quickAccessSubtitle}>সময় ও দোয়া</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessCardWrapper} onPress={() => router.push('/dailyplan')}>
          <LinearGradient colors={['#03A9F4', '#2196F3']} style={styles.quickAccessCard}>
            <Text style={styles.quickAccessIcon}>⏰</Text>
            <Text style={styles.quickAccessTitle}>আজকের দিনের</Text>
            <Text style={styles.quickAccessSubtitle}>আমল ও দোয়া</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppSections = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>অন্যান্য</Text>
      <View style={styles.sectionsGrid}>
        {APP_SECTIONS.map(section => (
          <TouchableOpacity
            key={section.id}
            style={[styles.sectionCard, { backgroundColor: section.color }]}
            onPress={() => handleSectionPress(section)}
          >
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text style={styles.sectionText}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSunnahSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>নবী (সাঃ) এর ৯টি সুন্নাহ 🌙</Text>
      <View style={styles.sunnahGrid}>
        {SUNNAHS.map(sunnah => (
          <TouchableOpacity
            key={sunnah.id}
            style={[styles.sunnahCard, { backgroundColor: sunnah.color }]}
            onPress={() => alert(`${sunnah.title}`)}
          >
            <Text style={styles.sunnahIcon}>{sunnah.icon}</Text>
            <Text style={styles.sunnahText}>{sunnah.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPrayerTimes = () => {
    return (
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
  };

  
  const prayerTimes = () => {
    return (
      <View style={styles.prayerContainer}>
        <Text style={styles.sectionTitle}>নামাজের সময় 🕌</Text>
        <PrayerPage
    
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#42c819ff" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.greeting}>আসসালামু আলাইকুম</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPrayerTimes()}
        {/* {prayerTimes()} */}

        {renderQuickAccess()}
        {renderAppSections()}
        {renderSunnahSection()}
                {renderHadithSlider()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#18c520ff',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  greeting: { fontSize: 18, color: '#FFFFFF', fontWeight: '400' },
  userName: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold', marginTop: 5 },
  date: { fontSize: 14, color: '#C8E6C9', marginTop: 5, fontWeight: '400' },
  scrollView: { flex: 1, paddingHorizontal: 10 },
  sectionContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginBottom: 15, textAlign: 'center' },

  // Hadith Slider
  hadithCard: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  hadithText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontStyle: 'italic', marginBottom: 15, textAlign: 'center' },
  hadithSource: { fontSize: 14, color: '#E0E0E0', textAlign: 'center', marginBottom: 15 },
  hadithIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#FFFFFF' },

  // Quick Access
  quickAccessContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  quickAccessCardWrapper: { width: '48%', borderRadius: 15, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  quickAccessCard: { padding: 20, alignItems: 'center', justifyContent: 'center', height: 130 },
  quickAccessIcon: { fontSize: 35, marginBottom: 8 },
  quickAccessTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 4 },
  quickAccessSubtitle: { fontSize: 12, color: '#FFFFFF', opacity: 0.8, textAlign: 'center' },

  // App Sections Grid
  sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionCard: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
  },
  sectionIcon: { fontSize: 30, marginBottom: 8 },
  sectionText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },

  // Sunnah Grid
  sunnahGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sunnahCard: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
  },
  sunnahIcon: { fontSize: 30, marginBottom: 8 },
  sunnahText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },

  // Prayer Times
  prayerContainer: { marginTop:1, marginBottom: 1},
});

export default IslamicAppHome;