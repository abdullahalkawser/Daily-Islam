import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const arabicData = [
  {
    category: 'আরবি বর্ণমালা',
    items: [
      { text: "আলিফ (أ)", pronunciation: "A-lif" },
      { text: "বা (ب)", pronunciation: "Ba" },
      { text: "তা (ت)", pronunciation: "Ta" },
      { text: "সা (ث)", pronunciation: "Sa" },
      { text: "জিম (ج)", pronunciation: "Jim" },
      { text: "হা (ح)", pronunciation: "Ha" },
      { text: "খা (خ)", pronunciation: "Kha" },
      { text: "দাল (د)", pronunciation: "Dal" },
      { text: "জাল (ذ)", pronunciation: "Zal" },
      { text: "রা (ر)", pronunciation: "Ra" },
      { text: "যা (ز)", pronunciation: "Za" },
      { text: "সিন (س)", pronunciation: "Sin" },
      { text: "শিন (ش)", pronunciation: "Shin" },
    ],
    color: '#3498db', // Blue
    cardBgColor: '#eaf4ff' // Light Blue
  },
  {
    category: 'সাধারণ শব্দ ও বাক্য',
    items: [
      { text: "আসসালামু আলাইকুম", pronunciation: "As-salamu alaykum" },
      { text: "ওয়ালাইকুমুস সালাম", pronunciation: "Wa alaykum as-salam" },
      { text: "শুভ সকাল", pronunciation: "Sabah al-khair" },
      { text: "ধন্যবাদ", pronunciation: "Shukran" },
      { text: "ইনশাআল্লাহ", pronunciation: "In sha' Allah" },
      { text: "মাশাআল্লাহ", pronunciation: "Masha'Allah" },
      { text: "আলহামদুলিল্লাহ", pronunciation: "Alhamdulillah" },
      { text: "আল্লাহু আকবার", pronunciation: "Allahu Akbar" },
      { text: "কিভাবে আছেন?", pronunciation: "Kaifa haluka?" },
      { text: "আমি ভালো আছি", pronunciation: "Ana bi-khair" },
      { text: "খুব ভালো", pronunciation: "Jayyid jiddan" },
      { text: "বিদায়", pronunciation: "Ma'a as-salama" }
    ],
    color: '#2ecc71', // Green
    cardBgColor: '#e9f8f2' // Light Green
  },
  {
    category: 'দৈনন্দিন কথোপকথন',
    items: [
      { text: "আমার নাম...", pronunciation: "Ismi..." },
      { text: "আপনি কি...? (ছেলে)", pronunciation: "Hal anta...?" },
      { text: "আপনি কি...? (মেয়ে)", pronunciation: "Hal anti...?" },
      { text: "আমি একটি বই চাই", pronunciation: "Uridu kitaban" },
      { text: "আমি ক্ষুধার্ত", pronunciation: "Ana ja'an" },
      { text: "কত দাম?", pronunciation: "Kam as-si'r?" },
      { text: "ঠিক আছে", pronunciation: "Hasanan" },
      { text: "জল", pronunciation: "Ma" },
      { text: "খাবার", pronunciation: "Ta'am" },
      { text: "আমি জানি না", pronunciation: "La a'rif" }
    ],
    color: '#f1c40f', // Yellow
    cardBgColor: '#fff9e5' // Light Yellow
  },
  {
    category: 'পরিবার ও সম্পর্ক',
    items: [
      { text: "মা", pronunciation: "Umm" },
      { text: "বাবা", pronunciation: "Ab" },
      { text: "ভাই", pronunciation: "Akh" },
      { text: "বোন", pronunciation: "Ukht" },
      { text: "ছেলে", pronunciation: "Ibn" },
      { text: "মেয়ে", pronunciation: "Bint" },
      { text: "স্বামী", pronunciation: "Zauj" },
      { text: "স্ত্রী", pronunciation: "Zaujah" },
      { text: "বন্ধু", pronunciation: "Sadiq" },
      { text: "পরিবার", pronunciation: "Usrah" }
    ],
    color: '#9b59b6', // Purple
    cardBgColor: '#f5e9f8' // Light Purple
  }
];

export default function ArabicLearningPage({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [completedCategory, setCompletedCategory] = useState(null);

  const toggleCheck = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    
    // Toggle the checked state
    setCheckedItems(prev => {
      const newCheckedItems = {
        ...prev,
        [key]: !prev[key]
      };
      
      // Check if all items in the category are now checked
      const categoryItems = arabicData[categoryIndex].items;
      const allChecked = categoryItems.every((_, index) => {
        return newCheckedItems[`${categoryIndex}-${index}`];
      });
      
      if (allChecked) {
        setCompletedCategory(arabicData[categoryIndex].category);
        setShowPopup(true);
      }
      
      return newCheckedItems;
    });
  };

  const closePopup = () => {
    setShowPopup(false);
    // Optionally, reset the checked items for the completed category
    if (completedCategory) {
      const categoryIndex = arabicData.findIndex(cat => cat.category === completedCategory);
      const categoryItems = arabicData[categoryIndex].items;
      const newCheckedItems = { ...checkedItems };
      categoryItems.forEach((_, index) => {
        const key = `${categoryIndex}-${index}`;
        delete newCheckedItems[key];
      });
      setCheckedItems(newCheckedItems);
      setCompletedCategory(null);
    }
  };

  const renderItem = ({ item, index, categoryIndex, color }) => {
    const key = `${categoryIndex}-${index}`;
    const checked = checkedItems[key] || false;
    return (
      <TouchableOpacity
        onPress={() => toggleCheck(categoryIndex, index)}
        style={[styles.itemCard, { backgroundColor: checked ? color + '40' : '#f0f0f0' }]}
      >
        <View style={styles.itemTextContainer}>
          <Text style={[styles.itemTextArabic, { textDecorationLine: checked ? 'line-through' : 'none', color: checked ? color : '#333' }]}>
            {item.text}
          </Text>
          <Text style={[styles.itemTextPronunciation, { color: checked ? color : '#777' }]}>
            {item.pronunciation}
          </Text>
        </View>
        <Ionicons
          name={checked ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={checked ? color : '#777'}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={["#34495e", "#2c3e50"]}
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
            <Text style={styles.headerTitle}>আরবি ভাষা শেখা</Text>
            <Text style={styles.headerSubtitle}>সহজেই আরবি শব্দ শিখুন এবং অনুশীলন করুন</Text>
          </View>
          <Ionicons name="language" size={40} color="#fff" style={styles.headerIcon} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {arabicData.map((category, catIndex) => (
          <View key={catIndex} style={[styles.categoryCard, { backgroundColor: category.cardBgColor }]}>
            <View style={[styles.categoryHeader, { borderLeftColor: category.color }]}>
              <Text style={[styles.categoryTitle, { color: category.color }]}>{category.category}</Text>
            </View>
            <FlatList
              data={category.items}
              keyExtractor={(item, index) => `${catIndex}-${index}`}
              renderItem={({ item, index }) => renderItem({ item, index, categoryIndex: catIndex, color: category.color })}
              scrollEnabled={false}
            />
          </View>
        ))}
      </ScrollView>

      {/* Completion Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopup}
        onRequestClose={closePopup}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Ionicons name="trophy" size={60} color="#f1c40f" style={styles.trophyIcon} />
            <Text style={styles.modalTitle}>অভিনন্দন!</Text>
            <Text style={styles.modalText}>
              আপনি "{completedCategory}" অধ্যায়ের সমস্ত শব্দ শিখে ফেলেছেন!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePopup}
            >
              <Text style={styles.textStyle}>আবার শিখতে চান?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTextArabic: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  itemTextPronunciation: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  icon: {
    marginLeft: 10,
  },
  // Popup Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trophyIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
