import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import "dayjs/locale/bn"; // Import Bengali locale for Day.js

dayjs.extend(durationPlugin);
dayjs.locale("bn");

const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

export default function PrayerTimesComponent() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [coords, setCoords] = useState(null);

  const animatedColor = useSharedValue(["#10B981", "#059669"]);

  const dynamicColors = [
    ["#10B981", "#059669"], // Emerald
    ["#3B82F6", "#2563EB"], // Blue
    ["#F59E0B", "#D97706"], // Yellow
    ["#E11D48", "#BE123C"], // Red
    ["#9333EA", "#7C3AED"], // Purple
  ];

  // Animate gradient colors
  useEffect(() => {
    let index = 0;
    const colorTimer = setInterval(() => {
      index = (index + 1) % dynamicColors.length;
      animatedColor.value = withTiming(dynamicColors[index], {
        duration: 2000,
      });
    }, 5000);
    return () => clearInterval(colorTimer);
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      colors: animatedColor.value,
    };
  });

  // Load location and prayer times
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

        const place = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (place.length > 0) setCity(`${place[0].city}, ${place[0].country}`);

        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;

        const today = new Date();
        const prayerTimes = new PrayerTimes(
          { latitude, longitude },
          today,
          params
        );

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPrayerTimes = new PrayerTimes(
          { latitude, longitude },
          tomorrow,
          params
        );

        const formattedTimes = [
          {
            name: "ফজর",
            startTime: dayjs(prayerTimes.fajr),
            endTime: dayjs(prayerTimes.sunrise),
            icon: "weather-sunset-up",
            color: "#0EA5E9",
          },
          {
            name: "যোহর",
            startTime: dayjs(prayerTimes.dhuhr),
            endTime: dayjs(prayerTimes.asr),
            icon: "weather-sunny",
            color: "#F59E0B",
          },
          {
            name: "আসর",
            startTime: dayjs(prayerTimes.asr),
            endTime: dayjs(prayerTimes.maghrib),
            icon: "weather-sunset-down",
            color: "#E11D48",
          },
          {
            name: "মাগরিব",
            startTime: dayjs(prayerTimes.maghrib),
            endTime: dayjs(prayerTimes.isha),
            icon: "weather-night",
            color: "#FF4500",
          },
          {
            name: "এশা ও তাহাজ্জুদ",
            startTime: dayjs(prayerTimes.isha),
            endTime: dayjs(tomorrowPrayerTimes.fajr).subtract(2, "minutes"),
            icon: "moon-waxing-crescent",
            color: "#9333EA",
          },
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

  // Countdown and current prayer time identification
  useEffect(() => {
    if (times.length === 0 || !coords) return;
    const timer = setInterval(() => {
      const now = dayjs();
      let nextWaqtIndex = -1;

      for (let i = 0; i < times.length; i++) {
        if (now.isBefore(times[i].startTime)) {
          nextWaqtIndex = i;
          break;
        }
      }

      let currentWaqtData;
      let nextWaqtData;

      if (nextWaqtIndex !== -1) {
        nextWaqtData = times[nextWaqtIndex];
        currentWaqtData =
          times[nextWaqtIndex > 0 ? nextWaqtIndex - 1 : times.length - 1];
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(now.date() + 1);
        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;
        const tomorrowPrayerTimes = new PrayerTimes(coords, tomorrow, params);

        nextWaqtData = {
          name: "ফজর",
          startTime: dayjs(tomorrowPrayerTimes.fajr),
          icon: "weather-sunset-up",
          color: "#0EA5E9",
        };
        currentWaqtData = times[times.length - 1];
      }

      setNextWaqt(nextWaqtData);
      setCurrentWaqt(currentWaqtData);

      const diff = nextWaqtData.startTime.diff(now);
      const duration = dayjs.duration(diff);
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      setCountdown(
        `${toBanglaNumber(String(hours).padStart(2, "০"))}:${toBanglaNumber(
          String(minutes).padStart(2, "০")
        )}:${toBanglaNumber(String(seconds).padStart(2, "০"))}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [times, coords]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>{city}</Text>
      </View>
    );

  const currentDay = dayjs().format("DD MMMM, YYYY");
  const sunsetTime = times[2]?.endTime.format("h:mm A");
  const sunriseTime = times[1]?.startTime.format("h:mm A");

  return (
    <ScrollView style={styles.container}>
      {/* Date and Location Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Icon name="calendar-today" size={20} color="#333" />
          <Text style={styles.infoText}>{toBanglaNumber(currentDay)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="map-marker-outline" size={20} color="#333" />
          <Text style={styles.infoText}>{city}</Text>
        </View>
      </View>

      {/* Main Gradient Card */}
      <Animated.View style={[styles.cardContainer, animatedGradientStyle]}>
        <LinearGradient
          colors={animatedColor.value}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.countdownBox}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.remainingText}>
              {nextWaqt?.name} শুরু হতে বাকি
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="weather-sunset-up" size={20} color="#fff" />
              <Text style={styles.detailText}>
                সূর্যোদয়: {toBanglaNumber(sunriseTime)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="weather-sunset-down" size={20} color="#fff" />
              <Text style={styles.detailText}>
                সূর্যাস্ত: {toBanglaNumber(sunsetTime)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Prayer Times List */}
      <View style={styles.listContainer}>
        <FlatList
          data={times}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.prayerItem,
                item.name === currentWaqt?.name && styles.highlightedItem,
              ]}
            >
              <Icon
                name={item.icon}
                size={24}
                color={item.name === currentWaqt?.name ? item.color : "#4A4A4A"}
              />
              <Text
                style={[
                  styles.prayerName,
                  item.name === currentWaqt?.name && { color: item.color },
                ]}
              >
                {item.name} {item.name === currentWaqt?.name && "(এখন)"}
              </Text>
              <View style={styles.timeDetails}>
                <Text
                  style={[
                    styles.prayerTime,
                    item.name === currentWaqt?.name && { color: item.color },
                  ]}
                >
                  শুরু: {toBanglaNumber(item.startTime.format("h:mm A"))}
                </Text>
                <Text
                  style={[
                    styles.prayerTime,
                    item.name === currentWaqt?.name && { color: item.color },
                  ]}
                >
                  শেষ: {toBanglaNumber(item.endTime.format("h:mm A"))}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#10B981" },
  // নতুন লোকেশন এবং তারিখ সেকশন
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    padding: 20,
    alignItems: "center",
  },
  countdownBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  remainingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 5,
  },
  listContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  prayerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightedItem: {
    borderWidth: 2,
    borderColor: "#10B981",
  },
  prayerName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: 15,
  },
  prayerTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  timeDetails: {
    alignItems: "flex-end",
  },
});