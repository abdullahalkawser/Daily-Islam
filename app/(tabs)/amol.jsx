import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DailyTasksPage = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const defaultAmals = [
    { id: 1, title: '৫ ওয়াক্ত নামাজ', description: 'নিয়মিত ৫ ওয়াক্ত নামাজ আদায় করা', completed: false },
    { id: 2, title: 'তাহাজ্জুদ', description: 'শেষ রাতে তাহাজ্জুদ নামাজ পড়া', completed: false },
    { id: 3, title: '১০ আয়াত কুরআন', description: 'প্রতিদিন অন্তত ১০ আয়াত কুরআন তেলাওয়াত করা', completed: false },
    { id: 4, title: 'সকাল সন্ধ্যার দোয়া', description: 'সকালে ও সন্ধ্যায় মাসনুন দোয়া পাঠ করা', completed: false },
    { id: 5, title: 'তাসবিহ', description: 'জিকির ও তাসবিহ পাঠ করা', completed: false },
  ];

  const loadTasks = async () => {
    try {
      const json = await AsyncStorage.getItem(today);
      const savedTasks = json ? JSON.parse(json) : null;
      if (savedTasks && savedTasks.length > 0) {
        setTasks(savedTasks);
      } else {
        setTasks(defaultAmals);
      }
    } catch (e) {
      console.log('Failed to load tasks', e);
      setTasks(defaultAmals);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [today]);

  useFocusEffect(
    useCallback(() => {
      // Screen focus এ ডাটা লোড হবে
      loadTasks();
    }, [today])
  );

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(today, JSON.stringify(tasks));
      } catch (e) {
        console.log('Failed to save tasks', e);
      }
    };
    saveTasks();
  }, [tasks, today]);

  const showToast = (message, type = 'success') => {
    Toast.show({
      type: type,
      text1: message,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
    });
  };

  const addTask = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast('অনুগ্রহ করে টাস্কের শিরোনাম এবং বিবরণ উভয়ই দিন।', 'error');
      return;
    }
    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setNewDescription('');
    setShowInputFields(false);
    showToast('নতুন আমল সফলভাবে যুক্ত হয়েছে।', 'success');
  };

  const startEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setShowInputFields(true);
  };

  const saveEdit = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast('অনুগ্রহ করে টাস্কের শিরোনাম এবং বিবরণ উভয়ই দিন।', 'error');
      return;
    }
    setTasks(prev =>
      prev.map(task =>
        task.id === currentTask.id ? { ...task, title: newTitle, description: newDescription } : task
      )
    );
    setIsEditing(false);
    setCurrentTask(null);
    setNewTitle('');
    setNewDescription('');
    setShowInputFields(false);
    showToast('আমল সফলভাবে হালনাগাদ করা হয়েছে।', 'success');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentTask(null);
    setNewTitle('');
    setNewDescription('');
    setShowInputFields(false);
  };

  const toggleTask = id => {
    setTasks(prev => {
      const updatedTasks = prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      const task = updatedTasks.find(t => t.id === id);
      if (task.completed) {
        showToast('আলহামদুলিল্লাহ! আমলটি সম্পন্ন হয়েছে।', 'success');
      } else {
        showToast('আমল সম্পন্ন করা হয়নি।', 'info');
      }
      return updatedTasks;
    });
  };

  const deleteTask = id => {
    Alert.alert(
      'আমল মুছুন',
      'আপনি কি নিশ্চিত যে আপনি এই আমলটি মুছে ফেলতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'মুছে ফেলুন',
          onPress: () => {
            setTasks(prev => prev.filter(task => task.id !== id));
            showToast('আমল সফলভাবে মুছে ফেলা হয়েছে।', 'success');
          },
        },
      ]
    );
  };

  const completedPercentage = tasks.length
    ? tasks.filter(t => t.completed).length / tasks.length
    : 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <Toast />

      {/* Header and Add/Edit Task Section */}
      <LinearGradient
        colors={['#4a90e2', '#7cb9e8']}
        style={styles.headerSection}
      >
        <Text style={styles.header}>দৈনিক আমলনামা ({today})</Text>
        {showInputFields ? (
          <View style={styles.inputContainer}>
            <View style={styles.textInputWrapper}>
              <Icon name="format-title" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="নতুন আমল যোগ করুন"
                placeholderTextColor="#999"
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>
            <View style={styles.textInputWrapper}>
              <Icon name="note-text-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="বিস্তারিত বিবরণ"
                placeholderTextColor="#999"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
              />
            </View>
            <View style={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <TouchableOpacity style={styles.updateButton} onPress={saveEdit}>
                    <Text style={styles.addButtonText}>হালনাগাদ করুন</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                    <Text style={styles.addButtonText}>বাতিল</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.addButton} onPress={addTask}>
                  <Text style={styles.addButtonText}>যোগ করুন</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.showAddButton} 
            onPress={() => setShowInputFields(true)}
          >
            <Icon name="plus-circle" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.showAddButtonText}>নতুন আমল যোগ করুন</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* All Tasks Section */}
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>সকল আমল সম্পন্ন করুন</Text>
        <View style={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <LinearGradient
                key={task.id}
                colors={task.completed ? ['#d3f8d3', '#e6ffe6'] : ['#f0f0f0', '#f9f9f9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.taskCard}
              >
                <TouchableOpacity
                  style={styles.taskDetails}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={styles.checkbox}>
                    {task.completed && <Icon name="check" size={20} color="#4CAF50" />}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskDescription, task.completed && styles.completedText]}>
                      {task.description}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEdit(task)}
                  >
                    <Icon name="pencil-outline" size={24} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Icon name="delete-outline" size={24} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ))
          ) : (
            <Text style={styles.noTasksText}>আজকের জন্য কোনো আমল নেই। একটি নতুন আমল যোগ করুন।</Text>
          )}
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {Math.round(completedPercentage * 100)}% সম্পন্ন
          </Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${completedPercentage * 100}%` }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DailyTasksPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Changed to flexGrow to allow content to grow
    backgroundColor: '#eef2f5',
  },
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: '100%',
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9e9e9e',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  showAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 5,
  },
  showAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskList: {
    paddingBottom: 20,
  },
  taskCard: {
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
});

