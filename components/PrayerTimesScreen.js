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

const PrayerTimeItem = ({ item, isEnded, isCurrent }) => {
  return (
    <View style={[styles.prayerItem, isEnded && styles.endedItem, isCurrent && styles.currentItem]}>
      <Text style={[styles.prayerItemName, (isEnded || isCurrent) && { color: isCurrent ? '#fff' : '#6B7280' }]}>
        {item.name}
      </Text>
      <Text style={[styles.prayerItemTime, (isEnded || isCurrent) && { color: isCurrent ? '#fff' : '#6B7280' }]}>
        {toBanglaNumber(item.startTime.format("h:mm A"))} - {toBanglaNumber(item.endTime.format("h:mm A"))}
      </Text>
    </View>
  );
};

const ForbiddenTimeItem = ({ item }) => (
  <View style={styles.forbiddenCard}>
    <Text style={styles.forbiddenCardName}>{item.name}</Text>
    <Text style={styles.forbiddenCardTime}>
      {toBanglaNumber(item.start.format("h:mm A"))} - {toBanglaNumber(item.end.format("h:mm A"))}
    </Text>
  </View>
);

export default function PrayerTimesComponent() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState([]);
  const [nextWaqt, setNextWaqt] = useState(null);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [endedWaqt, setEndedWaqt] = useState(null);
  const [countdown, setCountdown] = useState("০০:০০:০০");
  const [coords, setCoords] = useState(null);
  const [forbiddenTimes, setForbiddenTimes] = useState([]);

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
          { name: "সূর্যোদয়", startTime: dayjs(prayerTimes.sunrise), endTime: dayjs(prayerTimes.sunrise).add(20, "minutes"), icon: "weather-sunny" },
          { name: "যোহর", startTime: dayjs(prayerTimes.dhuhr), endTime: dayjs(prayerTimes.asr), icon: "weather-sunny" },
          { name: "আসর", startTime: dayjs(prayerTimes.asr), endTime: dayjs(prayerTimes.maghrib), icon: "weather-sunset-down" },
          { name: "সূর্যাস্ত", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.maghrib).add(15, "minutes"), icon: "weather-night" },
          { name: "মাগরিব", startTime: dayjs(prayerTimes.maghrib), endTime: dayjs(prayerTimes.isha), icon: "weather-night" },
          { name: "এশা", startTime: dayjs(prayerTimes.isha), endTime: dayjs(tomorrowPrayerTimes.fajr), icon: "moon-waxing-crescent" },
          { name: "তাহাজ্জুদ", startTime: dayjs(prayerTimes.isha).add(1, "hour"), endTime: dayjs(tomorrowPrayerTimes.fajr).subtract(15, "minutes"), icon: "bed" },
        ];
        setTimes(formattedTimes);
        
        setForbiddenTimes([
          { name: "সূর্যোদয়", start: dayjs(prayerTimes.sunrise).subtract(5, "minutes"), end: dayjs(prayerTimes.sunrise).add(20, "minutes"), icon: "weather-sunset-up" },
          { name: "মধ্যাহ্ন", start: dayjs(prayerTimes.dhuhr).subtract(10, "minutes"), end: dayjs(prayerTimes.dhuhr), icon: "white-balance-sunny" },
          { name: "সূর্যাস্ত", start: dayjs(prayerTimes.maghrib).subtract(15, "minutes"), end: dayjs(prayerTimes.maghrib), icon: "weather-sunset-down" },
        ]);

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
      let foundCurrentWaqt = null;
      let foundNextWaqt = null;
      let foundEndedWaqt = null;

      const sortedTimes = [...times].sort((a, b) => a.startTime.isBefore(b.startTime) ? -1 : 1);

      // Find the current and next prayer times
      let nextWaqtIndex = -1;
      let currentWaqtIndex = -1;

      for (let i = 0; i < sortedTimes.length; i++) {
        const item = sortedTimes[i];
        if (now.isAfter(item.startTime) && now.isBefore(item.endTime)) {
          foundCurrentWaqt = item;
          currentWaqtIndex = i;
          break;
        }
      }

      if (foundCurrentWaqt) {
        // If we found a current waqt, the next waqt is the next one in the sorted array,
        // or the first one of the next day if we are at the last one.
        nextWaqtIndex = (currentWaqtIndex + 1) % sortedTimes.length;
        foundNextWaqt = sortedTimes[nextWaqtIndex];
        foundEndedWaqt = sortedTimes[(currentWaqtIndex - 1 + sortedTimes.length) % sortedTimes.length];
      } else {
        // If no prayer time is currently active, we are between prayers.
        // Find the first prayer time that has not passed yet.
        for (let i = 0; i < sortedTimes.length; i++) {
          if (now.isBefore(sortedTimes[i].startTime)) {
            foundNextWaqt = sortedTimes[i];
            foundEndedWaqt = sortedTimes[(i - 1 + sortedTimes.length) % sortedTimes.length];
            break;
          }
        }
        if (!foundNextWaqt) {
          // If we are past the last prayer of the day, the next is Fajr of the next day.
          foundNextWaqt = sortedTimes[0];
          foundEndedWaqt = sortedTimes[sortedTimes.length - 1];
        }
      }

      setCurrentWaqt(foundCurrentWaqt);
      setNextWaqt(foundNextWaqt);
      setEndedWaqt(foundEndedWaqt);

      if (foundNextWaqt) {
        let diff = foundNextWaqt.startTime.diff(now);
        if (diff < 0) {
          // If the next prayer is on the next day, calculate the difference from now until tomorrow's prayer time
          const nextDayPrayerTime = foundNextWaqt.startTime.add(1, 'day');
          diff = nextDayPrayerTime.diff(now);
        }
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
              {times
                .filter(t => t.name !== 'সূর্যোদয়' && t.name !== 'সূর্যাস্ত')
                .map((item, index) => (
                  <PrayerTimeItem
                    key={index}
                    item={item}
                    isEnded={endedWaqt?.name === item.name}
                    isCurrent={currentWaqt?.name === item.name}
                  />
                ))}
            </View>
          </View>
        </View>
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>নামাজের নিষিদ্ধ সময়</Text>
          <View style={styles.forbiddenItemsContainer}>
            {forbiddenTimes.map((item, index) => (
              <ForbiddenTimeItem
                key={index}
                item={item}
              />
            ))}
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
    marginBottom: 15
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
    padding: 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
  },
  prayerItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  prayerItem: {
    width: '30%',
    backgroundColor: '#E6F0F2',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A4D9E2',
    marginBottom: 10,
  },
  endedItem: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  currentItem: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  prayerItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  prayerItemTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A6E60',
    marginTop: 5,
    textAlign: 'center',
  },
  forbiddenItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forbiddenCard: {
    width: '30%',
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  forbiddenCardName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
  },
  forbiddenCardTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 5,
    textAlign: 'center',
  }
});
