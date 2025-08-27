import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';

const DailyTasksPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'সকাল ধিকর', description: 'সকাল ৫ টার আগে', completed: false },
    { id: 2, title: 'কোরআন পাঠ', description: 'দিনে ২০ পাতা', completed: false },
    { id: 3, title: 'তসবীহ', description: 'Subhanallah 33 বার', completed: false },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const progressAnim = useRef(new Animated.Value(0)).current;

  const addTask = () => {
    if (newTitle.trim() === '' || newDescription.trim() === '') return;

    setTasks(prev => [
      ...prev,
      { id: prev.length + 1, title: newTitle, description: newDescription, completed: false },
    ]);
    setNewTitle('');
    setNewDescription('');
  };

  const toggleTask = taskId => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedPercentage = tasks.length
    ? tasks.filter(t => t.completed).length / tasks.length
    : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: completedPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [completedPercentage]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily Tasks</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="টাস্ক শিরোনাম"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={[styles.input, { flex: 3 }]}
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
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  taskList: { paddingHorizontal: 20, paddingBottom: 20 },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  completedTask: { backgroundColor: '#C8E6C9' },
  taskText: { fontSize: 16, color: '#333' },
  taskDescription: { fontSize: 14, color: '#666' },
  completedText: { textDecorationLine: 'line-through', color: '#555' },
  checkMark: { fontSize: 16, color: '#2E7D32', fontWeight: 'bold' },
  progressContainer: { paddingHorizontal: 20, paddingVertical: 10 },
  progressText: { marginBottom: 5, fontSize: 14, fontWeight: 'bold', color: '#2E7D32' },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 6,
  },
});

export default DailyTasksPage;
