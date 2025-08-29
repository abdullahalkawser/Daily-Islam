import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";
import { PrayerTimes, CalculationMethod, Madhab } from "adhan";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';

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

const screenWidth = Dimensions.get("window").width;

export default function PrayerPage() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("লোকেশন লোড হচ্ছে...");
  const [times, setTimes] = useState(null);
  const [prayerWindows, setPrayerWindows] = useState([]);
  const [currentWaqt, setCurrentWaqt] = useState(null);
  const [waqtEndCountdown, setWaqtEndCountdown] = useState("");

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
      const activeWaqt = prayerWindows.find(p=> now.isAfter(p.start) && now.isBefore(p.end));
      setCurrentWaqt(activeWaqt?activeWaqt.name:null);

      if(activeWaqt){
        const diff = activeWaqt.end.diff(now);
        const dur = dayjs.duration(diff);
        setWaqtEndCountdown(`${toBanglaNumber(dur.hours())} ঘণ্টা ${toBanglaNumber(dur.minutes())} মিনিট বাকি`);
      } else setWaqtEndCountdown("ওয়াক্ত শেষ");
    },1000);
    return ()=> clearInterval(timer);
  }, [times, prayerWindows]);

  if(loading) return(
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#10B981"/>
      <Text style={styles.loadingText}>{city}</Text>
    </View>
  );

  const rowGradients = [
    ['#DCFCE7','#BBF7D0'], // ফজর
    ['#DBEAFE','#BFDBFE'], // যোহর
    ['#FEF3C7','#FDE68A'], // আসর
    ['#FEE2E2','#FECACA'], // মাগরিব
    ['#EDE9FE','#DDD6FE'], // এশা
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sunInfo}>
        <Icon name="map-marker" size={20} color="#10B981" />
        <Text style={styles.locationName}>{city}</Text>
      </View>

      <View style={styles.prayerTable}>
        <View style={styles.prayerHeader}>
          <Text style={styles.prayerHeaderText}>নামাজ</Text>
          <Text style={styles.prayerHeaderText}>ওয়াক্ত</Text>
        </View>

        {prayerWindows.map((p,i)=>{
          const isActive = currentWaqt===p.name;
          return(
            <LinearGradient
              key={i}
              colors={isActive ? ['#D1FAE5','#6EE7B7'] : rowGradients[i]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.prayerRow, {borderRadius: 12, marginVertical: 4, elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:3}]}
            >
              <Text style={[styles.prayerName, isActive && {color: prayerInfo[p.name]?.color, fontWeight:'700'}]}>{p.name}</Text>
              <View>
                <Text style={[styles.prayerTime, isActive && {color: prayerInfo[p.name]?.color, fontWeight:'700'}]}>
                  {toBanglaNumber(p.start.format("hh:mm"))} - {toBanglaNumber(p.end.format("hh:mm A"))}
                </Text>
                {isActive && <Text style={styles.waqtLabel}>{waqtEndCountdown}</Text>}
              </View>
            </LinearGradient>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#23ca69ff', paddingTop:20 },
  center:{flex:1,justifyContent:'center',alignItems:'center'},
  loadingText:{marginTop:10,fontSize:16,color:'#10B981'},
  sunInfo:{flexDirection:'row',alignItems:'center',marginBottom:15,paddingHorizontal:20},
  locationName:{fontSize:16,fontWeight:'bold',marginLeft:8,color:'#1F2937'},
  prayerTable:{marginHorizontal:20, marginBottom:30},
  prayerHeader:{flexDirection:'row', backgroundColor:'#E5E7EB', paddingVertical:12, borderTopLeftRadius:12, borderTopRightRadius:12},
  prayerHeaderText:{flex:1,fontSize:16,fontWeight:'bold',textAlign:'center',color:'#111'},
  prayerRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:16,paddingHorizontal:12},
  prayerName:{flex:1,fontSize:16,fontWeight:'500',textAlign:'center',color:'#333'},
  prayerTime:{flex:1,fontSize:16,fontWeight:'500',textAlign:'center',color:'#555'},
  waqtLabel:{fontSize:14,fontWeight:'bold',color:'#10B981',marginTop:2,textAlign:'center'},
});
