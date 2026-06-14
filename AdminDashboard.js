import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

export default function AdminDashboard({ navigation }) {
  const { getTodayStats, attendance, employees } = useApp();
  const stats = getTodayStats();
  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const pending = attendance.filter(a => !a.approved).length;

  const StatCard = ({ icon, label, value, color, bg }) => (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickAction = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.quickBtn} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning! 👋</Text>
          <Text style={styles.dateText}>{today}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Controls')}>
          <Ionicons name="notifications-outline" size={24} color="#1a73e8" />
          {pending > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{pending}</Text></View>}
        </TouchableOpacity>
      </View>

      {/* Attendance % Ring */}
      <View style={styles.percentCard}>
        <View style={styles.percentCircle}>
          <Text style={styles.percentNum}>{stats.percentage}%</Text>
          <Text style={styles.percentSub}>Attendance</Text>
        </View>
        <View style={styles.percentInfo}>
          <Text style={styles.percentTitle}>Today's Overview</Text>
          <Text style={styles.percentDetail}>📅 {new Date().toLocaleDateString('en-PK')}</Text>
          <Text style={styles.percentDetail}>👥 Total: {stats.total} employees</Text>
          {pending > 0 && (
            <View style={styles.pendingAlert}>
              <Ionicons name="alert-circle" size={14} color="#f57c00" />
              <Text style={styles.pendingText}> {pending} pending approvals</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>Today's Statistics</Text>
      <View style={styles.statsGrid}>
        <StatCard icon="people" label="Total" value={stats.total} color="#1a73e8" bg="#e8f0fe" />
        <StatCard icon="checkmark-circle" label="Present" value={stats.present} color="#34a853" bg="#e6f4ea" />
        <StatCard icon="close-circle" label="Absent" value={stats.absent} color="#ea4335" bg="#fce8e6" />
        <StatCard icon="time" label="Late" value={stats.late} color="#f57c00" bg="#fef3e2" />
        <StatCard icon="partly-sunny" label="Half Day" value={stats.halfDay} color="#9c27b0" bg="#f3e5f5" />
        <StatCard icon="calendar" label="On Leave" value={stats.onLeave} color="#0097a7" bg="#e0f7fa" />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        <QuickAction icon="person-add" label="Add Employee" color="#1a73e8" onPress={() => navigation.navigate('Employees')} />
        <QuickAction icon="calendar" label="Mark Attendance" color="#34a853" onPress={() => navigation.navigate('Attendance')} />
        <QuickAction icon="document-text" label="Export Report" color="#f57c00" onPress={() => navigation.navigate('Reports')} />
        <QuickAction icon="shield-checkmark" label="Approve / Reject" color="#9c27b0" onPress={() => navigation.navigate('Controls')} />
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Attendance</Text>
      <View style={styles.recentCard}>
        {attendance.slice(-5).reverse().map(att => (
          <View key={att.id} style={styles.recentRow}>
            <View style={styles.recentLeft}>
              <View style={[styles.recentDot, { backgroundColor: att.status === 'Present' ? '#34a853' : att.status === 'Absent' ? '#ea4335' : att.status === 'Late' ? '#f57c00' : '#9c27b0' }]} />
              <View>
                <Text style={styles.recentName}>{att.employeeName}</Text>
                <Text style={styles.recentDate}>{att.date} • {att.checkIn || '--'}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: att.status === 'Present' ? '#e6f4ea' : att.status === 'Absent' ? '#fce8e6' : att.status === 'Late' ? '#fef3e2' : '#f3e5f5' }]}>
              <Text style={[styles.statusText, { color: att.status === 'Present' ? '#34a853' : att.status === 'Absent' ? '#ea4335' : att.status === 'Late' ? '#f57c00' : '#9c27b0' }]}>
                {att.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  dateText: { fontSize: 12, color: '#888', marginTop: 2 },
  notifBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#ea4335', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  percentCard: { margin: 16, padding: 20, backgroundColor: '#1a73e8', borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  percentCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginRight: 16 },
  percentNum: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  percentSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
  percentInfo: { flex: 1 },
  percentTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  percentDetail: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
  pendingAlert: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 8 },
  pendingText: { fontSize: 12, color: '#ffe082', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginHorizontal: 16, marginTop: 8, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  statCard: { width: '30%', borderRadius: 14, padding: 12, alignItems: 'center', marginHorizontal: 4, marginBottom: 4, elevation: 1 },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#555', marginTop: 2, textAlign: 'center' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  quickBtn: { width: '46%', backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', marginHorizontal: 4, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  quickIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: '#444', textAlign: 'center' },
  recentCard: { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 1, borderWidth: 1, borderColor: '#eee' },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  recentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  recentDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  recentName: { fontSize: 14, fontWeight: '600', color: '#222' },
  recentDate: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
});
