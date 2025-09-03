import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const MonthlyTasksPage = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [tasks, setTasks] = useState([]);

  const monthKey = currentMonth.format('YYYY-MM');

  // Load tasks for selected month
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const json = await AsyncStorage.getItem(monthKey);
        if (json) setTasks(JSON.parse(json));
        else setTasks([]);
      } catch (e) {
        console.log('Failed to load tasks', e);
      }
    };
    loadTasks();
  }, [monthKey]);

  const completedPercentage = tasks.length
    ? tasks.filter(t => t.completed).length / tasks.length
    : 0;

  const changeMonth = months => {
    setCurrentMonth(prev => prev.add(months, 'month'));
  };

  return (
    <LinearGradient colors={['#F7971E', '#FFD200']} style={styles.container}>
      <Text style={styles.header}>মাসিক টাস্ক ({monthKey})</Text>

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
          <Text style={styles.navText}>← আগের মাস</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
          <Text style={styles.navText}>পরের মাস →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.taskList}>
        {tasks.length === 0 && (
          <Text style={styles.noTaskText}>এই মাসে কোনো টাস্ক নেই।</Text>
        )}
        {tasks.map(task => (
          <View
            key={task.id}
            style={[styles.taskItem, task.completed && styles.completedTask]}
          >
            <View>
              <Text style={[styles.taskText, task.completed && styles.completedText]}>
                {task.title}
              </Text>
              <Text style={[styles.taskDescription, task.completed && styles.completedText]}>
                {task.description}
              </Text>
            </View>
            {task.completed && <Text style={styles.checkMark}>✓</Text>}
          </View>
        ))}
      </ScrollView>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {Math.round(completedPercentage * 100)}% Completed
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${completedPercentage * 100}%` }]} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: 15 },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 15 },
  navButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 12 },
  navText: { color: '#fff', fontWeight: 'bold' },
  taskList: { paddingHorizontal: 20, paddingBottom: 20 },
  taskItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedTask: { backgroundColor: 'rgba(0,128,0,0.3)' },
  taskText: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  taskDescription: { fontSize: 14, color: '#555' },
  completedText: { textDecorationLine: 'line-through', color: '#444' },
  checkMark: { fontSize: 18, color: '#2E7D32', fontWeight: 'bold' },
  noTaskText: { color: '#fff', textAlign: 'center', marginTop: 50, fontSize: 16 },
  progressContainer: { marginHorizontal: 20, marginTop: 10 },
  progressText: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  progressBarBackground: {
    width: width - 40,
    height: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 15,
  },
});

export default MonthlyTasksPage;
