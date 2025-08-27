import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#e0e0e0',
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <LinearGradient
            colors={['#22C55E', '#16A34A']} // সুন্দর গ্রেডিয়েন্ট
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 100 }]}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          marginHorizontal: 20,
          marginBottom: 10,
          borderRadius: 100,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dailyplan"
        options={{
          title: 'Daily Plan',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="completeAmol"
        options={{
          title: 'Amol Tracker',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="check-circle-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
