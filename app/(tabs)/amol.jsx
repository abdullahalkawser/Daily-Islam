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
  RefreshControl,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const colors = [
  '#2ECC71', '#3498DB', '#9B59B6', '#F39C12',
  '#E74C3C', '#1ABC9C', '#E67E22', '#8E44AD',
  '#16A085', '#D35400', '#C0392B', '#2980B9'
];

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
      setTasks(savedTasks && savedTasks.length > 0 ? savedTasks : defaultAmals);
    } catch (e) {
      console.log('Failed to load tasks', e);
      setTasks(defaultAmals);
    }
  };

  useEffect(() => { loadTasks(); }, [today]);
  useFocusEffect(useCallback(() => { loadTasks(); }, [today]));

  useEffect(() => {
    const saveTasks = async () => {
      try { await AsyncStorage.setItem(today, JSON.stringify(tasks)); }
      catch (e) { console.log('Failed to save tasks', e); }
    };
    saveTasks();
  }, [tasks, today]);

  const showToast = (message, type = 'success') => { Toast.show({ type, text1: message, visibilityTime: 2000, topOffset: 30 }); };

  const addTask = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast('অনুগ্রহ করে টাস্কের শিরোনাম এবং বিবরণ উভয়ই দিন।', 'error');
      return;
    }
    setTasks(prev => [...prev, { id: Date.now(), title: newTitle, description: newDescription, completed: false }]);
    setNewTitle('');
    setNewDescription('');
    setShowInputFields(false);
    showToast('নতুন আমল সফলভাবে যুক্ত হয়েছে।');
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
    setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, title: newTitle, description: newDescription } : t));
    setIsEditing(false);
    setCurrentTask(null);
    setNewTitle('');
    setNewDescription('');
    setShowInputFields(false);
    showToast('আমল সফলভাবে হালনাগাদ করা হয়েছে।');
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
      const updatedTasks = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const task = updatedTasks.find(t => t.id === id);
      showToast(task.completed ? 'আলহামদুলিল্লাহ! আমলটি সম্পন্ন হয়েছে।' : 'আমল সম্পন্ন করা হয়নি।', task.completed ? 'success' : 'info');
      return updatedTasks;
    });
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('আমল সফলভাবে মুছে ফেলা হয়েছে।');
  };

  const completedTasks = tasks.filter(t => t.completed);
  const pieData = completedTasks.length > 0
    ? completedTasks.map((t, i) => ({
        name: t.title,
        population: 1,
        color: colors[i % colors.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      }))
    : [{ name: 'কোনো সম্পন্ন আমল নেই', population: 1, color: '#E0E0E0', legendFontColor: '#333', legendFontSize: 12 }];

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <Toast />

      {/* Header */}
      <LinearGradient colors={['#4a90e2', '#7cb9e8']} style={styles.headerSection}>
        <Text style={styles.header}>দৈনিক আমলনামা ({dayjs().format('DD-MM-YYYY')})</Text>
        {showInputFields ? (
          <View style={styles.inputContainer}>
            <View style={styles.textInputWrapper}>
              <Icon name="format-title" size={20} color="#666" style={styles.icon} />
              <TextInput style={styles.input} placeholder="নতুন আমল যোগ করুন" placeholderTextColor="#999" value={newTitle} onChangeText={setNewTitle} />
            </View>
            <View style={styles.textInputWrapper}>
              <Icon name="note-text-outline" size={20} color="#666" style={styles.icon} />
              <TextInput style={styles.input} placeholder="বিস্তারিত বিবরণ" placeholderTextColor="#999" value={newDescription} onChangeText={setNewDescription} multiline />
            </View>
            <View style={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <TouchableOpacity style={styles.updateButton} onPress={saveEdit}><Text style={styles.addButtonText}>হালনাগাদ করুন</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}><Text style={styles.addButtonText}>বাতিল</Text></TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.addButton} onPress={addTask}><Text style={styles.addButtonText}>যোগ করুন</Text></TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.showAddButton} onPress={() => setShowInputFields(true)}>
            <Icon name="plus-circle" size={24} color="#fff" />
            <Text style={styles.showAddButtonText}>নতুন আমল যোগ করুন</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Tasks Section (Card with Circle and Text) */}
      <View style={styles.tasksContainer}> {/* New container to hold all task cards */}
        <Text style={styles.sectionTitle}>সকল আমল সম্পন্ন করুন</Text>
        {tasks.length > 0 ? tasks.map((task, i) => (
          <LinearGradient key={task.id} colors={task.completed ? ['#d4edda', '#c3e6cb'] : ['#e9e9e9', '#ffffff']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.taskCard}>
            <TouchableOpacity style={styles.taskDetails} onPress={() => toggleTask(task.id)}>
              <View style={[styles.taskStatusIndicator, { backgroundColor: task.completed ? '#28a745' : '#ccc' }]}>
                {task.completed && <Icon name="check" size={20} color="#fff" />}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.taskTitle, task.completed && styles.completedText]}>{task.title}</Text>
                <Text style={[styles.taskDescription, task.completed && styles.completedText]}>{task.description}</Text>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => startEdit(task)}><Icon name="pencil-outline" size={24} color="#555" /></TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)}><Icon name="delete-outline" size={24} color="#dc3545" /></TouchableOpacity>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )) : <Text style={styles.noTasksText}>আজকের জন্য কোনো আমল নেই। একটি নতুন আমল যোগ করুন।</Text>}
      </View>

      {/* Pie Chart Card (Separate Card) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 সম্পন্ন হওয়া আমল</Text>
        {pieData[0].name === 'কোনো সম্পন্ন আমল নেই' ? (
          <Text style={styles.noChartText}>কোনো সম্পন্ন আমল নেই।</Text>
        ) : (
          <>
            <PieChart
              data={pieData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="50"
              hasLegend={false}
            />
            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DailyTasksPage;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f0f4f7', paddingBottom: 200},
  headerSection: { paddingTop: screenHeight * 0.06, paddingHorizontal: screenWidth * 0.05, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center', marginBottom: 20 },
  header: { fontSize: screenWidth * 0.07, fontWeight: 'bold', color: '#fff', marginBottom: screenHeight * 0.02 },
  inputContainer: { width: '100%', alignItems: 'center' },
  textInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 25, paddingHorizontal: 15, marginBottom: 10, width: '100%' },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: screenHeight * 0.015, fontSize: screenWidth * 0.04, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  addButton: { flex: 1, backgroundColor: '#4CAF50', paddingVertical: screenHeight * 0.015, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  updateButton: { flex: 1, backgroundColor: '#FFC107', paddingVertical: screenHeight * 0.015, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  cancelButton: { flex: 1, backgroundColor: '#9e9e9e', paddingVertical: screenHeight * 0.015, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: screenWidth * 0.04, fontWeight: 'bold' },
  showAddButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingVertical: screenHeight * 0.015, paddingHorizontal: screenWidth * 0.05, borderRadius: 25, elevation: 5 },
  showAddButtonText: { color: '#fff', fontSize: screenWidth * 0.04, fontWeight: 'bold', marginLeft: 10 },

  tasksContainer: { // New container for task cards
    paddingHorizontal: screenWidth * 0.05,
    marginBottom: 20, // Space between task cards and chart card
  },
  sectionTitle: { fontSize: screenWidth * 0.055, fontWeight: 'bold', color: '#333', marginBottom: screenHeight * 0.02 },
  taskCard: {
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#FFFFFF', // White background for task cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  taskDetails: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskStatusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  textContainer: { flex: 1, flexWrap: 'wrap' },
  taskTitle: { fontSize: screenWidth * 0.045, fontWeight: '600', color: '#333', marginBottom: 2 },
  taskDescription: { fontSize: screenWidth * 0.035, color: '#666' },
  completedText: { textDecorationLine: 'line-through', color: '#888' },
  taskActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  editButton: { padding: 5, marginRight: 10 },
  deleteButton: { padding: 5 },
  noTasksText: { textAlign: 'center', marginTop: screenHeight * 0.05, fontSize: screenWidth * 0.04, color: '#888' },

  chartCard: {
    marginTop: screenHeight * 0.02,
    marginHorizontal: screenWidth * 0.05,
    padding: 20,
    backgroundColor: '#E0F2F7', // Light blue background for chart card
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  chartTitle: { fontSize: screenWidth * 0.045, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  noChartText: { color: '#666', textAlign: 'center' },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginRight: 15 },
  legendColorBox: { width: 15, height: 15, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: screenWidth * 0.035, color: '#333' },
});