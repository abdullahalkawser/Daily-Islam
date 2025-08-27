import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ghuslSteps = [
  { id: "1", step: "নিয়ত (Niyyah)", description: "গোসলের আগে মনে মনে নিয়ত করুন। আল্লাহর সন্তুষ্টির জন্য এবং পাক-পবিত্র হওয়ার উদ্দেশ্যে গোসল করার ইচ্ছা প্রকাশ করুন। নিয়ত মুখে উচ্চারণ করা বাধ্যতামূলক নয়, মনে মনে করাই যথেষ্ট।", dua: "" },
  { id: "2", step: "হাত ধোয়া", description: "প্রথমে কব্জি পর্যন্ত দু’হাত ভালো করে ধুয়ে নিন। এর মাধ্যমে আপনি বাহ্যিক ময়লা থেকে হাতকে পরিষ্কার করে নেবেন যা পুরো গোসলের জন্য অপরিহার্য।", dua: "" },
  { id: "3", step: "শরীরের লজ্জাস্থান পরিষ্কার করা", description: "লিঙ্গ, নিতম্ব এবং শরীরের অন্য যে কোনো অংশে যদি অপবিত্রতা বা ময়লা লেগে থাকে, তা পানি দিয়ে ভালো করে পরিষ্কার করুন। এই ধাপটি পবিত্রতার জন্য খুব গুরুত্বপূর্ণ।", dua: "" },
  { id: "4", step: "পূর্ণাঙ্গ ওযু করা", description: "নামাজের জন্য যেভাবে ওযু করা হয়, সেভাবে পূর্ণাঙ্গ ওযু করুন। ওযুর প্রতিটি ধাপ সঠিকভাবে পালন করুন, যেমন- মুখ ধোয়া, কুলি করা, নাকে পানি দেওয়া, হাত ধোয়া এবং মাথা মাসেহ করা। তবে এ ওযুতে পা ধোয়ার প্রয়োজন নেই, তা গোসল শেষে ধোয়া যেতে পারে।", dua: "" },
  { id: "5", step: "মাথায় তিনবার পানি ঢালা", description: "মাথায় তিনবার পানি ঢালুন এবং আঙুল দিয়ে চুল ভিজিয়ে নিন যাতে চুলের গোড়ায় পানি পৌঁছায়। নিশ্চিত করুন যে মাথার কোনো অংশ শুকনো না থাকে।", dua: "" },
  { id: "6", step: "পুরো শরীর ধোয়া", description: "প্রথমে ডান কাঁধের উপর তিনবার পানি ঢালুন এবং পুরো ডান পাশ ধুয়ে নিন। এরপর বাম কাঁধের উপর তিনবার পানি ঢালুন এবং বাম পাশ ধুয়ে নিন। শরীরের প্রতিটি অংশ, যেমন- বগল, কুঁচকি, নাভি এবং পায়ের আঙুলের ফাঁকে পানি পৌঁছানো নিশ্চিত করুন।", dua: "" },
  { id: "7", step: "সর্বশেষ গোসল করা", description: "সবশেষে, যদি প্রয়োজন হয়, গোসলের স্থান থেকে সরে পরিষ্কার জায়গায় এসে পা ধুয়ে নিন। গোসল শেষে পরিষ্কার কাপড় পরিধান করুন।", dua: "" },
];

const ghuslDua = { id: "8", step: "গোসলের পরে দোয়া", description: "গোসলের পর পবিত্রতা লাভের শুকরিয়া আদায় করুন।", dua: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي وَطَهِّرْ قَلْبِي وَجَسَدِي\nবাংলা উচ্চারণ: “আল্লাহুম্মা ঘফির লি দানবী ও তাহাহহের ক্বলবি ও জাসাদি”\nঅর্থ: হে আল্লাহ! আমার পাপ মাফ করো এবং আমার হৃদয় ও শরীরকে বিশুদ্ধ করো।" };

const tips = [
  "গোসলের সময় পানি অপচয় করা থেকে বিরত থাকুন। নবী (সা.) খুব অল্প পানি দিয়ে গোসল করতেন।",
  "গোসলের আগে প্রয়োজন হলে নাভির নিচের পশম পরিষ্কার করে নিন।",
  "শাওয়ার ব্যবহার করলে নিশ্চিত করুন যে শরীরের সব অংশে পানি সমানভাবে পৌঁছাচ্ছে।",
  "অন্যান্য পবিত্রতার মতোই গোসলও একাগ্রতার সাথে সম্পাদন করা উচিত।",
  "শরীয়তের নিয়ম অনুযায়ী গোসল করলে সওয়াব পাওয়া যায়।",
];

const cardColors = [
  { background: "#FFF3E0", border: "#FFB74D", icon: "#FFA726" },
  { background: "#E8F5E9", border: "#81C784", icon: "#66BB6A" },
  { background: "#E3F2FD", border: "#64B5F6", icon: "#42A5F5" },
  { background: "#FBE9E7", border: "#E57373", icon: "#EF5350" },
  { background: "#F3E5F5", border: "#BA68C8", icon: "#AB47BC" },
  { background: "#E0F7FA", border: "#4DD0E1", icon: "#26C6DA" },
  { background: "#F1F8E9", border: "#AED581", icon: "#9CCC65" },
];

const duaCardColor = {
  background: "#182848",
  border: "#4b6cb7",
  icon: "#ffffff",
  text: "#ffffff",
  duaBg: "#2c3e50"
};

const GhuslPage = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4b6cb7", "#182848"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>গোসলের নিয়মাবলী</Text>
            <Text style={styles.headerSubtitle}>ইসলামের দৃষ্টিতে সঠিক পদ্ধতি</Text>
          </View>
          <Ionicons name="book-sharp" size={40} color="#fff" style={styles.headerIcon} />
        </View>
      </LinearGradient>

      {/* DUA CARD AT THE TOP */}
      <View style={[styles.card, {
        backgroundColor: duaCardColor.background,
        borderLeftColor: duaCardColor.border,
        marginTop: 20
      }]}>
        <View style={styles.stepHeader}>
          <Ionicons name="checkmark-circle" size={20} color={duaCardColor.icon} style={styles.stepIcon} />
          <Text style={[styles.step, { color: duaCardColor.text }]}>{ghuslDua.step}</Text>
        </View>
        <Text style={[styles.description, { color: duaCardColor.text }]}>{ghuslDua.description}</Text>
        <View style={[styles.duaContainer, { borderColor: duaCardColor.border, backgroundColor: duaCardColor.duaBg }]}>
          <Text style={[styles.duaText, { color: duaCardColor.icon }]}>{ghuslDua.dua}</Text>
        </View>
      </View>

      <View style={styles.introContainer}>
        <Ionicons name="water-outline" size={30} color="#4b6cb7" style={styles.introIcon} />
        <Text style={styles.introText}>
          ফরজ গোসল হলো শরীরকে পবিত্র করার একটি অপরিহার্য প্রক্রিয়া। হাদিস ও কুরআনের নির্দেশিকা অনুযায়ী এই পদ্ধতি অনুসরণ করা প্রত্যেক মুসলিমের জন্য গুরুত্বপূর্ণ। এখানে ধাপে ধাপে গোসলের সঠিক নিয়মাবলী তুলে ধরা হলো।
        </Text>
      </View>

      <FlatList
        data={ghuslSteps}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const colorSet = cardColors[index % cardColors.length];
          return (
            <View style={[styles.card, { backgroundColor: colorSet.background, borderLeftColor: colorSet.border }]}>
              <View style={styles.stepHeader}>
                <Ionicons name="checkmark-circle" size={20} color={colorSet.icon} style={styles.stepIcon} />
                <Text style={[styles.step, { color: colorSet.text || '#333' }]}>{item.id}. {item.step}</Text>
              </View>
              <Text style={[styles.description, { color: colorSet.text || '#555' }]}>{item.description}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.tipsContainer}>
        <View style={styles.tipsTitleContainer}>
          <Ionicons name="bulb-outline" size={20} color="#182848" style={styles.tipsIcon} />
          <Text style={styles.tipsTitle}>কিছু গুরুত্বপূর্ণ টিপস</Text>
        </View>
        {tips.map((tip, index) => (
          <Text key={index} style={styles.tipItem}>• {tip}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'left',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: 'left',
  },
  headerIcon: {
    marginLeft: 15,
  },
  introContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  introIcon: {
    marginRight: 10,
    marginTop: 5,
  },
  introText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderLeftWidth: 5,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIcon: {
    marginRight: 10,
  },
  step: {
    fontSize: 19,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  duaContainer: {
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  duaText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tipsContainer: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: "#e0f7fa",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderColor: '#00bcd4',
  },
  tipsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsIcon: {
    marginRight: 10,
  },
  tipsTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#182848",
  },
  tipItem: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
    lineHeight: 22,
  },
});

export default GhuslPage;