import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const sunnahData = [
  {
    category: 'নামাজ সম্পর্কিত',
    items: [
      "নামাজের আগে ওয়ূযু করা",
      "ওয়ূযুর শুরুতে “বিসমিল্লাহ” বলা",
      "ওয়ূযুর শেষের দু’টি আঙ্গুলের মাজদাহ",
      "নামাজে ধীরেধীরে পড়া",
      "সিজদার সময় সর্বাধিক অবনত হওয়া",
      "দুই সিজদার মাঝে বসা",
      "নামাজে সূরা ফাতিহা পড়া",
      "সালাম দিয়ে নামাজ শেষ করা",
      "জুম্মার নামাজে আগে আসন নেওয়া",
      "নামাজে খুশী ও মনোযোগ রাখা"
    ],
    color: '#4CAF50', // Title and checkmark color
    cardBgColor: '#E8F5E9' // Card background color
  },
  {
    category: 'খাদ্য সম্পর্কিত',
    items: [
      "খাওয়ার আগে “বিসমিল্লাহ” বলা",
      "ডান হাত দিয়ে খাওয়া",
      "ডান হাত দিয়ে পানি/দুধ/খাদ্য পান করা",
      "হালকা খাওয়া, অতিরিক্ত না খাওয়া",
      "খাদ্য ভাগ করে খাওয়া",
      "অপ্রয়োজনীয় ফেলে না দেওয়া",
      "খাবারের আগে ছোট ছোট টুকরো খাওয়া",
      "খাবারের পরে “আলহামদুলিল্লাহ” ধন্যবাদ বলা",
      "খাওয়ার সময় বসে খাওয়া",
      "খাবারের সময় কথা কম বলা"
    ],
    color: '#2196F3', // Title and checkmark color
    cardBgColor: '#E3F2FD' // Card background color
  },
  {
    category: 'দৈনন্দিন জীবন',
    items: [
      "অজীবন সময় ইশা নামাজ শেষ করা",
      "ঘুমানোর আগে দোয়া বলা",
      "ঘুমানোর আগে ডান দিক দিয়ে শোয়ো",
      "মানুষকে সালাম দেওয়া",
      "ভালো স্বভাব রাখা",
      "মানুষকে ক্ষমা করা",
      "বড়দের সম্মান করা",
      "ছোটদের সঙ্গে সদয় আচরণ করা",
      "দরিদ্র ও অনাথদের সাহায্য করা",
      "পরিশ্রম ও সৎ উপার্জন করা"
    ],
    color: '#FF9800', // Title and checkmark color
    cardBgColor: '#FFF3E0' // Card background color
  },
  {
    category: 'স্বাস্থ্য ও পরিচ্ছন্নতা',
    items: [
      "মুখ ও দাঁত পরিষ্কার রাখা (মিসওয়াক)",
      "হাত ও মুখ প্রায়ই ধোয়া",
      "শরীর পরিষ্কার রাখা",
      "নখ কাটা ও চুল পরিষ্কার রাখা",
      "শরীরের দুর্গন্ধ দূর করা",
      "শারীরিক পরিশ্রম ও হালকা ব্যায়াম",
      "জায়গা পরিষ্কার রাখা",
      "জায়গা অযাচিত বস্তুর জন্য ঘন ঘন পরিষ্কার করা",
      "ত্বকের যত্ন নেওয়া (সদাচরণে মৃদু হওয়া)",
      "জল/পানি খাওয়া ও দেহ পরিচ্ছন্ন রাখা"
    ],
    color: '#9C27B0', // Title and checkmark color
    cardBgColor: '#F3E5F5' // Card background color
  }
];

export default function SunnahCategories({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderItem = ({ item, index, categoryIndex, color }) => {
    const key = `${categoryIndex}-${index}`;
    const checked = checkedItems[key] || false;
    return (
      <TouchableOpacity
        onPress={() => toggleCheck(categoryIndex, index)}
        style={[styles.itemCard, { backgroundColor: checked ? color + '40' : '#f0f0f0' }]}
      >
        <Ionicons
          name={checked ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={checked ? color : '#777'}
          style={styles.icon}
        />
        <Text style={[styles.itemText, { textDecorationLine: checked ? 'line-through' : 'none', color: checked ? color : '#333' }]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={["#4b6cb7", "#182848"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {/* Back button functionality is a placeholder as 'navigation' prop is not guaranteed in all contexts */}
          <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>নবী (সাঃ)-এর দৈনন্দিন সুন্নাহ</Text>
            <Text style={styles.headerSubtitle}>আপনার পছন্দের সুন্নাহগুলো চিহ্নিত করুন।</Text>
          </View>
          <Ionicons name="book-sharp" size={40} color="#fff" style={styles.headerIcon} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {sunnahData.map((category, catIndex) => (
          <View key={catIndex} style={[styles.categoryCard, { backgroundColor: category.cardBgColor }]}>
            <View style={[styles.categoryHeader, { borderLeftColor: category.color }]}>
              <Text style={[styles.categoryTitle, { color: category.color }]}>{category.category}</Text>
            </View>
            <FlatList
              data={category.items}
              keyExtractor={(item, index) => `${catIndex}-${index}`}
              renderItem={({ item, index }) => renderItem({ item, index, categoryIndex: catIndex, color: category.color })}
              scrollEnabled={false} // Prevents nested scrolling issues
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 5,
  },
  headerIcon: {
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  categoryCard: {
    // The background color is now dynamic, so it's removed from here
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryHeader: {
    marginBottom: 10,
    borderLeftWidth: 5,
    paddingLeft: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
});
