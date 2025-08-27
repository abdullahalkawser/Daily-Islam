import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const routines = [
  {
    id: "1",
    title: "সকালের আমল (Fajr / Morning Routine)",
    steps: [
      {
        step: "নামাজ",
        description: "ফজরের নামাজ: ২ রাকাত ফরজ।\nফজরের সুন্নত: ২ রাকাত সুন্নত (সালাতুস সুন্নাহ)।"
      },
      {
        step: "দোয়া ও যিকির",
        description: `আযান-ইনসানির পরে বা ঘুম থেকে উঠার পরে:\n• Subhanallah – ৩৩ বার\n• Alhamdulillah – ৩৩ বার\n• Allahu Akbar – ৩৪ বার`,
        dua: `اللّهُـمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ\nঅর্থ: হে আল্লাহ! তুমি আমার রব, তোমার সিফাত ছাড়া কোনো উপাস্য নেই। তুমি আমাকে সৃষ্টি করেছ এবং আমি তোমার বান্দা।`
      },
      {
        step: "অতিরিক্ত আমল",
        description: "কোরআন তেলাওয়াত (যেমন সূরা ইয়াসিন বা অন্যান্য সূরা)।\nনফল নামাজ।\nদিনটি আল্লাহর সন্তুষ্টির জন্য শুরু করা।"
      }
    ]
  },
  {
    id: "2",
    title: "সন্ধ্যার আমল (Maghrib / Evening Routine)",
    steps: [
      {
        step: "নামাজ",
        description: "মাগরিবের নামাজ: ৩ রাকাত ফরজ + ২ রাকাত সুন্নত।"
      },
      {
        step: "দোয়া ও যিকির",
        description: "কোরআন পাঠ।\n• Subhanallah, Alhamdulillah, Allahu Akbar – ১০ বার করে।",
        dua: `اللّهُمَّ إني أسألك خير هذه الليلة وفتحها وبركتها\nঅর্থ: হে আল্লাহ! আমি তোমার কাছে প্রার্থনা করছি এই রাতের ভালোর জন্য, এর ফাযিলত ও বরকতের জন্য।`
      },
      {
        step: "অতিরিক্ত আমল",
        description: "নফল নামাজ ২-৪ রাকাত।\nAstaghfirullah, La ilaha illallah, Subhanallah wa bihamdihi – ১০ বার।\nপরিবার ও প্রিয়জনের জন্য দোয়া।"
      }
    ]
  }
];

const GhuslRoutinePage = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="sunny" size={32} color="#fff" style={{ marginBottom: 8 }} />
        <Text style={styles.headerTitle}>সকাল ও সন্ধ্যার আমল</Text>
        <Text style={styles.headerSubtitle}>নামাজ, দোয়া ও অতিরিক্ত আমল</Text>
      </LinearGradient>

      {routines.map((routine) => (
        <View key={routine.id} style={styles.routineContainer}>
          <Text style={styles.routineTitle}>{routine.title}</Text>
          {routine.steps.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#667eea" style={{ marginRight: 8 }} />
                <Text style={styles.step}>{item.step}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              {item.dua ? <Text style={styles.dua}>{item.dua}</Text> : null}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerGradient: { paddingVertical: 40, paddingHorizontal: 16, alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 16, color: "#e0e0e0", marginTop: 4 },
  routineContainer: { marginTop: 16 },
  routineTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginHorizontal: 16, marginBottom: 8 },
  card: { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  step: { fontSize: 18, fontWeight: "600", color: "#333" },
  description: { fontSize: 16, color: "#555", lineHeight: 22 },
  dua: { fontSize: 15, color: "#006400", marginTop: 8, lineHeight: 20 },
});

export default GhuslRoutinePage;
