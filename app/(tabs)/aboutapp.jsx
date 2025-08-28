import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // or react-native-linear-gradient

// App Details
const APP_DETAILS = {
  logo: "https://placehold.co/128x128/9CA3AF/FFFFFF?text=Logo",
  name: "Clean App",
  subtitle: "A simple and intuitive tool",
  description:
    "Clean App is designed to simplify your daily tasks with a focus on a user-friendly and aesthetic interface. We believe in providing a seamless experience.",
  version: "1.0.0",
  quranicVerse: "“And for those who fear Allah, He will make their path easy.”",
};

const DEVELOPER_DETAILS = {
  name: "Your Name",
  contactEmail: "contact@yourapp.com",
  website: "https://www.yourapp.com",
};

export default function AboutApp() {
  return (
    <LinearGradient
      colors={["#eef2ff", "#e0f2fe", "#f0fdfa"]}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Info Section */}
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: APP_DETAILS.logo }} style={styles.logo} />
          </View>

          <Text style={styles.appName}>{APP_DETAILS.name}</Text>
          <Text style={styles.appSubtitle}>{APP_DETAILS.subtitle}</Text>
          <Text style={styles.description}>{APP_DETAILS.description}</Text>
        </View>

        {/* Developer Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Developed By</Text>
          <Text style={styles.devName}>{DEVELOPER_DETAILS.name}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Linking.openURL(`mailto:${DEVELOPER_DETAILS.contactEmail}`)
            }
          >
            <Text style={styles.buttonText}>📧 Email Us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(DEVELOPER_DETAILS.website)}
          >
            <Text style={styles.buttonText}>🌐 Visit Website</Text>
          </TouchableOpacity>
        </View>

        {/* Quranic Verse */}
        <View style={styles.verseContainer}>
          <Text style={styles.quranicVerse}>{APP_DETAILS.quranicVerse}</Text>
        </View>

        {/* Version Info */}
        <Text style={styles.version}>Version {APP_DETAILS.version}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20,
    alignItems: "center",
    elevation: 5, // Android shadow
  },
  logoContainer: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 15,
  },
  logo: { width: 100, height: 100, borderRadius: 50 },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1E293B",
  },
  devName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "#334155",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
    elevation: 2,
  },
  buttonText: { color: "#0284c7", fontWeight: "600", fontSize: 15 },
  verseContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
  },
  quranicVerse: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    color: "#0369a1",
  },
  version: {
    fontSize: 12,
    color: "#475569",
    marginTop: 15,
    textAlign: "center",
  },
});
