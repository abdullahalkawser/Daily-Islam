import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const APP_SECTIONS = [
  { id: 1, title: "Hadith", icon: "📖", color: "#2E7D32", route: "/" },
  { id: 2, title: "Duas", icon: "🤲", color: "#1976D2", route: "/duas" },
  { id: 3, title: "Tasbih", icon: "📿", color: "#7B1FA2", route: "/tasbih" },
  { id: 4, title: "Zakat", icon: "💰", color: "#F57C00", route: "/zakat" },
  { id: 5, title: "Kitab", icon: "📚", color: "#5D4037", route: "/kitab" },
  { id: 6, title: "Sadaqah", icon: "❤️", color: "#C62828", route: "/sadaqah" },
];

export default function SectionsPage() {
  const router = useRouter();

  const handlePress = (section) => {
    if (section.route) {
      router.push(section.route);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore Sections</Text>

      {APP_SECTIONS.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={[styles.button, { backgroundColor: section.color }]}
          onPress={() => handlePress(section)}
        >
          <Text style={styles.icon}>{section.icon}</Text>
          <Text style={styles.text}>{section.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    fontSize: 22,
    marginRight: 15,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
});
