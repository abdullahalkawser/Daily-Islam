import { HapticTab } from '@/components/HapticTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TabLayout() {
  const TAB_HEIGHT = SCREEN_HEIGHT * 0.1;
  const ICON_SIZE = SCREEN_WIDTH * 0.07;
  const LABEL_FONT = SCREEN_WIDTH * 0.035;
  const LABEL_MARGIN_TOP = SCREEN_HEIGHT * 0.005;

  const getTabOptions = (iconName, label) => ({
    tabBarButton: HapticTab,
    tabBarStyle: {
      position: 'absolute',
      backgroundColor: '#fff',
      borderTopWidth: 0,
      elevation: 5,
      height: TAB_HEIGHT,
      paddingBottom: TAB_HEIGHT * 0.15,
    },
    tabBarIcon: ({ focused }) => (
      <MaterialCommunityIcons
        name={iconName}
        size={ICON_SIZE}
        color={focused ? '#10B981' : '#999'}
      />
    ),
    tabBarLabel: ({ focused }) => (
      <Text
        style={{
          fontSize: LABEL_FONT,
          color: focused ? '#10B981' : '#666',
          fontWeight: focused ? '700' : '500',
          marginTop: LABEL_MARGIN_TOP,
        }}
      >
        {label}
      </Text>
    ),
    headerShown: false,
  });

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={getTabOptions('home', 'হোম')}
      />
      <Tabs.Screen
        name="amol"
        options={getTabOptions('calendar-today', 'দৈনিক')}
      />
      <Tabs.Screen
        name="amolTracker"
        options={getTabOptions('chart-line', 'আমোল')}
      />
      <Tabs.Screen
        name="aboutapp"
        options={getTabOptions('information', 'অ্যাপ সম্পর্কে')}
      />
    </Tabs>
  );
}
