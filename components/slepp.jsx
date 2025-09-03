// src/components/SleepPracticesScreen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// আপনার প্রদত্ত ডেটা (যা SectionList-এর জন্য সঠিক ফরম্যাটে আছে)
const sleepPracticesData = [
  {
    id: 'step1',
    title: 'ধাপ ১: অযু করা',
    
    iconName: 'hand-water',
    data: [
      {
        id: 'step1-1',
        title: 'অযু করুন',
        description: 'ঘুমানোর আগে অযু করা সুন্নত। এটি আমাদের পবিত্র অবস্থায় ঘুমাতে সাহায্য করে।',
        hadith: 'রাসূলুল্লাহ (সা.) বলেছেন: "যখন তুমি বিছানায় যাবে, তখন নামাযের মত করে অযু করবে।"'
      }
    ]
  },
  {
    id: 'step2',
    title: 'ধাপ ২: বিছানা পরিষ্কার করা',
    iconName: 'broom',
    data: [
      {
        id: 'step2-1',
        title: 'বিছানা ঝেড়ে নিন',
        description: 'বিছানায় যাওয়ার আগে চাদর দিয়ে বিছানা তিনবার ঝেড়ে নিন।',
        arabic: 'بِسْمِ اللهِ',
        pronunciation: 'বিসমিল্লাহ',
        meaning: '(আল্লাহর নামে)'
      }
    ]
  },
  {
    id: 'step3',
    title: 'ধাপ ৩: ঘুমের দোয়া পড়া',
    iconName: 'book-open-variant',
    data: [
      {
        id: 'step3-1',
        title: 'প্রধান ঘুমের দোয়া',
        description: 'এই দোয়া পড়ে ঘুমানো সুন্নত।',
        arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
        pronunciation: 'আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহইয়া',
        meaning: 'হে আল্লাহ! তোমার নামেই আমি মরি এবং বাঁচি।'
      },
      {
        id: 'step3-2',
        title: 'সূরা ইখলাস',
        description: 'এই তিন সূরা তিনবার করে পড়ে সারা শরীরে ফুঁক দিন।',
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ (১) قُلْ هُوَ اللَّهُ أَحَدٌ (২) ٱللَّهُ ٱلصَّمَدُ (৩) لَمْ يَلِدْ وَلَمْ يُولَدْ (৪) وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (৫)',
        pronunciation: 'কুল হুওয়াল্লাহু আহাদ।আল্লাহুস সামাদ।লাম ইয়ালিদ ওয়া লাম ইউলাদ।ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ।',
        meaning: '(সূরা ইখলাস, ফালাক ও নাস পড়ুন)'
      },
         {
        id: 'step7-7',
        title: 'সূরা ফালাক',
        description: 'এই তিন সূরা তিনবার করে পড়ে সারা শরীরে ফুঁক দিন।',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (১) مِن شَرِّ مَا خَلَقَ (২) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (৩) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (৪)',
        pronunciation: '১) কুল আউযু বি রব্বিল ফালাক ২) মিন শার্রি মা খালাক ৩) ওয়া মিন শার্রি ঘাসিকই ইজা ওয়াকাব ৪) ওয়া মিন শার্রি নাফফাথাতি ফিল উকাদি ওয়া মিন শার্রি হাসিদই ইজা হাসাদ',
        meaning: '১) আমি প্রার্থনা করি আল্লাহর কাছে, যে দিনের সৃষ্টি করেছেন। ২) তাঁর সমস্ত সৃষ্টি থেকে যে খারাপি আছে। ৩) অন্ধকার রাতের শয়তান থেকে। ৪) গুটিতে নিশ্বাস ফোঁকারি করা জাদুকরের এবং হিংসুক ব্যক্তির ক্ষতি থেকে।'
      },
           {
        id: 'step7-7',
        title: 'সূরা নাস',
        description: 'এই তিন সূরা তিনবার করে পড়ে সারা শরীরে ফুঁক দিন।',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ (১) مَلِكِ النَّاسِ (২) إِلَٰهِ النَّاسِ (৩) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (৪) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (৫) مِنَ الْجِنَّةِ وَالنَّاسِ (৬)',
        pronunciation: '১) কুল আউযু বি রব্বিন নাস ২) মালিকি নাস ৩) ইলাহি নাস ৪) মিন শার্রি আল-ওয়াসওয়াসি আল-খান্নাস ৫) আল্লাযী ইউওয়াসুইসু ফী সুদুরি নাস ৬) মিনাল জিন্নাতি ওয়া নাস',
        meaning: '১) আমি প্রার্থনা করি আল্লাহর কাছে, যে দিনের সৃষ্টি করেছেন। ২) তাঁর সমস্ত সৃষ্টি থেকে যে খারাপি আছে। ৩) অন্ধকার রাতের শয়তান থেকে। ৪) গুটিতে নিশ্বাস ফোঁকারি করা জাদুকরের এবং হিংসুক ব্যক্তির ক্ষতি থেকে।'
      },
      {
        id: 'step3-3',
        title: 'আয়াতুল কুরসী',
        description: 'এই আয়াত পড়লে সকাল পর্যন্ত আল্লাহর পক্ষ থেকে রক্ষা থাকবেন।',
        arabic: 'اللّهُ لا إِلٰهَ إِلّا هُوَ الْحَيُّ الْقَيُّومُ لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ لَهُ ما فِي السَّمَاوَاتِ وَما فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلّا بِإِذْنِهِ يَعْلَمُ ما بَيْنَ أَيْدِيهِمْ وَما خَلْفَهُمْ وَلا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلّا بِما شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        pronunciation: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হায়্যুল কাইয়্যুম লা তা’খুথুহু সিন্নাতুন ওয়ালা নাউম লাহু মা ফিস সামাওয়াতি ওয়া মা ফিল আর্দি মান যাল্লাযি ইয়াশফা’ু ইন্দাহু ইল্লা বিইযনিহি ইয়ালামু মা বাইনা আইদিহিম ওয়া মা খলফাহুম ওয়ালা ইউহীতূনা বিসাইয়িং মিন ইলমিহি ইল্লা বিমা শা’য়া ওয়া সি’আ কুরসিউহুস সামাওয়াতি ওয়াল আরদা ওয়ালা ইয়াউদুহু হিফযুহুমা ওয়া হুয়াল আলি্যুল আযীম',
        meaning: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি জীবিত ও সবকিছুর রক্ষক। তাঁকে না ঘুম ব্যাহত করে, না নিদ্রা। আকাশ ও ভূমিতে যা আছে সব তাঁর। কে এমন যে তাঁর অনুমতি ছাড়া তাঁর নিকটে শফাআত করতে পারে? তিনি যা দেখেন ও জানেন সবই। মানুষ তাঁর জ্ঞানের সীমা অতিক্রম করতে পারে না, তবে যা তিনি চান। তাঁর কুরসী আকাশ ও ভূমি বিস্তৃত। তাদের রক্ষা তাঁকে ক্লান্ত করে না। তিনি মহান ও সর্বোচ্চ।'
      }
    ]
  },
  {
    id: 'step4',
    title: 'ধাপ ৪: তাসবীহ পড়া',
    iconName: 'islam',
    data: [
      {
        id: 'step4-1',
        title: 'সুবহানাল্লাহ - ৩৩ বার',
        description: 'সুবহানাল্লাহ ৩৩ বার পড়ুন।',
        arabic: 'سُبْحَانَ اللهِ',
        pronunciation: 'সুবহানাল্লাহ',
        meaning: 'আল্লাহ পবিত্র'
      },
      {
        id: 'step4-2',
        title: 'আলহামদুলিল্লাহ - ৩৩ বার',
        description: 'আলহামদুলিল্লাহ ৩৩ বার পড়ুন।',
        arabic: 'الْحَمْدُ لِلّٰهِ',
        pronunciation: 'আলহামদুলিল্লাহ',
        meaning: 'সমস্ত প্রশংসা আল্লাহর'
      },
      {
        id: 'step4-3',
        title: 'আল্লাহু আকবার - ৩৪ বার',
        description: 'আল্লাহু আকবার ৩৪ বার পড়ুন।',
        arabic: 'اللهُ أَكْبَرُ',
        pronunciation: 'আল্লাহু আকবার',
        meaning: 'আল্লাহ সর্বশ্রেষ্ঠ'
      }
    ]
  },
  {
    id: 'step5',
    title: 'ধাপ ৫: শোয়ার আদব',
    iconName: 'bed',
    data: [
      {
        id: 'step5-1',
        title: 'ডান কাত হয়ে শুয়ে দোয়া',
        description: 'ডান কাত হয়ে ডান হাত গালের নিচে রেখে এই দোয়া পড়ুন।',
        arabic: 'اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ',
        pronunciation: 'আল্লাহুম্মা আসলামতু ওয়াজহিয়া ইলাইকা ওয়া ফাওওয়াদতু আমরি ইলাইক',
        meaning: 'হে আল্লাহ! আমি আমার মুখমণ্ডল তোমার কাছে সমর্পণ করলাম এবং আমার সকল বিষয় তোমার কাছে অর্পণ করলাম।'
      },
      {
        id: 'step5-2',
        title: 'ক্ষমা প্রার্থনা',
        description: 'ঘুমানোর আগে আল্লাহর কাছে ক্ষমা চান।',
        arabic: 'أَسْتَغْفِرُ اللهَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        pronunciation: 'আস্তাগফিরুল্লাহাল্লাযি লা ইলাহা ইল্লা হুয়াল হাইয়ুল কাইয়্যূমু ওয়া আতূবু ইলাইহি',
        meaning: 'আমি সেই আল্লাহর কাছে ক্ষমা চাই যিনি ছাড়া কোনো ইলাহ নেই, যিনি চিরঞ্জীব, চিরস্থায়ী এবং তাঁর কাছেই তওবা করি।'
      }
    ]
  }
];

// আইটেম রেন্ডার করার জন্য একটি কম্পোনেন্ট
const SleepPracticeItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.itemTitle}>{item.title}</Text>
    {item.description && <Text style={styles.description}>{item.description}</Text>}
    {item.arabic && <Text style={styles.arabicText}>{item.arabic}</Text>}
    {item.pronunciation && <Text style={styles.pronunciationText}>{item.pronunciation}</Text>}
    {item.meaning && <Text style={styles.meaningText}>**অর্থ:** {item.meaning}</Text>}
    {item.hadith && <Text style={styles.hadithText}>**হাদিস:** {item.hadith}</Text>}
  </View>
);

// সেকশন হেডার রেন্ডার করার জন্য একটি কম্পোনেন্ট
const SectionHeader = ({ section: { title, iconName } }) => (
  <View style={styles.header}>
    <Icon name={iconName} size={24} color="#5B83B2" style={styles.icon} />
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const SleepPracticesScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a6f9c" />
       <LinearGradient
         colors={["#667eea", "#764ba2"]}
         style={styles.headerGradient}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }}
       >
         <View style={styles.headerContent}>
           <Ionicons name="moon" size={32} color="#fff" style={styles.headerIcon} />
           <Text style={styles.headerTitle}>ঘুমানোর দোয়া ও আমল,</Text>
           <Text style={styles.headerSubtitle}>সূরা ও দোয়া সংগ্রহ</Text>
         </View>
         <View style={styles.decorativePattern}>
           {[...Array(3)].map((_, i) => (
             <View key={i} style={[styles.patternCircle, { opacity: 0.1 + i * 0.05 }]} />
           ))}
         </View>
       </LinearGradient>
      <SectionList
        sections={sleepPracticesData} // Directly use the data since it's correctly formatted
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <SleepPracticeItem item={item} />}
        renderSectionHeader={SectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ... (Rest of the styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF0F6',
  },
  appBar: {
    backgroundColor: '#5B83B2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
  },
  appBarTitle: {
   
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#EAF0F6',
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#5B83B2',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'right',
    fontFamily: 'ScheherazadeNew-Bold', // আরবি ফন্টের জন্য এই ফন্ট ব্যবহার করতে পারেন
    color: '#2c3e50',
    marginBottom: 5,
  },
  pronunciationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#466C99',
    marginBottom: 5,
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontWeight: 'bold',
  },
  hadithText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  headerGradient: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, position: "relative", overflow: "hidden" },
  headerContent: { alignItems: "center", zIndex: 2 },
  headerIcon: { marginBottom: 8 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center" },
  decorativePattern: { position: "absolute", right: -50, top: 20, zIndex: 1 },
});

export default SleepPracticesScreen; 