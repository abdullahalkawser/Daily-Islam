import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Function to generate a lighter shade of a color
const lightenColor = (hex, percent) => {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  r = parseInt(r * (100 + percent) / 100);
  g = parseInt(g * (100 + percent) / 100);
  b = parseInt(b * (100 + percent) / 100);

  r = (r<255)?r:255;
  g = (g<255)?g:255;
  b = (b<255)?b:255;

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const ramadanData = [
  {
    category: 'সিয়ামের প্রস্তুতি ও নিয়ত',
    items: [
      { text: "রমজানের চাঁদ দেখা", arabic: "اَللّٰهُمَّ اَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْاِيْمَانِ وَالسَّلَامَةِ وَالْاِسْلَامِ رَبِّيْ وَرَبُّكَ اللهُ" },
      { text: "সাহরি খাওয়া", arabic: "بِاسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ" },
      { text: "সাহরির শেষ সময়ে খাওয়া", arabic: "সকালের আযানের আগে খাওয়া" },
      { text: "সাহরির নিয়ত", arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ" },
      { text: "রমজানে সদকা করা", arabic: "সদকায়ে ফিতর ও সাধারণ সদকা" }
    ],
    color: '#8e44ad'
  },
  {
    category: 'দৈনিক ইবাদত ও নামাজ',
    items: [
      { text: "ফজরের নামাজ", arabic: "সালাতুল ফজর" },
      { text: "ইশরাকের নামাজ", arabic: "সালাতুল ইশরাক" },
      { text: "যোহরের নামাজ", arabic: "সালাতুল যোহর" },
      { text: "আছরের নামাজ", arabic: "সালাতুল আছর" },
      { text: "মাগরিবের নামাজ", arabic: "সালাতুল মাগরিব" },
      { text: "ঈশার নামাজ", arabic: "সালাতুল ঈশা" },
      { text: "তাহাজ্জুদের নামাজ", arabic: "সালাতুল তাহাজ্জুদ" },
      { text: "পাঁচ ওয়াক্ত নামাজ জামাতে আদায় করা", arabic: "সালাতুল জামাত" },
      { text: "নিয়মিত ফজর ও ইশার নামাজ জামাতে পড়া", arabic: "ফজর ও ইশার নামাজ জামাত" },
      { text: "দৈনিক কুরআন তিলাওয়াত", arabic: "তিলাওয়াতুল কুরআন" },
      { text: "আস্তাগফিরুল্লাহ পাঠ", arabic: "ইস্তেগফার" },
      { text: "সুবহানাল্লাহি ওয়া বিহামদিহি", arabic: "তাসবিহ" },
      { text: "আল্লাহু আকবার", arabic: "তাকবীর" },
      { text: "আলহামদুলিল্লাহ", arabic: "তাহমিদ" },
      { text: "লা ইলাহা ইল্লাল্লাহ", arabic: "কালিমা তাইয়্যিবাহ" },
      { text: "দুরূদ পাঠ", arabic: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ" },
      { text: "সকাল ও সন্ধ্যার দোয়া", arabic: "আযকারুস সাবাহ ওয়াল মাসা" },
      { text: "দৈনিক হাদিস অধ্যয়ন", arabic: "হাদিস অধ্যয়ন" },
      { text: "দান-সদকা", arabic: "ইনফাক" }
    ],
    color: '#3498db'
  },
  {
    category: 'ইফতার ও রোজা ভাঙা',
    items: [
      { text: "ইফতারের প্রস্তুতি", arabic: "দ্রুত ইফতার করা" },
      { text: "খেজুর দিয়ে ইফতার", arabic: "খুরমা বা খেজুর দিয়ে ইফতার করা" },
      { text: "ইফতারের দোয়া", arabic: "اَللَّهُمَّ لَكَ صُمْتُ وَ عَلَى رِزْقِكَ اَفْطَرْتُ" },
      { text: "ইফতারের পর দোয়া", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ" },
      { text: "ইফতারের সময় দোয়া করা", arabic: "ইফতারের সময় দোয়া কবুল হয়" },
      { text: "পানি পান করে রোজা খোলা", arabic: "ইফতার বিল মা" },
      { text: "ইফতারের আগে দোয়া করা", arabic: "ইফতারের পূর্বে দু'আ" },
      { text: "ইফতারের খাবার ভাগ করে নেওয়া", arabic: "ইফতার বন্টন" },
      { text: "যমযমের পানি পান", arabic: "শুরুব বিল যমযম" },
      { text: "অযুর পর দোয়া", arabic: "আশহাদু আল্লাহ ইলাহা..." }
    ],
    color: '#e74c3c'
  },
  {
    category: 'কুরআন ও ইবাদত',
    items: [
      { text: "কুরআন তেলাওয়াত", arabic: "তিলাওয়াতুল কুরআন" },
      { text: "কুরআন বোঝা ও গবেষণা", arabic: "তাফসির ও গবেষণা" },
      { text: "নফল নামাজ পড়া", arabic: "সালাতুল নফল" },
      { text: "সাদাকাতুল ফিতর", arabic: "ফিতরা দান করা" },
      { text: "যাকাত আদায়", arabic: "যাকাত প্রদান করা" },
      { text: "যিকির ও তাসবিহ", arabic: "সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার" },
      { text: "দু'আ করা", arabic: "সর্বদা দু'আ করা" },
      { text: "দৈনিক হাদিস অধ্যয়ন", arabic: "হাদিস অধ্যয়ন" },
      { text: "বেশি করে তওবা করা", arabic: "তওবা করা" },
      { text: "সকালে ও সন্ধ্যায় যিকির", arabic: "আযকারুস সাবাহ ওয়াল মাসা" },
      { text: "নফল রোজা রাখা", arabic: "নফল সিয়াম" },
      { text: "দান-সদকা করা", arabic: "ইনফাক" }
    ],
    color: '#f39c12'
  },
  {
    category: 'তারাবীহ ও লাইলাতুল কদর',
    items: [
      { text: "তারাবীহর নামাজ", arabic: "সালাতুল তারাবীহ" },
      { text: "লাইলাতুল কদরের ইবাদত", arabic: "লাইলাতুল কদর তালাশ করা" },
      { text: "ইতিকাফ করা", arabic: "মসজিদে ইতিকাফ করা" },
      { text: "শেষ ১০ দিনে ইবাদত", arabic: "শেষ দশকে ইবাদত বাড়ানো" },
      { text: "শবে কদরের দোয়া", arabic: "اَللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي" }
    ],
    color: '#16a085'
  },
  {
    category: 'অন্যান্য আমল',
    items: [
      { text: "কদর রাতে কিয়াম করা", arabic: "কিয়ামুল লাইল" },
      { text: "আযানের জবাব দেওয়া", arabic: "আযান শুনে উত্তর দেওয়া" },
      { text: "প্রতিদিন ইস্তেগফার করা", arabic: "আস্তাগফিরুল্লাহ" },
      { text: "বেশি করে সালাম দেওয়া", arabic: "আসসালামু আলাইকুম" },
      { text: "বেশি করে দরুদ পড়া", arabic: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ" },
      { text: "খাবার বিতরন করা", arabic: "গরিবকে খাবার দেওয়া" },
      { text: "অতিরিক্ত সদকা করা", arabic: "সালাতুল সদকা" },
      { text: "আয়তুল কুরসি পড়া", arabic: "আয়তুল কুরসি" },
      { text: "বেশি করে জিকির করা", arabic: "সুবহানাল্লাহ ওয়া বিহামদিহি" },
    ],
    color: '#2c3e50'
  }
];

// Calculate total number of items
const totalItems = ramadanData.reduce((count, category) => count + category.items.length, 0);

export default function RamadanAmolsPage({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [visibleCategories, setVisibleCategories] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [completedCategory, setCompletedCategory] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initial calculation of progress on load
    const completedCount = Object.keys(checkedItems).length;
    setProgress(completedCount / totalItems);
  }, [checkedItems]);

  const toggleCheck = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    
    setCheckedItems(prev => {
      const newCheckedItems = {
        ...prev,
        [key]: !prev[key]
      };
      
      const categoryItems = ramadanData[categoryIndex].items;
      const allChecked = categoryItems.every((_, index) => {
        return newCheckedItems[`${categoryIndex}-${index}`];
      });
      
      if (allChecked && !prev[key]) { // Trigger popup only on first completion
        setCompletedCategory(ramadanData[categoryIndex].category);
        setShowPopup(true);
      }
      
      return newCheckedItems;
    });
  };

  const toggleVisibility = (categoryIndex) => {
    setVisibleCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const closePopup = () => {
    setShowPopup(false);
    if (completedCategory) {
      const categoryIndex = ramadanData.findIndex(cat => cat.category === completedCategory);
      const categoryItems = ramadanData[categoryIndex].items;
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
          <Text style={[styles.itemTextBangla, { textDecorationLine: checked ? 'line-through' : 'none', color: checked ? color : '#333' }]}>
            {item.text}
          </Text>
          <Text style={[styles.itemTextArabic, { color: checked ? color : '#777' }]}>
            {item.arabic}
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
          <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>রমজানের আমল ও ইবাদত</Text>
            <Text style={styles.headerSubtitle}>ফজর থেকে তারাবীহ পর্যন্ত সকল আমল</Text>
          </View>
          <Ionicons name="moon" size={40} color="#fff" style={styles.headerIcon} />
        </View>
      </LinearGradient>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% সম্পন্ন হয়েছে
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {ramadanData.map((category, catIndex) => (
          <LinearGradient
            key={catIndex}
            colors={[category.color, lightenColor(category.color, 40)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryCard}
          >
            <TouchableOpacity onPress={() => toggleVisibility(catIndex)} style={styles.categoryHeader}>
              <Text style={[styles.categoryTitle]}>{category.category}</Text>
              <Ionicons
                name={visibleCategories[catIndex] ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            {visibleCategories[catIndex] && (
              <FlatList
                data={category.items}
                keyExtractor={(item, index) => `${catIndex}-${index}`}
                renderItem={({ item, index }) => renderItem({ item, index, categoryIndex: catIndex, color: '#fff' })}
                scrollEnabled={false}
              />
            )}
          </LinearGradient>
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
              আপনি "{completedCategory}" অধ্যায়ের সমস্ত আমল সম্পন্ন করেছেন!
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
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
  itemTextBangla: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  itemTextArabic: {
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
