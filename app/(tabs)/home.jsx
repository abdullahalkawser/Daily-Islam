import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Dummy Data in Bangla
const HADITHS = [
  { id: 1, text: "সবচেয়ে উত্তম মানুষ হল যারা অন্যদের উপকার করে।", source: "নবী করিম (সা.)" },
  { id: 2, text: "দয়া বিশ্বাসের একটি চিহ্ন, আর যে দয়ালু নয়, তার বিশ্বাস নেই।", source: "নবী করিম (সা.)" },
  { id: 3, text: "বিশ্বাসী সে নয় যে ভুঁড়ি ভর্তি খায় যখন প্রতিবেশী ক্ষুধার্ত থাকে।", source: "নবী করিম (সা.)" },
  { id: 4, text: "ভাল কথা বলুন বা নীরব থাকুন।", source: "নবী করিম (সা.)" },
  { id: 5, text: "আল্লাহর কাছে সবচেয়ে প্রিয় কাজ হলো ধারাবাহিকতা, যদিও তা সামান্য হয়।", source: "নবী করিম (সা.)" },
];

const DAILY_TASKS_DEFAULT = [
  { id: 1, title: 'সকাল ধিকর', description: 'সকালের স্মরণ পাঠ করুন' },
  { id: 2, title: 'কোরআন পাঠ', description: 'প্রতি দিন ১ পৃষ্ঠা' },
  { id: 3, title: 'তসবীহ', description: 'সুবহানাল্লাহ x100' },
  { id: 4, title: 'ইস্তিগফার', description: 'মাফ চাইতে হবে' },
  { id: 5, title: 'দরুদ শরীফ', description: 'নবীর প্রতি আশীর্বাদ পাঠ করুন' },
];

const APP_SECTIONS = [
  { id: 1, title: 'Hadith',  icon: '📖', color: '#2E7D32', route: '/hadis'  },
  { id: 2, title: 'Duas',   icon: '🤲', color: '#1976D2', route: '/duas'   },
  { id: 3, title: 'Tasbih', icon: '📿', color: '#7B1FA2', route: '/tasbih' },
  { id: 4, title: 'Zakat',  icon: '💰', color: '#F57C00', route: '/zakat'  },
  { id: 5, title: 'Kitab',  icon: '📚', color: '#5D4037', route: '/kitab'  },
  { id: 6, title: 'Sadaqah',icon: '❤️', color: '#C62828', route: '/sadaqah'},
];

const IslamicAppHome = () => {
  const router = useRouter();


const handleSectionPress = (section) => {
  if (section.route) {
    router.push(section.route);
  }
}

  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [tasks, setTasks] = useState(DAILY_TASKS_DEFAULT);
  const [newTask, setNewTask] = useState('');
  const [userName] = useState('আব্দুল্লাহ আল কাওসার');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHadithIndex(prev => (prev === HADITHS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks(prev => [...prev, { id: prev.length + 1, title: newTask, description: '' }]);
    setNewTask('');
  };

  const renderHadithSlider = () => (
    <View style={styles.hadithContainer}>
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
    <View style={styles.quickAccessContainer}>
      <TouchableOpacity style={styles.quickAccessCardWrapper} onPress={() => router.push('/ramadan')}>
        <LinearGradient
          colors={['#4CAF50', '#8BC34A']}
          style={styles.quickAccessCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.quickAccessIcon}>🌙</Text>
          <Text style={styles.quickAccessTitle}>সকাল এবং সন্ধ্যার</Text>
          <Text style={styles.quickAccessSubtitle}>সময় ও দোয়া</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickAccessCardWrapper} onPress={() => router.push('/salah-time')}>
        <LinearGradient
          colors={['#03A9F4', '#2196F3']}
          style={styles.quickAccessCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.quickAccessIcon}>⏰</Text>
          <Text style={styles.quickAccessTitle}>আজকের দিনের </Text>
          <Text style={styles.quickAccessSubtitle}>আমল ও দোয়া</Text>





        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderAppSections = () => (
    <View style={styles.sectionsContainer}>
      <Text style={styles.sectionTitle}>Explore</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.greeting}>আসসালামু আলাইকুম</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHadithSlider()}
        
        {renderQuickAccess()}
        
        {renderAppSections()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#2E7D32', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  greeting: { fontSize: 18, color: '#FFFFFF', fontWeight: '400' },
  userName: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold', marginTop: 5 },
  date: { fontSize: 14, color: '#C8E6C9', marginTop: 5 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginBottom: 15, marginTop: 20 },

  hadithContainer: { marginTop: 20 },
  hadithCard: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  hadithText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontStyle: 'italic', marginBottom: 15 },
  hadithSource: { fontSize: 14, color: '#E0E0E0', textAlign: 'right', marginBottom: 15 },
  hadithIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 2 },
  activeDot: { backgroundColor: '#FFFFFF' },

  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  quickAccessCardWrapper: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  quickAccessCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  quickAccessIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },

  sectionsContainer: { marginTop: 10 },
  sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionCard: { width: '30%', aspectRatio: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionIcon: { fontSize: 28, marginBottom: 8 },
  sectionText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },

  addTaskContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  addButton: { backgroundColor: '#2E7D32', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  checkMark: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});

export default IslamicAppHome;