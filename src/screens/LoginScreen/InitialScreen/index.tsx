import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function InitialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: '#7289DA', padding: 15, margin: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
});
