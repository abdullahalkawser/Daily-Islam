import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const sunnahItems = [
  { href: "/meswak", title: "মেসওয়াক", icon: "🌿", colors: ["#4CAF50", "#66BB6A"] },
  { href: "/start-right", title: "ডান দিক থেকে শুরু", icon: "➡️", colors: ["#2196F3", "#42A5F5"] },
  { href: "/wash-hands", title: "হাত ধোয়া", icon: "💧", colors: ["#9C27B0", "#AB47BC"] },
  { href: "/three-fingers", title: "তিন আঙুল", icon: "✋", colors: ["#FF9800", "#FFB74D"] },
  { href: "/sleep-right", title: "ডান কাত হয়ে ঘুম", icon: "🛌", colors: ["#5D4037", "#8D6E63"] },
  { href: "/loud-salam", title: "জোরে সালাম", icon: "🗣️", colors: ["#E91E63", "#F06292"] },
  { href: "/smile", title: "হাসিমুখে কথা", icon: "😊", colors: ["#00BCD4", "#26C6DA"] },
  { href: "/dress-caution", title: "পোশাক সতর্কতা", icon: "👕", colors: ["#607D8B", "#90A4AE"] },
  { href: "/serve-sick", title: "রোগীর সেবা", icon: "🏥", colors: ["#8BC34A", "#AED581"] },
];

const SunnahList = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.header}>নবী (সাঃ) এর ৯টি সুন্নাহ 🌙</Text>

      <View style={styles.grid}>
        {sunnahItems.map((item, index) => (
          <Link key={index} href={item.href} asChild>
            <Card item={item} />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

const Card = ({ item }) => {
  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient colors={item.colors} style={styles.gradient}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%', // প্রতি লাইনে ৩টা বক্স
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  gradient: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SunnahList;
