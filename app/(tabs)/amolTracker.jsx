import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1e272e',
  backgroundGradientTo: '#1e272e',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '5', strokeWidth: '2', stroke: '#ffa726' },
};

const Dashboard = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const json = await AsyncStorage.getItem(today);
      const savedTasks = json ? JSON.parse(json) : null;
      setTasks(savedTasks || []);
    } catch (e) {
      console.log('Failed to load tasks', e);
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [today]);

  // Completed vs Pending count বের করা
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  const pieData = [
    {
      name: 'Completed',
      population: completedCount,
      color: '#2ECC71',
      legendFontColor: '#2ECC71',
      legendFontSize: 14,
    },
    {
      name: 'Pending',
      population: pendingCount,
      color: '#E74C3C',
      legendFontColor: '#E74C3C',
      legendFontSize: 14,
    },
  ];

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [45, 70, 35, 50, 95, 80],
        colors: [
          () => '#00B894',
          () => '#00CEC9',
          () => '#0984E3',
          () => '#6C5CE7',
          () => '#E17055',
          () => '#D63031',
        ],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [6000, 5500, 7000, 6500, 8000, 6600],
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Dashboard Overview</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Bar Chart</Text>
        <BarChart
          data={barData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
          showBarTops
          withCustomBarColorFromData
          flatColor
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Line Chart</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>📊 Task Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={true}
        />
        
      
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e272e',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 200,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00cec9',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#2d3436',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#00cec9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chart: {
    borderRadius: 16,
  },
});

export default Dashboard;
