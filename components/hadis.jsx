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
import { useRouter } from "expo-router";
import { hadisCategories } from "./hadisData";

const { width } = Dimensions.get("window");

export default function HadisScreen() {
  const [selectedCategory, setSelectedCategory] = useState(hadisCategories[0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const router = useRouter();


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
      2: "leaf",
      3: "people",
      4: "restaurant",
      5: "heart",
      default: "bookmark",
    };
    return icons[categoryId] || icons.default;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#764ba2", "#667eea"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="book" size={32} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>হাদিস সমগ্র</Text>
          <Text style={styles.headerSubtitle}>সহিহ হাদিসের সংকলন</Text>
        </View>
        <View style={styles.decorativePattern}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[styles.patternCircle, { opacity: 0.1 + i * 0.05 }]} />
          ))}
        </View>
      </LinearGradient>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>হাদিসের বিভাগসমূহ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {hadisCategories.map((cat) => (
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
          {selectedCategory.title} ({selectedCategory.hadis.length} টি হাদিস)
        </Text>
        <FlatList
          data={selectedCategory.hadis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.hadisCard} activeOpacity={0.9}>
              <View style={styles.hadisCardHeader}>
                <View style={styles.hadisNumberContainer}>
                  <Text style={styles.hadisNumber}>{index + 1}</Text>
                </View>
                <View style={styles.hadisHeaderText}>
                  <Text style={styles.hadisName}>{item.name}</Text>
                </View>
              </View>

              <View style={styles.arabicContainer}>
                <Text style={styles.hadisArabic}>{item.arabic}</Text>
              </View>

              <View style={styles.translationContainer}>
                <View style={styles.translationRow}>
                  <Ionicons name="language" size={16} color="#6b7280" />
                  <Text style={styles.hadisBangla}>{item.bangla}</Text>
                </View>
                <View style={styles.translationRow}>
                  <Ionicons name="text" size={16} color="#6b7280" />
                  <Text style={styles.hadisTranslit}>{item.transliteration}</Text>
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
  backBtn: { position: "absolute", top: 60, left: 20, zIndex: 3, padding: 8 },
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
  hadisCard: { backgroundColor: "#fff", borderRadius: 24, padding: 20, marginBottom: 16, marginHorizontal: 15, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 5, borderLeftWidth: 4, borderLeftColor: "#667eea" },
  hadisCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  hadisNumberContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#667eea", alignItems: "center", justifyContent: "center", marginRight: 12 },
  hadisNumber: { fontSize: 16, fontWeight: "800", color: "#fff" },
  hadisHeaderText: { flex: 1 },
  hadisName: { fontSize: 18, fontWeight: "700", color: "#1f2937", marginBottom: 4 },
  arabicContainer: { backgroundColor: "#f8fafc", padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  hadisArabic: { fontSize: 20, color: "#111827", fontWeight: "600", textAlign: "right", lineHeight: 32 },
  translationContainer: { marginBottom: 16 },
  translationRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  hadisBangla: { fontSize: 16, color: "#374151", marginLeft: 8, flex: 1, lineHeight: 22 },
  hadisTranslit: { fontSize: 14, color: "#6b7280", fontStyle: "italic", marginLeft: 8, flex: 1 },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#f8fafc" },
  actionBtnText: { fontSize: 13, color: "#667eea", fontWeight: "600", marginLeft: 4 },
});