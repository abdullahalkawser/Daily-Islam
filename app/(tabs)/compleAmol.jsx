import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

// Dummy data for daily deeds
const DAILY_DEEDS_DATA = [
  { id: 1, title: 'ফজর নামাজ', description: 'জামাতে আদায় করা' },
  { id: 2, title: 'কোরআন তেলাওয়াত', description: '১ পৃষ্ঠা' },
  { id: 3, title: 'সকাল-সন্ধ্যার দোয়া', description: 'নিয়মিত পাঠ করা' },
  { id: 4, title: 'যোহর নামাজ', description: 'ওয়াক্তমতো আদায় করা' },
  { id: 5, title: 'আসর নামাজ', description: 'ওয়াক্তমতো আদায় করা' },
  { id: 6, title: 'মাগরিব নামাজ', description: 'ওয়াক্তমতো আদায় করা' },
  { id: 7, title: 'ইশা নামাজ', description: 'ওয়াক্তমতো আদায় করা' },
  { id: 8, title: 'ইস্তিগফার', description: '১০০ বার' },
  { id: 9, title: 'দরুদ শরীফ', description: '১০০ বার' },
];

export default function CompleteAmol() {
  const [completedDeeds, setCompletedDeeds] = useState(new Set());
  const totalDeeds = DAILY_DEEDS_DATA.length;
  const progress = completedDeeds.size / totalDeeds;
  const completedCount = completedDeeds.size;

  const toggleDeed = (id) => {
    setCompletedDeeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getDayInBangla = () => {
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const date = new Date();
    return days[date.getDay()];
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>আমার আমল</Text>
        <Text style={styles.headerSubtitle}>{getDayInBangla()}, {new Date().toLocaleDateString('bn-BD')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          style={styles.progressCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.progressText}>আপনার আজকের অগ্রগতি</Text>
          <Text style={styles.progressCount}>{completedCount} / {totalDeeds}</Text>
          <Progress.Bar
            progress={progress}
            width={width - 80}
            color="#FFFFFF"
            unfilledColor="#81C784"
            borderWidth={0}
            style={styles.progressBar}
          />
        </LinearGradient>

        <Text style={styles.sectionTitle}>আজকের আমল</Text>
        {DAILY_DEEDS_DATA.map(deed => (
          <TouchableOpacity
            key={deed.id}
            style={[
              styles.deedItem,
              completedDeeds.has(deed.id) && styles.deedItemCompleted,
            ]}
            onPress={() => toggleDeed(deed.id)}
          >
            <View style={styles.checkbox}>
              {completedDeeds.has(deed.id) && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.deedInfo}>
              <Text style={[styles.deedTitle, completedDeeds.has(deed.id) && styles.deedTitleCompleted]}>
                {deed.title}
              </Text>
              <Text style={styles.deedDescription}>
                {deed.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#C8E6C9',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20, // Overlap with the header for a smoother look
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  progressText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  progressCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  deedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deedItemCompleted: {
    backgroundColor: '#F0F4C3',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkmark: {
    fontSize: 18,
    color: '#4CAF50',
  },
  deedInfo: {
    flex: 1,
  },
  deedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  deedTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  deedDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
});