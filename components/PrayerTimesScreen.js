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
  if (typeof numStr !== 'string') numStr = String(numStr);
  const map = { "0":"০","1":"১","2":"২","3":"৩","4":"৪","5":"৫","6":"৬","7":"৭","8":"৮","9":"৯" };
  return numStr.replace(/[0-9]/g, (m)=>map[m]);
};

const prayerInfo = {
  ফজর: { color: "#10B981", icon: "weather-night" },
  যোহর: { color: "#3B82F6", icon: "weather-sunny" },
  আসর: { color: "#F59E0B", icon: "weather-partly-cloudy" },
  মাগরিব: { color: "#EF4444", icon: "weather-sunset" },
  এশা: { color: "#8B5CF6", icon: "moon-waning-crescent" },
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const screenWidth = Dimensions.get("window").width;

export default function PrayerTimesScreen() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState(null);
  const [prayerWindows, setPrayerWindows] = useState([]);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [waqtEndCountdown, setWaqtEndCountdown] = useState("");
  const [hijri, setHijri] = useState("২৯-শাওয়াল, ১৪৪৬ হিজরি");

  const circleSize = screenWidth * 0.5;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressValue = useSharedValue(0);

  // Load Location & Prayer Times
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("লোকেশন পারমিশন দরকার।");
        setCity("লোকেশন পাওয়া যায়নি");
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
        const tomorrow = new Date(); tomorrow.setDate(today.getDate()+1);

        const prayerTimes = new PrayerTimes({latitude, longitude}, today, params);
        const tomorrowPrayerTimes = new PrayerTimes({latitude, longitude}, tomorrow, params);

        const formattedTimes = {
          ফজর: dayjs(prayerTimes.fajr),
          যোহর: dayjs(prayerTimes.dhuhr),
          আসর: dayjs(prayerTimes.asr),
          মাগরিব: dayjs(prayerTimes.maghrib),
          এশা: dayjs(prayerTimes.isha),
          Sunrise: dayjs(prayerTimes.sunrise),
          Sunset: dayjs(prayerTimes.maghrib)
        };
        setTimes(formattedTimes);

        const windows = [
          { name:"ফজর", start: formattedTimes.ফজর, end: formattedTimes.Sunrise },
          { name:"যোহর", start: formattedTimes.যোহর, end: formattedTimes.আসর },
          { name:"আসর", start: formattedTimes.আসর, end: formattedTimes.মাগরিব },
          { name:"মাগরিব", start: formattedTimes.মাগরিব, end: formattedTimes.এশা },
          { name:"এশা", start: formattedTimes.এশা, end: dayjs(tomorrowPrayerTimes.fajr) },
        ];
        setPrayerWindows(windows);
        setLoading(false);
      } catch(err) { console.error(err); setCity("তথ্য পাওয়া যায়নি"); setLoading(false); }
    })();
  }, []);

  // Timer
  useEffect(()=>{
    if(!times || prayerWindows.length===0) return;
    const timer = setInterval(()=>{
      const now = dayjs();
      const upcoming = Object.entries(times)
        .filter(([name]) => ['ফজর','যোহর','আসর','মাগরিব','এশা'].includes(name))
        .find(([_,time]) => time.isAfter(now));
      let currentPrayerName = upcoming ? upcoming[0] : "ফজর";
      let currentPrayerTime = upcoming ? upcoming[1] : prayerWindows.find(p=>p.name==="এশা").end;
      setNextPrayer(currentPrayerName);

      const diff = currentPrayerTime.diff(now);
      const dur = dayjs.duration(diff);
      setCountdown(`${toBanglaNumber(String(dur.hours()).padStart(2,'0'))}:${toBanglaNumber(String(dur.minutes()).padStart(2,'0'))}:${toBanglaNumber(String(dur.seconds()).padStart(2,'0'))}`);

      const prayerNames=['ফজর','যোহর','আসর','মাগরিব','এশা'];
      const nextIdx = prayerNames.indexOf(currentPrayerName);
      const prevPrayerTime = times[prayerNames[(nextIdx+prayerNames.length-1)%prayerNames.length]];

      const totalDuration = currentPrayerTime.diff(prevPrayerTime);
      const elapsed = now.diff(prevPrayerTime);
      progressValue.value = withTiming(Math.min(1, elapsed/totalDuration), { duration:500, easing:Easing.out(Easing.exp) });

      const activeWaqt = prayerWindows.find(p=> now.isAfter(p.start) && now.isBefore(p.end));
      setCurrentWaqt(activeWaqt?activeWaqt.name:null);
      if(activeWaqt){
        const waqtEndDiff = activeWaqt.end.diff(now);
        const waqtDur = dayjs.duration(waqtEndDiff);
        setWaqtEndCountdown(`${toBanglaNumber(waqtDur.hours())} ঘণ্টা ${toBanglaNumber(waqtDur.minutes())} মিনিট বাকি`);
      } else setWaqtEndCountdown("ওয়াক্ত শেষ");
    },1000);
    return ()=> clearInterval(timer);
  }, [times, prayerWindows]);

  const animatedProps = useAnimatedProps(()=>({ strokeDashoffset: circumference-progressValue.value*circumference }));

  if(loading) return(
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#10B981"/>
      <Text style={styles.loadingText}>{city}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      
      {/* Location & Hijri */}
      <View style={styles.topInfo}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:4}}>
          <Icon name="map-marker" size={20} color="#10B981"/>
          <Text style={styles.locationText}>{city}</Text>
        </View>
        <Text style={styles.hijriText}>{hijri}</Text>
      </View>

      {/* Current Prayer */}
      {/* Current Prayer */}
<View style={styles.section}>
  <Svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>

    {/* Red Glow */}
    <Circle
      cx={circleSize/2}
      cy={circleSize/2}
      r={radius + 6}
      stroke="rgba(9, 201, 169, 0.3)"
      strokeWidth={strokeWidth + 10}
      fill="none"
    />

    {/* Background Circle */}
    <Circle
      cx={circleSize/2}
      cy={circleSize/2}
      r={radius}
      stroke="#01b10fff" // light red
      strokeWidth={strokeWidth}
      fill="none"
    />

    {/* Animated Progress Stroke */}
    <AnimatedCircle
      cx={circleSize/2}
      cy={circleSize/2}
      r={radius}
      stroke="#17ff64ff" // green
      strokeWidth={strokeWidth}
      strokeDasharray={`${circumference}`}
      animatedProps={animatedProps}
      strokeLinecap="round"
      fill="none"
      transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`}
    />

    {/* Center Text */}
    <SvgText
      x={circleSize/2}
      y={circleSize/2-20}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="#000000ff"
      fontSize={14}
      fontWeight="600"
    >
      এখন চলছে
    </SvgText>
    <SvgText
      x={circleSize/2}
      y={circleSize/2}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="#4ff800ff"
      fontSize={26}
      fontWeight="bold"
    >
      {currentWaqt || "-"}
    </SvgText>
    <SvgText
      x={circleSize/2}
      y={circleSize/2 + 30}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="#B91C1C"
      fontSize={16}
      fontWeight="500"
    >
      {countdown}
    </SvgText>

    {/* Sun / Moon Icon */}
    <SvgText
      x={circleSize/2}
      y={circleSize/2 + 60}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize={22}
      fill={nextPrayer === "ফজর" || nextPrayer === "এশা" ? "#6B7280" : "#FDB813"}
    >
      {nextPrayer === "ফজর" || nextPrayer === "এশা" ? "🌙" : "☀️"}
    </SvgText>

  </Svg>

  {/* Text below circle */}
  <Text style={[styles.outsideText, {color: '#17ff64ff'}]}>নামাজের সময় বাকি আছে</Text>
</View>




      {/* Sunrise & Sunset */}
      <View style={styles.sunInfo}>
        <View style={styles.sunItem}><Icon name="weather-sunset-up" size={20} color="#FDB813"/><Text style={styles.sunText}>সূর্যোদয় {toBanglaNumber(times.Sunrise.format("h:mm"))}</Text></View>
        <View style={styles.sunItem}><Icon name="weather-sunset-down" size={20} color="#FF4500"/><Text style={styles.sunText}>সূর্যাস্ত {toBanglaNumber(times.Sunset.format("h:mm"))}</Text></View>
      </View>

      {/* Prayer List */}
      <View style={styles.section}>
        {prayerWindows.map((p,i)=>{
          const isActive = currentWaqt===p.name;
          return(
            <View key={i} style={styles.prayerItem}>
              <Text style={[styles.prayerName,isActive && {color:prayerInfo[p.name]?.color}]}>{p.name}</Text>
              <Text style={[styles.prayerTime,isActive && {color:prayerInfo[p.name]?.color}]}>{toBanglaNumber(p.start.format("hh:mm"))} - {toBanglaNumber(p.end.format("hh:mm A"))}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',paddingTop:20},
  center:{flex:1,justifyContent:'center',alignItems:'center'},
  loadingText:{marginTop:10,fontSize:16,color:'#10B981'},
  topInfo:{paddingHorizontal:20,marginBottom:20},
  locationText:{fontSize:16,fontWeight:'500',marginLeft:6,color:'#000'},
  hijriText:{fontSize:14,color:'#555'},
  section:{paddingHorizontal:20,marginBottom:20,alignItems:'center'},
  progressContainer:{alignItems:'center'},
  sunInfo:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:40,marginBottom:20},
  sunItem:{flexDirection:'row',alignItems:'center'},
  sunText:{marginLeft:6,fontSize:14,color:'#555'},
  prayerItem:{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingVertical:12,borderBottomColor:'#EEE',borderBottomWidth:1},
  prayerName:{fontSize:18,fontWeight:'600',color:'#333'},
  prayerTime:{fontSize:16,color:'#555'},
  outsideText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#10B981',
  textAlign: 'center',
  marginTop: 10,
},

});
