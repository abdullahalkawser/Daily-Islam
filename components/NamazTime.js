import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const PrayerPage = () => {
  const [loading, setLoading] = useState(true);
  const [prayerWindows, setPrayerWindows] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const date = new Date();
        const params = CalculationMethod.MuslimWorldLeague();
        params.madhab = Madhab.Hanafi;

        const prayerTimes = new PrayerTimes(coordinates, date, params);

        const windows = [
          { name: "ফজর", start: dayjs(prayerTimes.fajr), end: dayjs(prayerTimes.sunrise) },
          { name: "যোহর", start: dayjs(prayerTimes.dhuhr), end: dayjs(prayerTimes.asr) },
          { name: "আসর", start: dayjs(prayerTimes.asr), end: dayjs(prayerTimes.maghrib) },
          { name: "মাগরিব", start: dayjs(prayerTimes.maghrib), end: dayjs(prayerTimes.isha) },
          { name: "এশা", start: dayjs(prayerTimes.isha), end: dayjs(prayerTimes.fajr).add(1, "day") },
        ];

        setPrayerWindows(windows);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadPrayerTimes();
  }, []);

  // Timer update
  useEffect(() => {
    if (prayerWindows.length === 0) return;

    const timer = setInterval(() => {
      const now = dayjs();
      let active = null;
      let upcoming = null;

      for (let i = 0; i < prayerWindows.length; i++) {
        const p = prayerWindows[i];
        if (now.isAfter(p.start) && now.isBefore(p.end)) {
          active = p;
          upcoming = prayerWindows[(i + 1) % prayerWindows.length];
          break;
        }
      }

      setCurrentWaqt(active);
      setNextWaqt(upcoming);

      if (active) {
        const diff = dayjs.duration(active.end.diff(now));
        setCountdown(
          `${String(diff.hours()).padStart(2, "0")}:${String(diff.minutes()).padStart(2, "0")}:${String(
            diff.seconds()
          ).padStart(2, "0")}`
        );
      } else {
        setCountdown(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerWindows]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Current Waqt */}
      <Text style={styles.nextWaqtName}>
        {currentWaqt ? `${currentWaqt.name} (এখন)` : "এখন কোনো নামাজ নেই"}
      </Text>

      {/* ✅ Next Waqt */}
      <Text style={styles.nextWaqtName}>
        {nextWaqt ? `পরবর্তী: ${nextWaqt.name}` : "পরবর্তী নামাজ নেই"}
      </Text>

      {/* ✅ Countdown */}
      <Text style={styles.countdownText}>
        {countdown ? `শেষ হতে বাকি: ${countdown}` : "০০:০০:০০"}
      </Text>

      {/* ✅ Prayer List */}
      {prayerWindows.map((p, i) => (
        <View key={i} style={styles.prayerRow}>
          <Text style={styles.prayerName}>
            {p.name} {currentWaqt?.name === p.name ? "(এখন)" : ""}
          </Text>
          <Text style={styles.prayerTime}>
            {p.start && p.end
              ? `${p.start.format("hh:mm A")} - ${p.end.format("hh:mm A")}`
              : "লোড হচ্ছে..."}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  nextWaqtName: { fontSize: 18, fontWeight: "bold", marginVertical: 5, textAlign: "center" },
  countdownText: { fontSize: 20, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  prayerName: { fontSize: 16, fontWeight: "500" },
  prayerTime: { fontSize: 16 },
});

export default PrayerPage;
