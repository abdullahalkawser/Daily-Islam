import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from "react-native-reanimated";
import "dayjs/locale/bn";

dayjs.extend(durationPlugin);
dayjs.locale("bn");

const screenWidth = Dimensions.get("window").width;

const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

const PrayerTimeItem = ({ item, isEnded }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomColor: withTiming(isEnded ? '#E5E7EB' : '#ccc'),
    };
  });

  return (
    <Animated.View style={[styles.prayerItem, animatedStyle]}>
      <Text style={[styles.prayerItemName, isEnded && { color: '#6B7280' }]}>{item.name}</Text>
      <Text style={[styles.prayerItemTime, isEnded && { color: '#6B7280' }]}>{toBanglaNumber(item.startTime.format("h:mm"))}</Text>
      {isEnded && <Text style={styles.endedLabel}>শেষ হয়েছে</Text>}
    </Animated.View>
  );
};

export default function PrayerTimesComponent() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState([]);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [endedWaqt, setEndedWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [coords, setCoords] = useState(null);

  const animatedColor = useSharedValue(["#10B981", "#059669"]);
  const dynamicColors = [
    ["#10B981", "#059669"],
    ["#3B82F6", "#2563EB"],
    ["#F59E0B", "#D97706"],
    ["#E11D48", "#BE123C"],
    ["#9333EA", "#7C3AED"],
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

        const formattedTimes = [
          { name: "ফজর", startTime: dayjs(prayerTimes.fajr), endTime: dayjs(prayerTimes.sunrise), icon: "moon-waning-gibbous" },
          { name: "সালাতুল দুহা", startTime: dayjs(prayerTimes.sunrise).add(20, 'minutes'), endTime: dayjs(prayerTimes.dhuhr), icon: "weather-sunny" },
          { name: "যোহর", startTime: dayjs(prayerTimes.dhuhr), endTime: dayjs(prayerTimes.asr), icon: "weather-sunny" },
          { name: "আসর", startTime: dayjs(prayerTimes.asr), endTime: dayjs(prayerTimes.maghrib), icon: "weather-sunset-down" },
          { name: "মাগরিব", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.isha), icon: "weather-night" },
          { name: "এশা", startTime: dayjs(prayerTimes.isha), endTime: dayjs(tomorrowPrayerTimes.fajr).subtract(10, "minutes"), icon: "moon-waxing-crescent" },
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

  useEffect(() => {
    if (times.length === 0 || !coords) return;

    const timer = setInterval(() => {
      const now = dayjs();
      let nextWaqt = null;
      let endedWaqt = null;

      const sortedTimes = [...times].sort((a, b) => a.startTime.isBefore(b.startTime) ? -1 : 1);
      const currentIndex = sortedTimes.findIndex(time => now.isBefore(time.startTime));

      if (currentIndex !== -1) {
        nextWaqt = sortedTimes[currentIndex];
        if (currentIndex > 0) {
          endedWaqt = sortedTimes[currentIndex - 1];
        } else {
          endedWaqt = sortedTimes[sortedTimes.length - 1];
        }
      } else {
        const tomorrow = new Date(dayjs());
        tomorrow.setDate(tomorrow.getDate() + 1);
        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;
        const tomorrowPrayerTimes = new PrayerTimes({ latitude: coords.latitude, longitude: coords.longitude }, tomorrow, params);
        nextWaqt = {
          name: "ফজর",
          startTime: dayjs(tomorrowPrayerTimes.fajr),
        };
        endedWaqt = sortedTimes[sortedTimes.length - 1];
      }

      setNextWaqt(nextWaqt);
      setEndedWaqt(endedWaqt);

      if (nextWaqt) {
        const diff = nextWaqt.startTime.diff(now);
        if (diff > 0) {
          const duration = dayjs.duration(diff);
          setCountdown(
            `${toBanglaNumber(String(Math.floor(duration.asHours())).padStart(2, "০"))}:${toBanglaNumber(String(duration.minutes()).padStart(2, "০"))}:${toBanglaNumber(String(duration.seconds()).padStart(2, "০"))}`
          );
        } else {
          setCountdown("নতুন ওয়াক্ত শুরু হয়েছে");
        }
      } else {
        setCountdown("সময় পাওয়া যায়নি");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [times, coords]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#333' }}>তথ্য লোড হচ্ছে...</Text>
      </View>
    );
  }

  const sunriseTime = times.find(t => t.name === 'ফজর')?.endTime;
  const sunsetTime = times.find(t => t.name === 'আসর')?.endTime;
  const filteredTimes = times.filter(item => item.name !== "ফজর" && item.name !== "যোহর");

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
            <Text style={styles.remainingText}>
              {nextWaqt ? `পরবর্তী ওয়াক্ত (${nextWaqt.name}) শুরু হতে বাকি` : 'সময় পাওয়া যায়নি'}
            </Text>
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

        <View style={styles.contentRow}>
          <View style={styles.prayerTimesSection}>
            <Text style={styles.cardTitle}>আজকের নামাজের সময়সূচী</Text>
            <View style={styles.prayerItemsContainer}>
              {filteredTimes.map((item, index) => (
                <PrayerTimeItem
                  key={index}
                  item={item}
                  isEnded={endedWaqt?.name === item.name}
                />
              ))}
            </View>
          </View>
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
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  gradientCard: {
    borderRadius: 20,
    margin: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  gradientCardContent: {
    padding: 25,
    alignItems: "center",
    borderRadius: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  remainingText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    height: 24,
  },
  sunInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  sunInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500'
  },
  contentRow: {
    flexDirection: screenWidth > 600 ? 'row' : 'column',
    marginHorizontal: 15,
    marginTop: 10,
    gap: 15,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  prayerTimesSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
  },
  prayerItemsContainer: {
    flexDirection: 'column',
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
    borderBottomWidth: 10,
    borderBottomColor: '#ccc',
  },
  prayerItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  prayerItemTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A6E60',
  },
  endedLabel: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
  }
});
