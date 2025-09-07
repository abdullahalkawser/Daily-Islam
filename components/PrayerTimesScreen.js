import { CalculationMethod, Madhab, PrayerTimes } from "adhan";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import durationPlugin from "dayjs/plugin/duration";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

dayjs.extend(durationPlugin);
dayjs.locale("bn");

const screenWidth = Dimensions.get("window").width;

// ✅ Helper: English to Bangla numbers
const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

export default function PrayerTimesComponent() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState([]);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [coords, setCoords] = useState(null);
  const [forbiddenTimes, setForbiddenTimes] = useState([]);
  const [donePrayers, setDonePrayers] = useState({ ফজর: false, যোহর: false, আসর: false, মাগরিব: false, এশা: false, তাহাজ্জুদ: false });

  const animatedColor = useSharedValue(["#10B981", "#059669"]);
  const dynamicColors = [
    ["#10B981", "#059669"], ["#3B82F6", "#2563EB"], ["#F59E0B", "#D97706"], ["#E11D48", "#BE123C"], ["#9333EA", "#7C3AED"]
  ];

  // ✅ Animated gradient effect
  useEffect(() => {
    let index = 0;
    const colorTimer = setInterval(() => {
      index = (index + 1) % dynamicColors.length;
      animatedColor.value = withTiming(dynamicColors[index], { duration: 2000 });
    }, 5000);
    return () => clearInterval(colorTimer);
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => ({ backgroundColor: animatedColor.value[0] }));

  // ✅ Fetch location & calculate prayer times
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
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPrayerTimes = new PrayerTimes({ latitude, longitude }, tomorrow, params);

        const formattedTimes = [
          { name: "ফজর", startTime: dayjs(prayerTimes.fajr), endTime: dayjs(prayerTimes.sunrise) },
          { name: "সূর্যোদয়", startTime: dayjs(prayerTimes.sunrise), endTime: dayjs(prayerTimes.sunrise).add(20, "minutes") },
          { name: "যোহর", startTime: dayjs(prayerTimes.dhuhr), endTime: dayjs(prayerTimes.asr) },
          { name: "আসর", startTime: dayjs(prayerTimes.asr), endTime: dayjs(prayerTimes.maghrib) },
          { name: "সূর্যাস্ত", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.maghrib).add(15, "minutes") },
          { name: "মাগরিব", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.isha) },
          { name: "এশা", startTime: dayjs(prayerTimes.isha), endTime: dayjs(tomorrowPrayerTimes.fajr) },
          { name: "তাহাজ্জুদ", startTime: dayjs(prayerTimes.isha).add(1, "hour"), endTime: dayjs(tomorrowPrayerTimes.fajr).subtract(2, "minutes") },
        ];
        setTimes(formattedTimes);

        setForbiddenTimes([
          { name: "সূর্যোদয়", start: dayjs(prayerTimes.sunrise).subtract(5, "minutes"), end: dayjs(prayerTimes.sunrise).add(20, "minutes") },
          { name: "মধ্যাহ্ন", start: dayjs(prayerTimes.dhuhr).subtract(10, "minutes"), end: dayjs(prayerTimes.dhuhr) },
          { name: "সূর্যাস্ত", start: dayjs(prayerTimes.maghrib).subtract(15, "minutes"), end: dayjs(prayerTimes.maghrib) },
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setCity("তথ্য পাওয়া যায়নি");
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Countdown & current/next prayer
  useEffect(() => {
    if (times.length === 0 || !coords) return;
    const timer = setInterval(() => {
      const now = dayjs();

      const todayFajr = times.find(t => t.name === "ফজর")?.startTime;
      const yesterdayIsha = times.find(t => t.name === "এশা")?.startTime.subtract(1, "day");

      let current = null;
      let next = null;

      // Midnight-crossing logic
      if (now.isAfter(yesterdayIsha) && now.isBefore(todayFajr.subtract(2, "minute"))) {
        current = { name: "এশা / তাহাজ্জুদ" };
        next = { name: "ফজর", startTime: todayFajr.subtract(2, "minute") };
      } else {
        current = times.find(item => now.isAfter(item.startTime) && now.isBefore(item.endTime));
        next = times.find(item => now.isBefore(item.startTime));
        if (!next) next = times[0];
      }

      setCurrentWaqt(current);
      setNextWaqt(next);

      const diff = next?.startTime?.diff(now) ?? current?.endTime?.diff(now) ?? 0;
      const duration = dayjs.duration(diff);
      setCountdown(
        `${toBanglaNumber(String(Math.floor(duration.asHours())).padStart(2,"০"))}:${toBanglaNumber(String(duration.minutes()).padStart(2,"০"))}:${toBanglaNumber(String(duration.seconds()).padStart(2,"০"))}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [times, coords]);

  const handlePrayerDone = (name) => setDonePrayers(prev => ({ ...prev, [name]: !prev[name] }));

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={{ marginTop: 10, color: '#333' }}>তথ্য লোড হচ্ছে...</Text>
    </View>
  );

  const sunriseTime = times.find(t => t.name === 'ফজর')?.endTime;
  const sunsetTime = times.find(t => t.name === 'আসর')?.endTime;

  // ✅ Reusable Prayer Item with Current Waqt red highlight
  const PrayerTimeItem = ({ item, isCurrent, isDone }) => {
    const bgColor = isCurrent ? '#DC2626' : isDone ? '#d4edda' : '#E9F5FF';
    const borderColor = isCurrent ? '#DC2626' : isDone ? '#c3e6cb' : '#A4D9E2';
    const textColor = isCurrent || isDone ? '#fff' : '#333';
    const timeColor = isCurrent || isDone ? '#fff' : '#1A6E60';

    return (
      <TouchableOpacity
        style={[styles.prayerItem, { backgroundColor: bgColor, borderColor: borderColor }]}
        onPress={() => handlePrayerDone(item.name)}
      >
        <Text style={[styles.prayerItemName, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.prayerItemTime, { color: timeColor }]}>
          {toBanglaNumber(item.startTime.format("h:mm A"))} - {toBanglaNumber(item.endTime.format("h:mm A"))}
        </Text>
      </TouchableOpacity>
    );
  };

  const ForbiddenTimeItem = ({ item }) => (
    <View style={styles.forbiddenCard}>
      <Text style={styles.forbiddenCardName}>{item.name}</Text>
      <Text style={styles.forbiddenCardTime}>{toBanglaNumber(item.start.format("h:mm A"))} - {toBanglaNumber(item.end.format("h:mm A"))}</Text>
    </View>
  );

  const PrayerStepper = () => {
    const steps = ["ফজর", "যোহর", "আসর", "মাগরিব", "এশা","তাহাজ্জুদ"];
    return (
      <View style={styles.stepperContainer}>
        {steps.map((name, i) => {
          const done = donePrayers[name];
          const prevDone = i === 0 ? true : donePrayers[steps[i-1]];
          return (
            <View key={i} style={styles.stepItem}>
              <TouchableOpacity style={[styles.stepCircle, done && styles.stepCircleDone]} onPress={() => handlePrayerDone(name)}>
                {done ? <Icon name="check" size={18} color="#fff"/> : <Text style={styles.stepLabel}>{i+1}</Text>}
              </TouchableOpacity>
              <Text style={styles.stepText}>{name}</Text>
              {i < steps.length-1 && <View style={[styles.stepLine, done && prevDone && styles.stepLineDone]} />}
            </View>
          )
        })}
      </View>
    )
  };

  const PrayerProgress = () => {
    const total = 6;
    const completed = Object.values(donePrayers).filter(Boolean).length;
    const percentage = (completed / total) * 100;
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>আজ তুমি {completed}/{total} নামাজ পড়েছো</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </View>
    )
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)}>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Icon name="map-marker-outline" size={16} color="#555" />
            <Text style={styles.headerText}>{city}</Text>
          </View>
        </View>

        <PrayerStepper />
        <PrayerProgress />

        <Animated.View style={[styles.gradientCard, animatedGradientStyle]}>
          <LinearGradient colors={animatedColor.value} style={styles.gradientCardContent}>
            <Text style={styles.remainingText}>
              {currentWaqt ? ` (${currentWaqt.name}) শেষ হতে ` : nextWaqt ? ` (${nextWaqt.name}) ওয়াক্ত শুরু হতে ` : 'সময় পাওয়া যায়নি'}
            </Text>
            <Text style={styles.countdownText}>{countdown}  </Text>
            <Text style={styles.remainingText}> সেকেন্ড বাকি </Text>
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

        <View style={styles.contentRow}>
          <View style={styles.prayerTimesSection}>
            <Text style={styles.cardTitle}>আজকের নামাজের সময়সূচী</Text>
            <View style={styles.prayerItemsContainer}>
              {times.filter(t => !["সূর্যোদয়","সূর্যাস্ত"].includes(t.name)).map((item, idx) => (
                <PrayerTimeItem key={idx} item={item} isCurrent={currentWaqt?.name === item.name} isDone={donePrayers[item.name]} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>নামাজের নিষিদ্ধ সময়</Text>
          <View style={styles.forbiddenItemsContainer}>
            {forbiddenTimes.map((item, idx) => <ForbiddenTimeItem key={idx} item={item} />)}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F8FA" },
  header: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerItem: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginLeft: 8, fontSize: 14, color: '#333', fontWeight: '500' },
  gradientCard: { borderRadius: 20, margin: 15, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  gradientCardContent: { padding: 10, alignItems: "center", borderRadius: 20 },
  countdownText: { fontSize: 40, fontWeight: "700", color: "#fff", letterSpacing: 2, textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  remainingText: { fontSize:25, color: "#fff", marginBottom: 8,},
  sunInfoContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  sunInfoItem: { flexDirection: 'row', alignItems: 'center' },
  sunInfoText: { fontSize: 14, color: '#fff', marginLeft: 8, fontWeight: '500' },
  stepperContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 5, marginHorizontal: 10, marginBottom: 8 },
  stepItem: { alignItems: "center", position: "relative" },
  stepCircle: { width: 35, height: 35, borderRadius: 18, borderWidth: 2, borderColor: "#10B981", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", zIndex: 1 },
  stepCircleDone: { backgroundColor: "#10B981", borderColor: "#059669" },
  stepLabel: { fontSize: 14, fontWeight: "600", color: "#10B981" },
  stepText: { marginTop: 5, fontSize: 12, fontWeight: "500", color: "#333" },
  stepLine: { position: "absolute", top: 17, left: "50%", width: 40, height: 2, backgroundColor: "#D1D5DB", zIndex: 0 },
  stepLineDone: { backgroundColor: "#10B981" },
  progressContainer: { marginHorizontal: 20, marginBottom: 12, marginTop: 2 },
  progressText: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8, textAlign: "center" },
  progressBar: { height: 10, borderRadius: 5, backgroundColor: "#E5E7EB", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: "#10B981" },
  contentRow: { flexDirection: screenWidth > 600 ? 'row' : 'column', marginHorizontal: 15, marginTop: 10, gap: 15 },
  contentCard: { flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 15 },
  prayerTimesSection: { flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 7, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
  prayerItemsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  prayerItem: { width: '30%', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 10 },
  forbiddenItemsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forbiddenCard: { width: '30%', backgroundColor: '#FFE5E5', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FCA5A5' },
  forbiddenCardName: { fontSize: 12, fontWeight: '500', color: '#DC2626' },
  forbiddenCardTime: { fontSize: 10, fontWeight: '600', color: '#DC2626', marginTop: 5, textAlign: 'center' },
});
