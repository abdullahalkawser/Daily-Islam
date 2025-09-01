import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// The data for the prayer guide.
const prayers = [
  {
    name: "ফজর",
    rakat: "২ রাকাত ফরজ",
    steps: [
      { step: "নিয়্যাত", description: "ফজর নামাজ ফরজের নিয়্যাত করা" },
      { step: "কিয়াম", description: "সূরা আল-ফাতিহা + সূরা আল-ইখলাস" },
      { step: "রুকু", description: "سبحان রبی العظیم ৩ বার" },
      { step: "সিজদা", description: "سبحان রبی الاعلی ৩ বার" },
      { step: "তাশাহহুদ", description: "আত-তাহিয়্যাতু ... (শেষের দোয়া)" }
    ]
  },
  {
    name: "যোহর",
    rakat: "৪ রাকাত ফরজ",
    steps: [
      { step: "নিয়্যাত", description: "যোহর নামাজ ফরজের নিয়্যাত করা" },
      { step: "কিয়াম", description: "সূরা আল-ফাতিহা + যেকোনো ছোট সূরা" },
      { step: "রুকু", description: "سبحان রبی العظیم ৩ বার" },
      { step: "সিজদা", description: "سبحان রبی الاعلی ৩ বার" },
      { step: "তাশাহহুদ", description: "আত-তাহিয়্যাতু ... (শেষের দোয়া)" }
    ]
  },
  {
    name: "আছর",
    rakat: "৪ রাকাত ফরজ",
    steps: [
      { step: "নিয়্যাত", description: "আছর নামাজ ফরজের নিয়্যাত করা" },
      { step: "কিয়াম", description: "সূরা আল-ফাতিহা + যেকোনো ছোট সূরা" },
      { step: "রুকু", description: "سبحان রبی العظیم ৩ বার" },
      { step: "সিজদা", description: "سبحان রبی الاعلی ৩ বার" },
      { step: "তাশাহহুদ", description: "আত-তাহিয়্যাতু ... (শেষের দোয়া)" }
    ]
  },
  {
    name: "মাগরিব",
    rakat: "৩ রাকাত ফরজ",
    steps: [
      { step: "নিয়্যাত", description: "মাগরিব নামাজ ফরজের নিয়্যাত করা" },
      { step: "কিয়াম", description: "সূরা আল-ফাতিহা + যেকোনো ছোট সূরা" },
      { step: "রুকু", description: "سبحان রبی العظیم ৩ বার" },
      { step: "সিজদা", description: "سبحان রبی الاعلی ৩ বার" },
      { step: "তাশাহহুদ", description: "আত-তাহিয়্যাতু ... (শেষের দোয়া)" }
    ]
  },
  {
    name: "ইশা",
    rakat: "৪ রাকাত ফরজ",
    steps: [
      { step: "নিয়্যাত", description: "ইশা নামাজ ফরজের নিয়্যাত করা" },
      { step: "কিয়াম", description: "সূরা আল-ফাতিহা + যেকোনো ছোট সূরা" },
      { step: "রুকু", description: "سبحان রبی العظیم ৩ বার" },
      { step: "সিজদা", description: "سبحان রبی الاعلی ৩ বার" },
      { step: "তাশাহহুদ", description: "আত-তাহিয়্যাতু ... (শেষের দোয়া)" }
    ]
  }
];

export default function App() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpanded = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>নামাজ শেখা (বিস্তারিত)</Text>
      </View>
      {prayers.map((prayer, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => toggleExpanded(index)}
        >
          {/* Card Header with a modern gradient */}
          <LinearGradient
            colors={['#16A085', '#06B6D4']}
            style={styles.cardHeader}
          >
            <View>
              <Text style={styles.prayerName}>{prayer.name}</Text>
              <Text style={styles.prayerRakat}>{prayer.rakat}</Text>
            </View>
            <Entypo
              name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="white"
            />
          </LinearGradient>
          
          {/* Collapsible Steps Content */}
          {expandedIndex === index && (
            <View style={styles.stepsContainer}>
              {prayer.steps.map((step, idx) => (
                <View key={idx} style={styles.stepBox}>
                  {/* Small circle for step indicator */}
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{idx + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.step}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // A new, dark background color
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E5E7EB', // Lighter text for the dark background
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#374151', // A slightly lighter gray for the card
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  prayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  prayerRakat: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  stepsContainer: {
    padding: 24,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#06B6D4', // Accent color border
    borderWidth: 2,
    borderRadius: 12,
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#06B6D4', // Accent color
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6', // Lighter text color
  },
  stepDescription: {
    fontSize: 14,
    color: '#D1D5DB', // Subtle text color
    marginTop: 4,
  },
});