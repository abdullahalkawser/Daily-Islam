import { HapticTab } from '@/components/HapticTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const scaleSize = (size) => size * (WINDOW_WIDTH / 375); // Base width for scaling

export default function TabLayout() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#e0e0e0',
          tabBarButton: HapticTab,
          tabBarBackground: () => (
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { borderRadius: scaleSize(30) }]}
            />
          ),
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? scaleSize(90) : scaleSize(60),
            paddingBottom: Platform.OS === 'ios' ? scaleSize(20) : scaleSize(10),
            marginHorizontal: width * 0.05, // 5% of screen width
            marginBottom: height * 0.015, // 1.5% of screen height
            borderRadius: scaleSize(30),
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: scaleSize(4) },
            shadowOpacity: 0.3,
            shadowRadius: scaleSize(5),
            paddingHorizontal: width * 0.02, // 2% of screen width
          },
          tabBarIconStyle: {
            marginTop: scaleSize(5),
          },
          tabBarLabelStyle: {
            fontSize: scaleSize(12),
            marginBottom: scaleSize(5),
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'হোম',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons 
                name="home-outline" 
                size={scaleSize(28)} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dailyplan"
          options={{
            title: 'দৈনিক পরিকল্পনা',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons 
                name="clipboard-list-outline" 
                size={scaleSize(28)} 
                color={color} 
              />
            ),
          }}
        />
           <Tabs.Screen
          name="amolTracker"
          options={{
            title: 'দৈনিক পরিকল্পনা',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons 
                name="clipboard-list-outline" 
                size={scaleSize(28)} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="aboutapp"
          options={{
            title: 'অ্যাপ সম্পর্কে',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons 
                name="check-circle-outline" 
                size={scaleSize(28)} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
});