import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const USERS = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: 'EMP001', username: 'ahmed', password: '1234', role: 'employee', name: 'Ahmed Khan' },
  { id: 'EMP002', username: 'sara', password: '1234', role: 'employee', name: 'Sara Ali' },
  { id: 'EMP003', username: 'usman', password: '1234', role: 'employee', name: 'Usman Malik' },
];

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.\n\nDemo:\nAdmin: admin / admin123\nEmployee: ahmed / 1234');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="business" size={48} color="#fff" />
          </View>
          <Text style={styles.appName}>AttendPro</Text>
          <Text style={styles.subtitle}>Employee Attendance Management</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to continue</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.loginBtn, loading && styles.loginBtnDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginBtnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <Text style={styles.demoText}>👤 Admin: admin / admin123</Text>
            <Text style={styles.demoText}>👥 Employee: ahmed / 1234</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a73e8' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  logoBox: { width: 90, height: 90, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 28, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#888', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#f9f9f9' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: '#222' },
  loginBtn: { backgroundColor: '#1a73e8', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  loginBtnDisabled: { backgroundColor: '#90b8f5' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  demoBox: { marginTop: 20, padding: 14, backgroundColor: '#f0f7ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#1a73e8' },
  demoTitle: { fontSize: 13, fontWeight: 'bold', color: '#1a73e8', marginBottom: 6 },
  demoText: { fontSize: 13, color: '#444', marginBottom: 2 },
});
