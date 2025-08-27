import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#e0e0e0',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView tint="default" intensity={80} style={StyleSheet.absoluteFillObject} />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 90 : 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dailyplan"
        options={{
          title: 'Dailyplan',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-list-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="completeAmol"
        options={{
          title: 'Amol Tracker',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="check-circle-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}