import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert('Error', 'Enter email & password');
    setLoading(true);
    try {
      const currentUser = auth().currentUser;

      if (currentUser && currentUser.isAnonymous) {
        const credential = auth.EmailAuthProvider.credential(email, password);
        await currentUser.linkWithCredential(credential);
        Alert.alert('Success', 'Anonymous account linked with email & password!');
      } else {
      
        await auth().createUserWithEmailAndPassword(email, password);
        Alert.alert('Success', 'Account created and signed in.');
      }
    } catch (err) {
      console.log(err.code, err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Enter email & password');
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Signed in.');
    } catch (err) {
      console.log(err.code, err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-<Text style={{color:'#f80808ff'}}>Do App</Text> </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#6c63ff'}]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     padding: 20, 
     justifyContent: 'center'
    },
  title: {
    fontSize: 20,
     fontWeight: 'bold',
      marginBottom: 20,
       textAlign: 'center'
      },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    backgroundColor: '#ff711eff',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
    fontWeight:'800'
  },
  btnText: {
    color: '#fff', 
    fontWeight: '600'
  },
  
});

export default AuthScreen;
