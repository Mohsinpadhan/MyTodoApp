import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TaskItem from '../components/TaskItem';

const HomeScreen = ({user}) => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const tasksCollection = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('tasks');

  useEffect(() => {
    const q = tasksCollection.orderBy('createdAt', 'desc');
    const unsubscribe = q.onSnapshot(
      querySnapshot => {
        const list = [];
        querySnapshot.forEach(doc => {
          list.push({id: doc.id, ...doc.data()});
        });
        setTasks(list);
        setLoading(false);
      },
      error => {
        console.log(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch tasks.');
      },
    );

    return () => unsubscribe();
  }, []);
  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await tasksCollection.add({
        title: title.trim(),
        completed: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setTitle('');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not add task');
    }
  };

  const toggleComplete = async (id, currently) => {
    try {
      await tasksCollection.doc(id).update({completed: !currently});
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not update task');
    }
  };

  
  const deleteTask = async id => {
    try {
      await tasksCollection.doc(id).delete();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not delete task');
    }
  };

  
  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      Alert.alert('Error', 'Sign out failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={{color: '#fff',fontWeight:'600'}}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TaskItem
            item={item}
            onToggle={() => toggleComplete(item.id, item.completed)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20,color:'red'}}>
            No tasks yet ?
          </Text>
        }
      />
      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={{color: '#fff', fontWeight:'600'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 16,
    marginTop:60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 16,
  },
  addBtn: {
    backgroundColor: '#1e90ff',
    padding: 12,
    marginLeft: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOut: {
    backgroundColor: '#ff711eff',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
   
  },
  center: {
    flex: 1,
     justifyContent: 'center', 
     alignItems: 'center'
    },
});

export default HomeScreen;
