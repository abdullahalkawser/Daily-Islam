import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const DailyTasksPage = () => {
  const today = dayjs().format('YYYY-MM'); // Current month
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Load tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const json = await AsyncStorage.getItem(today);
        if (json) setTasks(JSON.parse(json));
      } catch (e) {
        console.log('Failed to load tasks', e);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(today, JSON.stringify(tasks));
      } catch (e) {
        console.log('Failed to save tasks', e);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: prev.length + 1, title: newTitle, description: newDescription, completed: false },
    ]);
    setNewTitle('');
    setNewDescription('');
  };

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const completedPercentage = tasks.length
    ? tasks.filter(t => t.completed).length / tasks.length
    : 0;

  return (
    <LinearGradient colors={['#A8E063', '#56AB2F']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      <Text style={styles.header}>মাসিক টাস্ক ({today})</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="নতুন টাস্ক"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="বিস্তারিত বিবরণ"
          value={newDescription}
          onChangeText={setNewDescription}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.taskList}>
        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, task.completed && styles.completedTask]}
            onPress={() => toggleTask(task.id)}
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
          </TouchableOpacity>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
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

export default DailyTasksPage;
