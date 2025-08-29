import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab, HijriDate } from "adhan";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';

dayjs.extend(durationPlugin);

// বাংলা সংখ্যায় রূপান্তর করার ফাংশন
const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

// বাংলা খ্রিস্টাব্দ মাস ও দিন
const christianMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const christianDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const hijriMonths = ['মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'];

const prayerInfo = {
  ফজর: { name: "ফজর", color: "#10B981", icon: "weather-night" },
  যোহর: { name: "যোহর", color: "#3B82F6", icon: "weather-sunny" },
  আসর: { name: "আসর", color: "#F59E0B", icon: "weather-partly-cloudy" },
  মাগরিব: { name: "মাগরিব", color: "#EF4444", icon: "weather-sunset" },
  এশা: { name: "এশা", color: "#8B5CF6", icon: "moon-waning-crescent" },
};

const sunInfo = {
  sunrise: { name: "সূর্যোদয়", color: "#FDE047", icon: "white-balance-sunny" },
  sunset: { name: "সূর্যাস্ত", color: "#9CA3AF", icon: "weather-sunset" },
};

export default function PrayerPage() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [christianDate, setChristianDate] = useState("");
  const [hijri, setHijri] = useState("");

  const [coords, setCoords] = useState(null);

  // Load Location & Prayer Times
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCity("লোকেশন পাওয়া যায়নি");
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        setCoords({ latitude, longitude });

        const place = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place.length > 0) setCity(`${place[0].city}, ${place[0].country}`);

        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;

        const today = new Date();
        const prayerTimes = new PrayerTimes({ latitude, longitude }, today, params);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPrayerTimes = new PrayerTimes({ latitude, longitude }, tomorrow, params);

        // Set Christian date
        const dayName = christianDays[today.getDay()];
        const monthName = christianMonths[today.getMonth()];
        const date = toBanglaNumber(today.getDate());
        const year = toBanglaNumber(today.getFullYear());
        setChristianDate(`${dayName}, ${date} ${monthName}, ${year}`);

        // Set Hijri date
        const hijri = new HijriDate(today);
        const hijriMonthName = hijriMonths[hijri.month - 1];
        const hijriDay = toBanglaNumber(hijri.day);
        const hijriYear = toBanglaNumber(hijri.year);
        setHijri(`${hijriDay} ${hijriMonthName}, ${hijriYear} হিজরি`);

        const formattedTimes = [
          { ...prayerInfo.ফজর, startTime: dayjs(prayerTimes.fajr), endTime: dayjs(prayerTimes.sunrise) },
          { ...prayerInfo.যোহর, startTime: dayjs(prayerTimes.dhuhr), endTime: dayjs(prayerTimes.asr) },
          { ...prayerInfo.আসর, startTime: dayjs(prayerTimes.asr), endTime: dayjs(prayerTimes.maghrib) },
          { ...prayerInfo.মাগরিব, startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.isha) },
          { ...prayerInfo.এশা, startTime: dayjs(prayerTimes.isha), endTime: dayjs(tomorrowPrayerTimes.fajr) },
        ];
        setTimes(formattedTimes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setCity("তথ্য পাওয়া যায়নি");
        setLoading(false);
      }
    })();
  }, []);

  // Timer for countdown and active waqt
  useEffect(() => {
    if (times.length === 0) return;

    const timer = setInterval(() => {
      const now = dayjs();
      let activeWaqt = null;
      let nextWaqt = null;

      // Find current and next waqt
      for (let i = 0; i < times.length; i++) {
        const p = times[i];
        const nextP = times[(i + 1) % times.length];
        
        let start = p.startTime;
        let end = nextP.startTime;
        
        // Handle next day prayer for Isha
        if (nextP.startTime.isBefore(p.startTime)) {
          end = end.add(1, 'day');
        }

        if (now.isAfter(start) && now.isBefore(end)) {
          activeWaqt = p;
          nextWaqt = nextP;
          
          const diff = end.diff(now);
          const dur = dayjs.duration(diff);
          const hours = String(dur.hours()).padStart(2, '0');
          const minutes = String(dur.minutes()).padStart(2, '0');
          const seconds = String(dur.seconds()).padStart(2, '0');
          setCountdown(`${toBanglaNumber(hours)}:${toBanglaNumber(minutes)}:${toBanglaNumber(seconds)}`);
          break;
        }
      }

      if (!activeWaqt) {
        // If no active waqt found (e.g., between Isha and Fajr), the next is Fajr
        nextWaqt = times[0];
        const fajrTime = times[0].startTime.add(times[0].startTime.isBefore(now) ? 1 : 0, 'day');
        const diff = fajrTime.diff(now);
        const dur = dayjs.duration(diff);
        const hours = String(dur.hours()).padStart(2, '0');
        const minutes = String(dur.minutes()).padStart(2, '0');
        const seconds = String(dur.seconds()).padStart(2, '0');
        setCountdown(`${toBanglaNumber(hours)}:${toBanglaNumber(minutes)}:${toBanglaNumber(seconds)}`);
        activeWaqt = times[times.length - 1]; // Set current waqt to Isha
      }
      
      setCurrentWaqt(activeWaqt);
      setNextWaqt(nextWaqt);

    }, 1000);
    return () => clearInterval(timer);
  }, [times, coords]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.loadingText}>{city}</Text>
    </View>
  );
  
  const nextWaqtColor = nextWaqt?.color || "#ffffff";
  const rowGradients = [
    ['#DCFCE7', '#BBF7D0'],
    ['#DBEAFE', '#BFDBFE'],
    ['#FEF3C7', '#FDE68A'],
    ['#FEE2E2', '#FECACA'],
    ['#EDE9FE', '#DDD6FE'],
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>{christianDate}</Text>
        <Text style={styles.hijriText}>{hijri}</Text>
      </View>

      <View style={[styles.mainCard, { backgroundColor: nextWaqtColor }]}>
        <View style={styles.sunInfo}>
          <Icon name="map-marker" size={20} color="#ffffff" />
          <Text style={styles.locationName}>{city}</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.nextWaqtText}>পরবর্তী ওয়াক্ত বাকি আছে</Text>
          <Text style={styles.nextWaqtName}>{nextWaqt?.name}</Text>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      </View>

      <View style={styles.prayerTable}>
        <View style={styles.prayerHeader}>
          <Text style={styles.prayerHeaderText}>নামাজ</Text>
          <Text style={styles.prayerHeaderText}>ওয়াক্ত</Text>
        </View>

        {times.map((p, i) => {
          const isActive = currentWaqt?.name === p.name;
          return (
            <LinearGradient
              key={i}
              colors={isActive ? [p.color, p.color] : rowGradients[i]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.prayerRow,
                { borderRadius: 12, marginVertical: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
              ]}
            >
              <View style={styles.prayerNameContainer}>
                <Text style={[styles.prayerName, isActive && { color: '#ffffff', fontWeight: '700' }]}>
                  {p.name}
                </Text>
                {isActive && <Text style={styles.nowText}>এখন</Text>}
              </View>
              <View>
                <Text style={[styles.prayerTime, isActive && { color: '#ffffff', fontWeight: '700' }]}>
                  {toBanglaNumber(p.startTime.format("hh:mm A"))}
                </Text>
              </View>
            </LinearGradient>
          );
        })}
      </View>
      
      {/* নতুন সেকশন: সূর্যোদয় ও সূর্যাস্ত */}
      <View style={styles.sunTable}>
        <View style={styles.sunHeader}>
          <Text style={styles.prayerHeaderText}>সময়</Text>
          <Text style={styles.prayerHeaderText}>সূর্য</Text>
        </View>
        
        <LinearGradient
          colors={['#FEF3C7', '#FDE68A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.prayerRow, { borderRadius: 12, marginVertical: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }]}
        >
          <View style={styles.prayerNameContainer}>
            <Text style={styles.prayerName}>{sunInfo.sunrise.name}</Text>
          </View>
          <View>
            <Text style={styles.prayerTime}>{toBanglaNumber(times[0]?.endTime?.format("hh:mm A"))}</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#FEE2E2', '#FECACA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.prayerRow, { borderRadius: 12, marginVertical: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }]}
        >
          <View style={styles.prayerNameContainer}>
            <Text style={styles.prayerName}>{sunInfo.sunset.name}</Text>
          </View>
          <View>
            <Text style={styles.prayerTime}>{toBanglaNumber(times[3]?.startTime?.format("hh:mm A"))}</Text>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#23ca69ff', paddingTop: 20, borderRadius: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#ffffff' },
  dateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hijriText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mainCard: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  sunInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#ffffff',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  nextWaqtText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  nextWaqtName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  countdownText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    letterSpacing: 2,
  },
  prayerTable: { marginHorizontal: 20, marginBottom: 30, },
  prayerHeader: { flexDirection: 'row', backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, borderTopRightRadius: 12 },
  prayerHeaderText: { flex: 1, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#111' },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center' },
  prayerNameContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  prayerName: { fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#333' },
  nowText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 5, padding: 3, paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.3)' },
  prayerTime: { flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#555' },
  sunTable: { marginHorizontal: 20, marginBottom: 30 },
  sunHeader: { flexDirection: 'row', backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, borderTopRightRadius: 12 },
});
