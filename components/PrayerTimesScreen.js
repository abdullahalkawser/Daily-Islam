import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from "react-native-reanimated";

dayjs.extend(duration);

const toBanglaNumber = (numStr) => {
  if (typeof numStr !== "string") numStr = String(numStr);
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return numStr.replace(/[0-9]/g, (m) => map[m]);
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const screenWidth = Dimensions.get("window").width;

export default function PrayerTimesScreen() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState(null);
  const [prayerWindows, setPrayerWindows] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [waqtEndCountdown, setWaqtEndCountdown] = useState("");
  const [hijri, setHijri] = useState("২৯-শাওয়াল, ১৪৪৬ হিজরি");
  const [currentColor, setCurrentColor] = useState("#10B981");
    const [countdown, setCountdown] = useState("");

  const circleSize = screenWidth * 0.35;
  const strokeWidth = 3;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressValue = useSharedValue(0);

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
        const place = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place.length > 0) setCity(`${place[0].city}, ${place[0].country}`);

        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const prayerTimes = new PrayerTimes({ latitude, longitude }, today, params);
        const tomorrowPrayerTimes = new PrayerTimes({ latitude, longitude }, tomorrow, params);

        const formattedTimes = {
          ফজর: dayjs(prayerTimes.fajr),
          যোহর: dayjs(prayerTimes.dhuhr),
          আসর: dayjs(prayerTimes.asr),
          মাগরিব: dayjs(prayerTimes.maghrib),
          "এশা ও তাহাজ্জুদ": dayjs(prayerTimes.isha),
          Sunrise: dayjs(prayerTimes.sunrise),
          Sunset: dayjs(prayerTimes.maghrib),
        };

        setTimes(formattedTimes);

        const windows = [
          { name: "ফজর", start: formattedTimes.ফজর, end: formattedTimes.Sunrise },
          { name: "যোহর", start: formattedTimes.যোহর, end: formattedTimes.আসর },
          { name: "আসর", start: formattedTimes.আসর, end: formattedTimes.মাগরিব },
          { name: "মাগরিব", start: formattedTimes.মাগরিব, end: formattedTimes["এশা ও তাহাজ্জুদ"] },
          { name: "এশা ও তাহাজ্জুদ", start: formattedTimes["এশা ও তাহাজ্জুদ"], end: dayjs(tomorrowPrayerTimes.fajr) },
        ];
        setPrayerWindows(windows);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setCity("তথ্য পাওয়া যায়নি");
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!times || prayerWindows.length === 0) return;
    const timer = setInterval(() => {
      const now = dayjs();
      const activeWaqt = prayerWindows.find((p) => now.isAfter(p.start) && now.isBefore(p.end));
      setCurrentWaqt(activeWaqt ? activeWaqt.name : null);

      // Countdown
      if (activeWaqt) {
        const waqtEndDiff = activeWaqt.end.diff(now);
   const dur = dayjs.duration(waqtEndDiff);
setCountdown(
  `${toBanglaNumber(String(dur.hours()).padStart(2,'0'))}:${toBanglaNumber(String(dur.minutes()).padStart(2,'0'))}:${toBanglaNumber(String(dur.seconds()).padStart(2,'0'))}`
);


        // Progress animation
        const totalDuration = activeWaqt.end.diff(activeWaqt.start);
        const elapsed = now.diff(activeWaqt.start);
        progressValue.value = withTiming(Math.min(1, elapsed / totalDuration), {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });

        // Color change
        switch(activeWaqt.name) {
          case "ফজর": setCurrentColor("#0EA5E9"); break;
          case "যোহর": setCurrentColor("#F59E0B"); break;
          case "আসর": setCurrentColor("#E11D48"); break;
          case "মাগরিব": setCurrentColor("#FF4500"); break;
          case "এশা ও তাহাজ্জুদ": setCurrentColor("#9333EA"); break;
          default: setCurrentColor("#10B981");
        }
      } else {
        setWaqtEndCountdown("ওয়াক্ত শেষ");
        progressValue.value = withTiming(0, { duration: 500 });
        setCurrentColor("#10B981");
      }

    }, 1000);
    return () => clearInterval(timer);
  }, [times, prayerWindows]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progressValue.value * circumference,
  }));

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>{city}</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>
        <View style={styles.contentRow}>
          {/* Circle + Countdown */}
          <View style={styles.circleContainer}>
            <Svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke={currentColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference}`}
                animatedProps={animatedProps}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
              />
              <SvgText
                x={circleSize / 2}
                y={circleSize / 2 + 5}
                textAnchor="middle"
         fill="white"   
                fontSize={25}
                fontWeight="bold"
              >
                 {countdown}
               
              </SvgText>
            </Svg>
            <Text style={styles.countdownText}>
  {currentWaqt ? `${currentWaqt} ওয়াক্ত\nশেষ হওয়া বাকি` : "পরবর্তী ওয়াক্ত\nশেষ হওয়া বাকি"}
</Text>

               
        
          </View>

          {/* Right-side Info */}
          <View style={styles.infoColumn}>
            <Text style={styles.hijriText}>{hijri}</Text>
            <View style={styles.infoRow}>
              <Icon name="weather-sunny" size={30} color="#ff0808ff" />
              <View style={styles.infoDetails}>
                <Text style={styles.sunTextTime}>সূর্যোদয়: {toBanglaNumber(times.Sunrise.format("h:mm"))}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="weather-sunset" size={30} color="#FF4500" />
              <View style={styles.infoDetails}>
                <Text style={styles.sunTextTime}>সূর্যাস্ত :{toBanglaNumber(times.Sunset.format("h:mm"))}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#10B981" },
  card: {
    backgroundColor: '#12d823ff',
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countdownText: { 
  fontSize: 18, 
  fontWeight: 'bold', 
  textAlign: 'center', 

  color: '#ffffffff' 
},

  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  circleContainer: { alignItems: 'center' },
  infoColumn: { flex: 1, alignItems: 'flex-end', marginLeft: 20 },
  hijriText: { fontSize: 16, color: "#ffffffff", fontWeight: 'bold', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoDetails: { marginLeft: 10, alignItems: 'flex-end' },
  sunTextTime: { fontSize: 14, color: '#fff8f8ff', fontWeight: 'bold' },
  waqtCountdown: { marginTop: 10, fontSize: 14, fontWeight: 'bold' },
  
});
