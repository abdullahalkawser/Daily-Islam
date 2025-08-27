import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const duasCategories = [
  {
    id: 1,
    title: "সকাল সন্ধ্যার দোয়া",
    duas: [
      {
        name: "সকালের দোয়া",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        bangla: "আমরা সকালে উপনীত হয়েছি এবং সমগ্র রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর জন্য।",
        transliteration: "Asbahna wa asbahal mulku lillahi wal hamdu lillah",
      },
      {
        name: "সন্ধ্যার দোয়া",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        bangla: "আমরা সন্ধ্যায় উপনীত হয়েছি এবং সমগ্র রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর জন্য।",
        transliteration: "Amsaina wa amsal mulku lillahi wal hamdu lillah",
      },
    ],
  },
  {
    id: 2,
    title: "ঘুমের দোয়া",
    duas: [
      {
        name: "ঘুমানোর দোয়া",
        arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ",
        bangla: "হে আমার প্রভু! আপনার নামেই আমি পার্শ্ব রাখি এবং আপনার সাহায্যেই তা উঠাই।",
        transliteration: "Bismika rabbi wada'tu janbi wa bika arfa'uh",
      },
      {
        name: "ঘুম থেকে জাগার দোয়া",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        bangla: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের মৃত্যুর পর জীবিত করলেন এবং তাঁরই কাছে পুনরুত্থান।",
        transliteration: "Alhamdulillahil ladhi ahyana ba'da ma amatana wa ilaihin nushur",
      },
    ],
  },
  {
    id: 3,
    title: "দৈনন্দিন দোয়া",
    duas: [
      {
        name: "খাবারের পূর্বে",
        arabic: "بِسْمِ اللَّهِ",
        bangla: "আল্লাহর নামে (শুরু করছি)।",
        transliteration: "Bismillah",
      },
      {
        name: "খাবারের পরে",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا",
        bangla: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের খাওয়ালেন ও পান করালেন।",
        transliteration: "Alhamdulillahil ladhi at'amana wa saqana",
      },
      {
        name: "বাড়ি থেকে বের হওয়ার দোয়া",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ",
        bangla: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করলাম।",
        transliteration: "Bismillahi tawakkaltu alallah",
      },
    ],
  },
  {
    id: 4,
    title: "খাবারের দোয়া",
    duas: [
      {
        name: "খাবার শুরুর দোয়া",
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا",
        bangla: "হে আল্লাহ! আপনি আমাদের যা রিযিক দিয়েছেন তাতে বরকত দিন।",
        transliteration: "Allahumma barik lana fima razaqtana",
      },
      {
        name: "পানি পানের দোয়া",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا",
        bangla: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের মিষ্টি পানি পান করিয়েছেন।",
        transliteration: "Alhamdulillahil ladhi saqana adhban furatan",
      },
    ],
  },
  {
    id: 5,
    title: "ভ্রমণের দোয়া",
    duas: [
      {
        name: "যানবাহনে চড়ার দোয়া",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
        bangla: "পবিত্র তিনি যিনি এটি আমাদের অধীনস্থ করে দিয়েছেন, অথচ আমরা এটি নিয়ন্ত্রণে আনতে সক্ষম ছিলাম না।",
        transliteration: "Subhanal ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
      },
      {
        name: "নিরাপদে পৌঁছানোর দোয়া",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي نَجَّانَا مِنَ الْقَوْمِ الظَّالِمِينَ",
        bangla: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদেরকে জালিম সম্প্রদায় থেকে নিরাপত্তা দিয়েছেন।",
        transliteration: "Alhamdulillahil ladhi najjana minal qawmidh dhalimin",
      },
    ],
  },
  {
    id: 6,
    title: "অধ্যয়নের দোয়া",
    duas: [
      {
        name: "পড়ার পূর্বে",
        arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي",
        bangla: "হে আল্লাহ! আপনি আমাকে যা শিখিয়েছেন তা দ্বারা উপকৃত করুন এবং যা আমার উপকারী তা শেখান।",
        transliteration: "Allahumman fa'ni bima allamtani wa allimni ma yanfa'uni",
      },
      {
        name: "পড়ার পরে",
        arabic: "اللَّهُمَّ زِدْنِي عِلْمًا",
        bangla: "হে আল্লাহ! আমার জ্ঞান বৃদ্ধি করুন।",
        transliteration: "Allahumma zidni ilman",
      },
    ],
  },
];

const { width } = Dimensions.get("window");

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = useState(duasCategories[0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    animateList();
  }, [selectedCategory]);

  const animateList = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      1: "book",
      2: "moon",
      3: "sunny",
      4: "restaurant",
      5: "car",
      6: "school",
      default: "bookmark",
    };
    return icons[categoryId] || icons.default;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Ionicons name="moon" size={32} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>দোয়া সমগ্র</Text>
          <Text style={styles.headerSubtitle}>ইসলামিক দোয়া সংগ্রহ</Text>
        </View>
        <View style={styles.decorativePattern}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[styles.patternCircle, { opacity: 0.1 + i * 0.05 }]} />
          ))}
        </View>
      </LinearGradient>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>বিভাগসমূহ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {duasCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCategory.id === cat.id && styles.categoryCardActive,
              ]}
              onPress={() => handleCategoryPress(cat)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  selectedCategory.id === cat.id && styles.categoryIconContainerActive,
                ]}
              >
                <Ionicons
                  name={getCategoryIcon(cat.id)}
                  size={24}
                  color={selectedCategory.id === cat.id ? "#fff" : "#667eea"}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory.id === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.listTitle}>
          {selectedCategory.title} ({selectedCategory.duas.length} টি দোয়া)
        </Text>

        <FlatList
          data={selectedCategory.duas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.duaCard} activeOpacity={0.9}>
              <View style={styles.duaCardHeader}>
                <View style={styles.duaNumberContainer}>
                  <Text style={styles.duaNumber}>{index + 1}</Text>
                </View>
                <View style={styles.duaHeaderText}>
                  <Text style={styles.duaName}>{item.name}</Text>
                  <View style={styles.duaTagContainer}>
                    <Ionicons name="bookmark" size={12} color="#667eea" />
                    <Text style={styles.duaTag}>{selectedCategory.title}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.favoriteBtn}>
                  <Ionicons name="heart-outline" size={20} color="#667eea" />
                </TouchableOpacity>
              </View>

              <View style={styles.arabicContainer}>
                <Text style={styles.duaArabic}>{item.arabic}</Text>
              </View>

              <View style={styles.translationContainer}>
                <View style={styles.translationRow}>
                  <Ionicons name="language" size={16} color="#6b7280" />
                  <Text style={styles.duaBangla}>{item.bangla}</Text>
                </View>
                <View style={styles.translationRow}>
                  <Ionicons name="text" size={16} color="#6b7280" />
                  <Text style={styles.duaTranslit}>{item.transliteration}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="volume-medium" size={18} color="#667eea" />
                  <Text style={styles.actionBtnText}>শুনুন</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="share-outline" size={18} color="#667eea" />
                  <Text style={styles.actionBtnText}>শেয়ার</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="copy-outline" size={18} color="#667eea" />
                  <Text style={styles.actionBtnText}>কপি</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerGradient: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, position: "relative", overflow: "hidden" },
  headerContent: { alignItems: "center", zIndex: 2 },
  headerIcon: { marginBottom: 8 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center" },
  decorativePattern: { position: "absolute", right: -50, top: 20, zIndex: 1 },
  patternCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", marginBottom: 20 },
  categoriesSection: { paddingVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1f2937", marginLeft: 20, marginBottom: 15 },
  categoriesContainer: { marginBottom: 10 },
  categoryCard: { backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, marginRight: 12, alignItems: "center", shadowColor: "#667eea", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3, borderWidth: 2, borderColor: "transparent" },
  categoryCardActive: { backgroundColor: "#667eea", borderColor: "#667eea", transform: [{ scale: 1.05 }] },
  categoryIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  categoryIconContainerActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  categoryText: { fontSize: 14, fontWeight: "600", color: "#4b5563", textAlign: "center" },
  categoryTextActive: { color: "#fff", fontWeight: "700" },
  listTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginHorizontal: 20, marginBottom: 15 },
  duaCard: { backgroundColor: "#fff", borderRadius: 24, padding: 20, marginBottom: 16, marginHorizontal: 15, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 5, borderLeftWidth: 4, borderLeftColor: "#667eea" },
  duaCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  duaNumberContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#667eea", alignItems: "center", justifyContent: "center", marginRight: 12 },
  duaNumber: { fontSize: 16, fontWeight: "800", color: "#fff" },
  duaHeaderText: { flex: 1 },
  duaName: { fontSize: 18, fontWeight: "700", color: "#1f2937", marginBottom: 4 },
  duaTagContainer: { flexDirection: "row", alignItems: "center" },
  duaTag: { fontSize: 12, color: "#667eea", fontWeight: "600", marginLeft: 4 },
  favoriteBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center" },
  arabicContainer: { backgroundColor: "#f8fafc", padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  duaArabic: { fontSize: 20, color: "#111827", fontWeight: "600", textAlign: "right", lineHeight: 32 },
  translationContainer: { marginBottom: 16 },
  translationRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  duaBangla: { fontSize: 16, color: "#374151", marginLeft: 8, flex: 1, lineHeight: 22 },
  duaTranslit: { fontSize: 14, color: "#6b7280", fontStyle: "italic", marginLeft: 8, flex: 1 },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#f8fafc" },
  actionBtnText: { fontSize: 13, color: "#667eea", fontWeight: "600", marginLeft: 4 },
});
