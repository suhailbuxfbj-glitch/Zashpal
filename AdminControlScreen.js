import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

export default function AdminControlScreen({ navigation }) {
  const { attendance, approveAttendance, updateAttendanceStatus, auditLogs } = useApp();
  const [tab, setTab] = useState('pending');

  const pending = attendance.filter(a => !a.approved);
  const recent = attendance.filter(a => a.approved).slice(-10).reverse();

  const STATUS_COLORS = {
    'Present': { bg: '#e6f4ea', text: '#34a853' },
    'Absent': { bg: '#fce8e6', text: '#ea4335' },
    'Late': { bg: '#fef3e2', text: '#f57c00' },
    'Half Day': { bg: '#f3e5f5', text: '#9c27b0' },
    'Leave': { bg: '#e0f7fa', text: '#0097a7' },
  };

  const PendingCard = ({ att }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.empName}>{att.employeeName}</Text>
          <Text style={styles.empMeta}>{att.employeeId} • {att.date}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[att.status]?.bg }]}>
          <Text style={[styles.badgeText, { color: STATUS_COLORS[att.status]?.text }]}>{att.status}</Text>
        </View>
      </View>

      <View style={styles.verifyRow}>
        <View style={[styles.verifyItem, { backgroundColor: att.gpsVerified ? '#e6f4ea' : '#fce8e6' }]}>
          <Ionicons name={att.gpsVerified ? 'location' : 'location-outline'} size={14} color={att.gpsVerified ? '#34a853' : '#ea4335'} />
          <Text style={[styles.verifyText, { color: att.gpsVerified ? '#34a853' : '#ea4335' }]}>
            GPS {att.gpsVerified ? 'Verified ✓' : 'Not Verified ✗'}
          </Text>
        </View>
        <View style={[styles.verifyItem, { backgroundColor: att.selfieVerified ? '#e6f4ea' : '#fce8e6' }]}>
          <Ionicons name={att.selfieVerified ? 'camera' : 'camera-outline'} size={14} color={att.selfieVerified ? '#34a853' : '#ea4335'} />
          <Text style={[styles.verifyText, { color: att.selfieVerified ? '#34a853' : '#ea4335' }]}>
            Selfie {att.selfieVerified ? 'Verified ✓' : 'Not Verified ✗'}
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>🕐 Check-In: {att.checkIn || '--'}</Text>
        <Text style={styles.timeText}>🕔 Check-Out: {att.checkOut || '--'}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.approveBtn} onPress={() => { approveAttendance(att.id, true); Alert.alert('✅ Approved', `${att.employeeName}'s attendance approved`); }}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => { approveAttendance(att.id, false); Alert.alert('❌ Rejected', `${att.employeeName}'s attendance rejected`); }}>
          <Ionicons name="close-circle" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Attendance')}>
          <Ionicons name="create" size={16} color="#1a73e8" />
          <Text style={[styles.actionBtnText, { color: '#1a73e8' }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'pending' && styles.tabActive]} onPress={() => setTab('pending')}>
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>
            Pending {pending.length > 0 && `(${pending.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'approved' && styles.tabActive]} onPress={() => setTab('approved')}>
          <Text style={[styles.tabText, tab === 'approved' && styles.tabTextActive]}>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'logs' && styles.tabActive]} onPress={() => setTab('logs')}>
          <Text style={[styles.tabText, tab === 'logs' && styles.tabTextActive]}>Audit Log</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'pending' && (
          <>
            {pending.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle" size={56} color="#34a853" />
                <Text style={styles.emptyTitle}>All Caught Up!</Text>
                <Text style={styles.emptyText}>No pending attendance approvals</Text>
              </View>
            ) : (
              pending.map(att => <PendingCard key={att.id} att={att} />)
            )}
          </>
        )}

        {tab === 'approved' && (
          <>
            <Text style={styles.listHeader}>{recent.length} recently approved records</Text>
            {recent.map(att => (
              <View key={att.id} style={styles.approvedCard}>
                <View style={styles.acLeft}>
                  <Ionicons name="checkmark-circle" size={18} color="#34a853" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.acName}>{att.employeeName}</Text>
                    <Text style={styles.acDate}>{att.date}</Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[att.status]?.bg }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[att.status]?.text }]}>{att.status}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {tab === 'logs' && (
          <>
            <View style={styles.logHeader}>
              <Ionicons name="shield-checkmark" size={18} color="#1a73e8" />
              <Text style={styles.logHeaderTitle}>Admin Audit Log</Text>
              <Text style={styles.logCount}>{auditLogs.length} entries</Text>
            </View>
            {auditLogs.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No audit logs yet</Text>
              </View>
            ) : (
              auditLogs.map(log => (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logTop}>
                    <View style={styles.logIcon}>
                      <Ionicons name="person-circle" size={16} color="#1a73e8" />
                    </View>
                    <View style={styles.logInfo}>
                      <Text style={styles.logAdmin}>{log.adminName}</Text>
                      <Text style={styles.logTime}>{log.timestamp}</Text>
                    </View>
                    <Text style={styles.logId}>{log.id}</Text>
                  </View>
                  <View style={styles.logBody}>
                    <Text style={styles.logEmp}>👤 {log.employeeName} • {log.date}</Text>
                    <View style={styles.statusChange}>
                      <Text style={styles.oldStatus}>{log.originalStatus}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#888" />
                      <Text style={styles.newStatus}>{log.updatedStatus}</Text>
                    </View>
                    <Text style={styles.logReason}>📝 {log.reason}</Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#1a73e8' },
  tabText: { fontSize: 13, color: '#888', fontWeight: '500' },
  tabTextActive: { color: '#1a73e8', fontWeight: 'bold' },
  card: { marginHorizontal: 12, marginTop: 10, backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardLeft: { flex: 1 },
  empName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  empMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  verifyRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  verifyItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flex: 1 },
  verifyText: { fontSize: 11, marginLeft: 4, fontWeight: '500' },
  timeRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  timeText: { fontSize: 12, color: '#555' },
  actionRow: { flexDirection: 'row', gap: 8 },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#34a853', paddingVertical: 10, borderRadius: 10, gap: 4 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ea4335', paddingVertical: 10, borderRadius: 10, gap: 4 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f0fe', paddingVertical: 10, borderRadius: 10, gap: 4 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 50 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#34a853', marginTop: 12 },
  emptyText: { fontSize: 13, color: '#aaa', marginTop: 6 },
  listHeader: { fontSize: 12, color: '#888', paddingHorizontal: 16, paddingVertical: 10 },
  approvedCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12, marginBottom: 8, backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  acLeft: { flexDirection: 'row', alignItems: 'center' },
  acName: { fontSize: 14, fontWeight: '600', color: '#222' },
  acDate: { fontSize: 12, color: '#888', marginTop: 1 },
  logHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#e8f0fe', margin: 12, borderRadius: 12 },
  logHeaderTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a73e8', flex: 1, marginLeft: 8 },
  logCount: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },
  logCard: { marginHorizontal: 12, marginBottom: 8, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 1, borderWidth: 1, borderColor: '#eee', borderLeftWidth: 4, borderLeftColor: '#1a73e8' },
  logTop: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f8f9ff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  logIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#e8f0fe', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  logInfo: { flex: 1 },
  logAdmin: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  logTime: { fontSize: 11, color: '#888' },
  logId: { fontSize: 11, color: '#aaa' },
  logBody: { padding: 10 },
  logEmp: { fontSize: 13, color: '#444', marginBottom: 6 },
  statusChange: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  oldStatus: { fontSize: 12, color: '#ea4335', fontWeight: '600', backgroundColor: '#fce8e6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  newStatus: { fontSize: 12, color: '#34a853', fontWeight: '600', backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  logReason: { fontSize: 12, color: '#666', fontStyle: 'italic' },
});
