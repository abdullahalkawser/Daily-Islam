import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1e272e',
  backgroundGradientTo: '#1e272e',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

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
      color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // orange
      strokeWidth: 3,
    },
  ],
};

const pieData = [
  {
    name: 'Completed',
    population: 65,
    color: '#2ECC71',
    legendFontColor: '#2ECC71',
    legendFontSize: 14,
  },
  {
    name: 'Pending',
    population: 35,
    color: '#E74C3C',
    legendFontColor: '#E74C3C',
    legendFontSize: 14,
  },
  {
    name: 'In Progress',
    population: 20,
    color: '#F1C40F',
    legendFontColor: '#F1C40F',
    legendFontSize: 14,
  },
  {
    name: 'On Hold',
    population: 10,
    color: '#8E44AD',
    legendFontColor: '#8E44AD',
    legendFontSize: 14,
  },
  {
    name: 'Cancelled',
    population: 5,
    color: '#3498DB',
    legendFontColor: '#3498DB',
    legendFontSize: 14,
  },
];

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Dashboard Overview</Text>

        <View style={styles.salesGrowth}>
      <Text style={styles.title}>📈 Monthly Sales Overview</Text>
      <Text style={styles.amount}>$12,345</Text>

      <View style={styles.cardsContainer}>
        <View style={[styles.card, { backgroundColor: '#74b9ff' }]}>
          <Text style={styles.cardTitle}>🛒 Orders</Text>
          <Text style={styles.cardValue}>320</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#fd79a8' }]}>
          <Text style={styles.cardTitle}>💰 Revenue</Text>
          <Text style={styles.cardValue}>$9,800</Text>
        </View>
      </View>

      <Text style={styles.chartLabel}>📊 Weekly Sales Trend</Text>
      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              data: [1200, 1800, 1500, 2000, 2200],
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 3,
            },
          ],
        }}
        width={screenWidth - 40}
        height={180}
        chartConfig={{
          backgroundGradientFrom: '#6c5ce7',
          backgroundGradientTo: '#00cec9',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => `#fff`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#fff',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>


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

<View style={styles.container}>
      <Text style={styles.title}>📊 Task Distribution</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
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
    margin: 20,
    padding: 20,
    backgroundColor: '#f5f6fa',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },

   salesGrowth: {
    backgroundColor: '000000',
    padding: 20,
    borderRadius: 20,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  amount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00cec9',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
  },
  cardValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartLabel: {
    fontSize: 16,
    color: '#dfe6e9',
    fontWeight: '500',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
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
  salesGrowth: {
    backgroundColor: '#00b894',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  salesGrowthText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  salesAmount: {
    fontSize: 24,
    color: '#f1c40f',
    fontWeight: 'bold',
  },
});

export default Dashboard;

