import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    // Trigger password reset logic here
    Alert.alert('Success', 'Password reset instructions sent to your email');
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />
      <Button title="Reset Password" onPress={handlePasswordReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5, borderColor: '#ccc' },
});
