import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import isBetween from 'dayjs/plugin/isBetween';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from "react-native-reanimated";
import "dayjs/locale/bn";

dayjs.extend(durationPlugin);
dayjs.extend(isBetween);
dayjs.locale("bn");

const screenWidth = Dimensions.get("window").width;

const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

// একটি Row কম্পোনেন্ট যা ওয়াক্ত এবং নিষিদ্ধ সময় উভয়ই রেন্ডার করবে
const ScheduleRow = ({ item, isCurrent }) => {
    const isForbidden = item.type === 'forbidden';

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = isCurrent ? (isForbidden ? 'rgba(211, 47, 47, 0.1)' : 'rgba(26, 179, 148, 0.1)') : '#fff';
        const borderColor = isCurrent ? (isForbidden ? '#D32F2F' : '#10B981') : '#eee';
        return {
            backgroundColor: withTiming(backgroundColor),
            borderColor: withTiming(borderColor),
        };
    });

    const itemColor = isForbidden ? '#D32F2F' : (isCurrent ? item.color : '#4A4A4A');

    return (
        <Animated.View style={[styles.prayerItem, animatedStyle, { borderLeftWidth: isForbidden ? 5 : 1, borderWidth: isCurrent ? 1.5 : 1 }]}>
            <Icon name={item.icon} size={28} color={itemColor} />
            <View style={styles.prayerInfo}>
                <Text style={[styles.prayerName, { color: itemColor }]}>
                    {item.name} {isCurrent && "(চলমান)"}
                </Text>
            </View>
            <View style={styles.timeDetails}>
                <Text style={[styles.prayerTime, { color: itemColor }]}>
                    শুরু: {toBanglaNumber(item.startTime.format("h:mm A"))}
                </Text>
                <Text style={[styles.prayerTime, {fontSize: 12, color: '#777'}, isCurrent && { color: itemColor }]}>
                    শেষ: {toBanglaNumber(item.endTime.format("h:mm A"))}
                </Text>
            </View>
        </Animated.View>
    );
};


export default function PrayerTimesComponent() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [schedule, setSchedule] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [countdownText, setCountdownText] = useState("লোড হচ্ছে...");
  const [coords, setCoords] = useState(null);

  const animatedColor = useSharedValue(["#10B981", "#059669"]);
  const dynamicColors = [
    ["#10B981", "#059669"], ["#3B82F6", "#2563EB"], ["#F59E0B", "#D97706"],
    ["#E11D48", "#BE123C"], ["#9333EA", "#7C3AED"],
  ];

  useEffect(() => {
    let index = 0;
    const colorTimer = setInterval(() => {
      index = (index + 1) % dynamicColors.length;
      animatedColor.value = withTiming(dynamicColors[index], { duration: 2000 });
    }, 5000);
    return () => clearInterval(colorTimer);
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value[0],
  }));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCity("লোকেশন পাওয়া যায়নি");
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

        const formattedTimes = [
            { name: "ফজর", type: "prayer", startTime: dayjs(prayerTimes.fajr), endTime: dayjs(prayerTimes.sunrise), icon: "weather-sunset-up", color: "#0EA5E9" },
            { name: "যোহর", type: "prayer", startTime: dayjs(prayerTimes.dhuhr), endTime: dayjs(prayerTimes.asr), icon: "weather-sunny", color: "#F59E0B" },
            { name: "আসর", type: "prayer", startTime: dayjs(prayerTimes.asr), endTime: dayjs(prayerTimes.maghrib), icon: "weather-sunset-down", color: "#E11D48" },
            { name: "মাগরিব", type: "prayer", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.isha), icon: "weather-night", color: "#FF4500" },
            { name: "এশা", type: "prayer", startTime: dayjs(prayerTimes.isha), endTime: dayjs(tomorrowPrayerTimes.fajr).subtract(10, "minutes"), icon: "moon-waxing-crescent", color: "#9333EA" },
        ];

        // ### নিষিদ্ধ সময় যোগ করার নতুন লজিক ###
        const combinedSchedule = [];
        formattedTimes.forEach((waqt, index) => {
            combinedSchedule.push(waqt);
            const nextWaqt = formattedTimes[index + 1];
            if (nextWaqt) {
                const forbiddenStartTime = waqt.endTime.add(2, 'minutes');
                const forbiddenEndTime = nextWaqt.startTime.subtract(2, 'minutes');
                // নিশ্চিত করুন যে নিষিদ্ধ সময়টি বৈধ
                if (forbiddenEndTime.isAfter(forbiddenStartTime)) {
                    combinedSchedule.push({
                        name: "নিষিদ্ধ সময়",
                        type: "forbidden",
                        startTime: forbiddenStartTime,
                        endTime: forbiddenEndTime,
                        icon: 'timer-off-outline',
                        color: '#D32F2F'
                    });
                }
            }
        });
        
        setSchedule(combinedSchedule);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setCity("তথ্য পাওয়া যায়নি");
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (schedule.length === 0 || !coords) return;

    const timer = setInterval(() => {
      const now = dayjs();
      const currentSlot = schedule.find(slot => now.isBetween(slot.startTime, slot.endTime, null, '[]'));
      
      setCurrentWaqt(currentSlot);

      if (currentSlot) {
        const diff = currentSlot.endTime.diff(now);
        const duration = dayjs.duration(diff);
        setCountdown(
            `${toBanglaNumber(String(Math.floor(duration.asHours())).padStart(2, "০"))}:${toBanglaNumber(String(duration.minutes()).padStart(2, "০"))}:${toBanglaNumber(String(duration.seconds()).padStart(2, "০"))}`
        );
        const text = currentSlot.type === 'prayer' ? `${currentSlot.name} শেষ হতে বাকি` : "নিষিদ্ধ সময় শেষ হতে বাকি";
        setCountdownText(text);
      } else {
        // যদি কোনো ওয়াক্ত বা নিষিদ্ধ সময় না চলে
        const nextSlot = schedule.find(slot => now.isBefore(slot.startTime));
        if (nextSlot) {
            const diff = nextSlot.startTime.diff(now);
            const duration = dayjs.duration(diff);
            setCountdown(
                 `${toBanglaNumber(String(Math.floor(duration.asHours())).padStart(2, "০"))}:${toBanglaNumber(String(duration.minutes()).padStart(2, "০"))}:${toBanglaNumber(String(duration.seconds()).padStart(2, "০"))}`
            );
            setCountdownText(`${nextSlot.name} শুরু হতে বাকি`);
        } else {
            setCountdown("০০:০০:০০");
            setCountdownText("আজকের সময়সূচী শেষ");
        }
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [schedule, coords]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{marginTop: 10, color: '#333'}}>তথ্য লোড হচ্ছে...</Text>
      </View>
    );
  }
  
  const prayerTimes = schedule.filter(s => s.type === 'prayer');
  const sunriseTime = prayerTimes.find(t => t.name === 'ফজর')?.endTime;
  const sunsetTime = prayerTimes.find(t => t.name === 'আসর')?.endTime;

  return (
    <ScrollView style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)}>
            <View style={styles.header}>
                <View style={styles.headerItem}>
                    <Icon name="map-marker-outline" size={16} color="#555" />
                    <Text style={styles.headerText}>{city}</Text>
                </View>
            </View>

            <Animated.View style={[styles.gradientCard, animatedGradientStyle]}>
                <LinearGradient colors={animatedColor.value} style={styles.gradientCardContent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.remainingText}>{countdownText}</Text>
                    <Text style={styles.countdownText}>{countdown}</Text>
                    <View style={styles.sunInfoContainer}>
                        <View style={styles.sunInfoItem}>
                            <Icon name="weather-sunset-up" size={20} color="#fff" />
                            <Text style={styles.sunInfoText}>সূর্যোদয়: {sunriseTime ? toBanglaNumber(sunriseTime.format("h:mm A")) : '...'}</Text>
                        </View>
                        <View style={styles.sunInfoItem}>
                            <Icon name="weather-sunset-down" size={20} color="#fff" />
                            <Text style={styles.sunInfoText}>সূর্যাস্ত: {sunsetTime ? toBanglaNumber(sunsetTime.format("h:mm A")) : '...'}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
            
            <View style={styles.listContainer}>
                <Text style={styles.cardTitle}>আজকের পূর্ণাঙ্গ সময়সূচী</Text>
                {schedule.map((item, index) => (
                    <ScheduleRow 
                        key={index} 
                        item={item} 
                        isCurrent={item.startTime.isSame(currentWaqt?.startTime)} 
                    />
                ))}
            </View>

        </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F8FA" },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerItem: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginLeft: 8, fontSize: 14, color: '#333', fontWeight: '500' },
  gradientCard: { 
    borderRadius: 20, margin: 15, elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  gradientCardContent: { padding: 25, alignItems: "center", borderRadius: 20 },
  countdownText: { 
    fontSize: 48, fontWeight: "700", color: "#fff", letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10
  },
  remainingText: { 
    fontSize: 18, fontWeight: "500", color: "#fff", marginBottom: 8, height: 24,
  },
  sunInfoContainer: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
    marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  sunInfoItem: { flexDirection: 'row', alignItems: 'center' },
  sunInfoText: { fontSize: 14, color: '#fff', marginLeft: 8, fontWeight: '500' },
  listContainer: {
    backgroundColor: '#fff', borderRadius: 15, padding: 15, margin: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 10, borderWidth: 1, borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 15,
  },
  prayerItem: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 12, padding: 15, marginBottom: 10,
  },
  prayerInfo: { flex: 1, marginLeft: 15 },
  prayerName: { fontSize: 17, fontWeight: "600" },
  timeDetails: { alignItems: "flex-end" },
  prayerTime: { fontSize: 14, fontWeight: "500" },
});