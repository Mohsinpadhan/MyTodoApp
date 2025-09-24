import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TaskItem = ({item, onToggle, onDelete}) => {
  return (
    <View style={[styles.row, item.completed && styles.completed]}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        <Text>{item.completed ? 'Done' : '⬜'}</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          item.completed && {textDecorationLine: 'line-through', color: '#888'},
        ]}>
        {item.title}
      </Text>

      <TouchableOpacity onPress={onDelete} style={styles.trash}>
        <Text style={{color:'red', fontWeight:'600'}}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  checkbox: {
    marginRight: 12
  },
  title: {
    flex: 1, fontSize: 16
  },
  trash: {
    padding: 6,
    
  },
  completed: {
    backgroundColor: '#08f143ff'},
});

export default TaskItem;
