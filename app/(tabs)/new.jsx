import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import { LinearGradient } from "expo-linear-gradient";

dayjs.extend(durationPlugin);

const PrayerTimePage = () => {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (!location) return;

    const now = new Date();
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi;

    const dateForPrayer = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const times = new PrayerTimes(
      { latitude: location.latitude, longitude: location.longitude },
      dateForPrayer,
      params
    );
    setPrayerTimes(times);
  }, [location]);

  useEffect(() => {
    if (!prayerTimes || !location) return;

    const interval = setInterval(() => {
      const now = dayjs();
      let nextPrayerTime = null;
      let nextPrayerName = "";
      let startTime = null;

      // আগের দিনের এশা হিসাব
      const yesterday = now.subtract(1, "day");
      const yesterdayParams = CalculationMethod.MuslimWorldLeague();
      yesterdayParams.madhab = Madhab.Shafi;
      const yesterdayPrayerTimes = new PrayerTimes(
        { latitude: location.latitude, longitude: location.longitude },
        yesterday.toDate(),
        yesterdayParams
      );
      const yesterdayIsha = dayjs(yesterdayPrayerTimes.isha);

      // আজকের ফজরের ২ মিনিট আগে
      const todayFajr = dayjs(prayerTimes.fajr).subtract(2, "minute");

      // আগের দিনের এশা থেকে আজকের ফজরের ২ মিনিট আগে পর্যন্ত
      if (now.isAfter(yesterdayIsha) && now.isBefore(todayFajr)) {
        nextPrayerTime = todayFajr;
        nextPrayerName = "Isha";
        startTime = yesterdayIsha;
      } else {
        // Normal days
        const prayersOrder = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
        for (let i = 0; i < prayersOrder.length; i++) {
          const name = prayersOrder[i];
          const time = dayjs(prayerTimes[name]);
          if (now.isBefore(time)) {
            nextPrayerTime = time;
            nextPrayerName = name;
            startTime = now;
            break;
          }
        }
        if (!nextPrayerTime) {
          nextPrayerTime = dayjs(prayerTimes.fajr).add(1, "day");
          nextPrayerName = "Fajr";
          startTime = now;
        }
      }

      setCurrentPrayer(nextPrayerName);

      const diff = nextPrayerTime.diff(now);
      const duration = dayjs.duration(diff);
      const formatted = `${duration.hours()} ঘন্টা ${duration.minutes()} মিনিট ${duration.seconds()} সেকেন্ড`;
      setTimeRemaining(formatted);

      // Progress calculation
      if (startTime) {
        const total = nextPrayerTime.diff(startTime);
        const passed = now.diff(startTime);
        setProgress(Math.min(Math.max(passed / total, 0), 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, location]);

  if (!location || !prayerTimes)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>নামাজের সময়</Text>

      <View style={styles.card}>
        <Text style={styles.prayerName}>{currentPrayer?.toUpperCase()}</Text>
        <Text style={styles.countdown}>{timeRemaining}</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.progressFill, { flex: progress }]}
          />
          <View style={{ flex: 1 - progress }} />
        </View>
      </View>

      <View style={styles.timesCard}>
        <Text style={styles.timeText}>ফজর: {dayjs(prayerTimes.fajr).format("HH:mm")}</Text>
        <Text style={styles.timeText}>যোহর: {dayjs(prayerTimes.dhuhr).format("HH:mm")}</Text>
        <Text style={styles.timeText}>আসর: {dayjs(prayerTimes.asr).format("HH:mm")}</Text>
        <Text style={styles.timeText}>মাগরিব: {dayjs(prayerTimes.maghrib).format("HH:mm")}</Text>
        <Text style={styles.timeText}>এশা: {dayjs(prayerTimes.isha).format("HH:mm")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4f7" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: { width: "100%", padding: 20, borderRadius: 15, backgroundColor: "#fff", marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  prayerName: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  countdown: { fontSize: 20, textAlign: "center", marginBottom: 15 },
  progressBar: { flexDirection: "row", height: 10, borderRadius: 5, overflow: "hidden", backgroundColor: "#e0e0e0" },
  progressFill: { height: "100%" },
  timesCard: { width: "100%", padding: 15, borderRadius: 15, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  timeText: { fontSize: 18, marginVertical: 3 },
});

export default PrayerTimePage;
