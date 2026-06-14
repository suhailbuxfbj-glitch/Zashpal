import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

export function EmployeeDashboard() {
  const { employees, attendance } = useApp();
  const emp = employees[0]; // Demo: first employee
  const empAtt = attendance.filter(a => a.employeeId === emp?.id);
  const present = empAtt.filter(a => a.status === 'Present').length;
  const absent = empAtt.filter(a => a.status === 'Absent').length;
  const late = empAtt.filter(a => a.status === 'Late').length;
  const pct = empAtt.length > 0 ? Math.round(((present + late) / empAtt.length) * 100) : 0;

  const handleCheckIn = () => Alert.alert('✅ Check-In', 'In production app:\n• GPS location captured\n• Selfie taken\n• Attendance marked\n• Sent to admin for approval');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{emp?.name?.split(' ').map(n => n[0]).join('') || 'U'}</Text>
        </View>
        <View>
          <Text style={styles.empName}>{emp?.name}</Text>
          <Text style={styles.empId}>{emp?.id} • {emp?.department}</Text>
          <Text style={styles.joinDate}>Joined: {emp?.joinDate}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Present', val: present, color: '#34a853', bg: '#e6f4ea' },
          { label: 'Absent', val: absent, color: '#ea4335', bg: '#fce8e6' },
          { label: 'Late', val: late, color: '#f57c00', bg: '#fef3e2' },
          { label: 'Overall', val: `${pct}%`, color: '#1a73e8', bg: '#e8f0fe' },
        ].map(s => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.checkInBtn} onPress={handleCheckIn}>
        <Ionicons name="finger-print" size={24} color="#fff" />
        <Text style={styles.checkInText}>Mark Attendance (GPS + Selfie)</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Attendance</Text>
      <View style={styles.listCard}>
        {empAtt.slice(-8).reverse().map(att => (
          <View key={att.id} style={styles.attRow}>
            <View>
              <Text style={styles.attDate}>{att.date}</Text>
              <Text style={styles.attTime}>{att.checkIn || '--'} → {att.checkOut || '--'}</Text>
            </View>
            <View style={[styles.statusBadge, {
              backgroundColor: att.status === 'Present' ? '#e6f4ea' : att.status === 'Absent' ? '#fce8e6' : att.status === 'Late' ? '#fef3e2' : '#f3e5f5'
            }]}>
              <Text style={[styles.statusText, {
                color: att.status === 'Present' ? '#34a853' : att.status === 'Absent' ? '#ea4335' : att.status === 'Late' ? '#f57c00' : '#9c27b0'
              }]}>{att.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function AuditLogScreen() {
  const { auditLogs } = useApp();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.auditHeader}>
        <Ionicons name="shield-checkmark" size={20} color="#1a73e8" />
        <Text style={styles.auditTitle}>Complete Audit Log</Text>
        <Text style={styles.auditCount}>{auditLogs.length} entries</Text>
      </View>
      {auditLogs.map(log => (
        <View key={log.id} style={styles.logCard}>
          <View style={styles.logTop}>
            <Text style={styles.logAdmin}>👤 {log.adminName}</Text>
            <Text style={styles.logTime}>{log.timestamp}</Text>
          </View>
          <Text style={styles.logEmp}>Employee: {log.employeeName} ({log.employeeId})</Text>
          <Text style={styles.logDate}>Date: {log.date}</Text>
          <View style={styles.statusChange}>
            <Text style={styles.oldSt}>{log.originalStatus}</Text>
            <Ionicons name="arrow-forward" size={12} color="#888" />
            <Text style={styles.newSt}>{log.updatedStatus}</Text>
          </View>
          <Text style={styles.logReason}>Reason: {log.reason}</Text>
        </View>
      ))}
      {auditLogs.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={48} color="#ccc" />
          <Text style={{ color: '#aaa', marginTop: 10 }}>No audit logs yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a73e8', padding: 20, gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  empName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  empId: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  joinDate: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  statCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: 'bold' },
  statLbl: { fontSize: 10, color: '#666', marginTop: 2 },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#34a853', marginHorizontal: 12, marginBottom: 16, padding: 16, borderRadius: 14, gap: 10 },
  checkInText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginHorizontal: 16, marginBottom: 10 },
  listCard: { marginHorizontal: 12, marginBottom: 24, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1 },
  attRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  attDate: { fontSize: 13, fontWeight: '600', color: '#222' },
  attTime: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  // Audit Log styles
  auditHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  auditTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#222', marginLeft: 8 },
  auditCount: { fontSize: 12, color: '#888' },
  logCard: { marginHorizontal: 12, marginTop: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, elevation: 1, borderLeftWidth: 4, borderLeftColor: '#1a73e8' },
  logTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  logAdmin: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  logTime: { fontSize: 11, color: '#888' },
  logEmp: { fontSize: 12, color: '#555', marginBottom: 2 },
  logDate: { fontSize: 12, color: '#555', marginBottom: 6 },
  statusChange: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  oldSt: { fontSize: 12, color: '#ea4335', fontWeight: '600', backgroundColor: '#fce8e6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  newSt: { fontSize: 12, color: '#34a853', fontWeight: '600', backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  logReason: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  empty: { alignItems: 'center', padding: 40 },
});
