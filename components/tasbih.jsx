import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import { StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const tasbihList = [
  { id: '1', text: 'সুবহানাল্লাহ', maxCount: 33, meaning: 'আল্লাহকে পরিপূর্ণভাবে পবিত্র ঘোষণা', time: 'নামাজের পরে' },
  { id: '2', text: 'আলহামদুলিল্লাহ', maxCount: 33, meaning: 'সকল প্রশংসা আল্লাহর জন্য', time: 'নামাজের পরে' },
  { id: '3', text: 'আল্লাহু আকবার', maxCount: 34, meaning: 'আল্লাহ সবচেয়ে মহান', time: 'নামাজের পরে' },
  { id: '4', text: 'লা ইলাহা ইল্লাল্লাহ', maxCount: 100, meaning: 'আল্লাহ ছাড়া কোনো উপাস্য নেই', time: 'যেকোনো সময়' },
  { id: '5', text: 'আস্তাগফিরুল্লাহ', maxCount: 100, meaning: 'আল্লাহর কাছে ক্ষমা প্রার্থনা', time: 'যেকোনো সময়' },
  { id: '6', text: 'লা হাওলা ও লা কুওয়াতা ইল্লা বিল্লাহ', maxCount: 33, meaning: 'আল্লাহর স্রষ্টা ছাড়া ক্ষমতা কিছু নেই', time: 'বিপদ বা চিন্তা হলে' },
  { id: '7', text: 'সুবহানাল্লাহি ওয়া বিহামদিহি', maxCount: 100, meaning: 'আল্লাহকে প্রশংসা ও পবিত্র ঘোষণা', time: 'যেকোনো সময়' },
  { id: '8', text: 'সুবহানাল্লাহি আল-আজিম', maxCount: 33, meaning: 'মহান আল্লাহকে পবিত্র ঘোষণা', time: 'নামাজের পরে' },
  { id: '9', text: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহ', maxCount: 33, meaning: 'আল্লাহ এক, কোনো সহকর্তা নেই', time: 'যেকোনো সময়' },
  { id: '10', text: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মদ', maxCount: 33, meaning: 'হযরত মুহাম্মদ (সা:) এর জন্য দরুদ পাঠ', time: 'যেকোনো সময়' },
  { id: '11', text: 'রাব্বি জিদনি ইলমা', maxCount: 50, meaning: 'আল্লাহ, আমার জ্ঞান বৃদ্ধি কর', time: 'পড়াশোনা বা শিক্ষা শুরুতে' },
  { id: '12', text: 'হাস্বিয়াল্লাহু লা ইলাহা ইল্লা হুয়া', maxCount: 50, meaning: 'আল্লাহ যথেষ্ট, অন্য কোনো উপাস্য নেই', time: 'বিপদ বা ভয় হলে' },
  { id: '13', text: 'বিসমিল্লাহির রহমানির রহিম', maxCount: 1, meaning: 'পরম দয়ালু, পরম করুণাময় আল্লাহর নামে শুরু করা', time: 'কাজ শুরুতে' },
  { id: '14', text: 'আস্তাগফিরুল্লাহা রাব্বি মিন কুল্লি ধামবিন ওয়া আতুবু ইলায়হ', maxCount: 100, meaning: 'সব পাপের জন্য ক্ষমা প্রার্থনা', time: 'যেকোনো সময়' },
  { id: '15', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-নার', maxCount: 33, meaning: 'আল্লাহ, আগুন থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '16', text: 'রাব্বি ইয়াসির ও লা তু’আসির', maxCount: 33, meaning: 'আল্লাহ, সহজ কর, কঠিন করো না', time: 'কাজ শুরুতে' },
  { id: '17', text: 'আল্লাহুম্মা ইন্নি আস’alুকা আল-জান্নাহ', maxCount: 33, meaning: 'আল্লাহ, জান্নাত দান কর', time: 'যেকোনো সময়' },
  { id: '18', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন ফিতনাতিল মাহ্য্যা ওয়াল মমাত', maxCount: 33, meaning: 'আল্লাহ, জীবনের ও মৃত্যুর ফিতনা থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '19', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-হাম্মি ওয়াল-হুজনি', maxCount: 33, meaning: 'আল্লাহ, দুঃখ ও চিন্তা থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '20', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-জুবনি ওয়াল-বুখল', maxCount: 33, meaning: 'আল্লাহ, ভয় ও কৃপণতা থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '21', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন ঘালাবাতিদ-দাইন ও কাহরির-রিজাল', maxCount: 33, meaning: 'আল্লাহ, দেনা ও মানুষের অত্যাচার থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '22', text: 'সুবহানাল্লাহ ওয়ালহামদুলিল্লাহ লা ইলাহা ইল্লাল্লাহু ও আল্লাহু আকবার', maxCount: 33, meaning: 'সংক্ষিপ্ত চারটি তাসবিহ একসাথে', time: 'যেকোনো সময়' },
  { id: '23', text: 'আল্লাহুম্মা ইন্নি আস’alুকা হুসনাল খাতিমাহ', maxCount: 33, meaning: 'আল্লাহ, সুন্দর মৃত্যু দাও', time: 'যেকোনো সময়' },
  { id: '24', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-কুফরি ওয়াল-ফাকর', maxCount: 33, meaning: 'আল্লাহ, অবিশ্বাস ও দারিদ্র্য থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '25', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-শাররি', maxCount: 33, meaning: 'আল্লাহ, সব ধরনের ক্ষতি থেকে রক্ষা কর', time: 'যেকোনো সময়' },
  { id: '26', text: 'আল্লাহুম্মা আজিরনি মিন আল-নার', maxCount: 33, meaning: 'আল্লাহ, আগুন থেকে আমাকে মুক্ত কর', time: 'যেকোনো সময়' },
  { id: '27', text: 'রাব্বি আউজু বিকা মিন কুল্লি পাপিন ওয় আতুবু ইলায়হ', maxCount: 33, meaning: 'সব পাপ থেকে আল্লাহর কাছে ফিরে যাওয়া', time: 'যেকোনো সময়' },
  { id: '28', text: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মদ ওয়া আলা আলী মুহাম্মদ', maxCount: 33, meaning: 'হযরত মুহাম্মদ (সা:) এবং তাঁর পরিবারের জন্য দরুদ', time: 'যেকোনো সময়' },
  { id: '29', text: 'লা ইলাহা ইল্লাল্লাহুল মলিকুল হক', maxCount: 33, meaning: 'আল্লাহ এক এবং সবকিছু তাঁর অধীনে', time: 'যেকোনো সময়' },
  { id: '30', text: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিন আল-হজ্জ ওয়াল-দুনিয়া', maxCount: 33, meaning: 'আল্লাহ, দুনিয়ার ফিতনা থেকে রক্ষা কর', time: 'যেকোনো সময়' },
];

export default function TasbihPage() {
  const [counts, setCounts] = useState(Array(tasbihList.length).fill(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTasbih, setCompletedTasbih] = useState('');

  const incrementCount = (index) => {
    const newCounts = [...counts];
    if (newCounts[index] < tasbihList[index].maxCount) {
      newCounts[index] += 1;
      setCounts(newCounts);
      if (newCounts[index] === tasbihList[index].maxCount) {
        setCompletedTasbih(tasbihList[index].text);
        setModalVisible(true);
      }
    }
  };

  const resetCount = (index) => {
    const newCounts = [...counts];
    newCounts[index] = 0;
    setCounts(newCounts);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30d83eff" />
      <Text style={styles.title}>দৈনিক তাসবিহ</Text>
      <FlatList
        data={tasbihList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const progress = counts[index] / item.maxCount;
          return (
            <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.card}>
              <Text style={styles.tasbihText}>{item.text}</Text>
              <Text style={styles.meaningText}>{item.meaning}</Text>
              <Text style={styles.timeText}>পড়ার সময়: {item.time}</Text>

              <View style={styles.progressContainer}>
                <Progress.Bar
                  progress={progress}
                  width={width - 60}
                  color="#2575fc"
                  height={8}
                  borderRadius={5}
                  unfilledColor="#d3d3d3"
                  borderWidth={0}
                />
                <Text style={styles.progressText}>{counts[index]} / {item.maxCount}</Text>
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={() => incrementCount(index)}>
                  <Text style={styles.buttonText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={() => resetCount(index)}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          );
        }}
      />

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.modalContent}>
            <Text style={styles.modalText}>মাশাল্লাহ! আপনি সম্পূর্ণ করেছেন।</Text>
            <Text style={styles.modalTasbih}>{completedTasbih}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5fa', paddingTop: 50, paddingHorizontal: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  card: { borderRadius: 15, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  tasbihText: { fontSize: 20, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  meaningText: { fontSize: 16, color: '#555', marginBottom: 3 },
  timeText: { fontSize: 14, color: '#777', marginBottom: 10 },
  progressContainer: { marginBottom: 10 },
  progressText: { fontSize: 14, color: '#555', textAlign: 'right', marginTop: 2 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: '#2575fc', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resetButton: { backgroundColor: '#f54e42', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  resetText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.8, padding: 25, borderRadius: 20, alignItems: 'center' },
  modalText: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalTasbih: { fontSize: 20, color: '#fff', marginBottom: 20, textAlign: 'center' },
  closeButton: { backgroundColor: '#fff', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 15 },
  closeText: { color: '#2575fc', fontWeight: 'bold', fontSize: 16 },
});
