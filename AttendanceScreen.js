import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

const STATUS_COLORS = {
  'Present': { bg: '#e6f4ea', text: '#34a853' },
  'Absent': { bg: '#fce8e6', text: '#ea4335' },
  'Late': { bg: '#fef3e2', text: '#f57c00' },
  'Half Day': { bg: '#f3e5f5', text: '#9c27b0' },
  'Leave': { bg: '#e0f7fa', text: '#0097a7' },
};

export default function AttendanceScreen({ navigation }) {
  const { attendance, employees, updateAttendanceStatus, approveAttendance, manualAddAttendance } = useApp();
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedAtt, setSelectedAtt] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [newRecord, setNewRecord] = useState({ employeeId: '', date: '', checkIn: '', checkOut: '', status: 'Present' });

  const filtered = attendance.filter(a => {
    const matchSearch = search === '' || a.employeeName.toLowerCase().includes(search.toLowerCase()) || a.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate === '' || a.date.includes(filterDate);
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchDate && matchStatus;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const openEdit = (att) => {
    setSelectedAtt(att);
    setNewStatus(att.status);
    setReason('');
    setEditModal(true);
  };

  const handleUpdate = () => {
    if (!reason.trim()) { Alert.alert('Required', 'Please enter reason for change'); return; }
    updateAttendanceStatus(selectedAtt.id, newStatus, reason);
    setEditModal(false);
    Alert.alert('✅ Updated', 'Attendance status updated and logged.');
  };

  const handleAddManual = () => {
    if (!newRecord.employeeId || !newRecord.date) { Alert.alert('Required', 'Employee and date are required'); return; }
    const emp = employees.find(e => e.id === newRecord.employeeId);
    if (!emp) { Alert.alert('Error', 'Employee not found'); return; }
    manualAddAttendance({ ...newRecord, employeeName: emp.name });
    setAddModal(false);
    setNewRecord({ employeeId: '', date: '', checkIn: '', checkOut: '', status: 'Present' });
    Alert.alert('✅ Added', 'Attendance added manually.');
  };

  return (
    <View style={styles.container}>
      {/* Search & Filter */}
      <View style={styles.searchBox}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput style={styles.searchInput} placeholder="Search by name or ID..." value={search} onChangeText={setSearch} placeholderTextColor="#aaa" />
        </View>
        <View style={styles.searchRow}>
          <Ionicons name="calendar-outline" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput style={styles.searchInput} placeholder="Filter by date (2025-06)..." value={filterDate} onChangeText={setFilterDate} placeholderTextColor="#aaa" />
        </View>
        {/* Status Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {['All', 'Present', 'Absent', 'Late', 'Half Day', 'Leave'].map(s => (
            <TouchableOpacity key={s} onPress={() => setFilterStatus(s)}
              style={[styles.filterChip, filterStatus === s && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, filterStatus === s && styles.filterChipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.countText}>{filtered.length} records</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Manual Add</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(att => (
          <View key={att.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <Text style={styles.empName}>{att.employeeName}</Text>
                <Text style={styles.empId}>{att.employeeId} • {att.date}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[att.status]?.bg || '#eee' }]}>
                <Text style={[styles.badgeText, { color: STATUS_COLORS[att.status]?.text || '#666' }]}>{att.status}</Text>
              </View>
            </View>
            <View style={styles.cardMid}>
              <View style={styles.infoItem}>
                <Ionicons name="log-in-outline" size={14} color="#888" />
                <Text style={styles.infoText}> In: {att.checkIn || '--'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="log-out-outline" size={14} color="#888" />
                <Text style={styles.infoText}> Out: {att.checkOut || '--'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name={att.gpsVerified ? 'location' : 'location-outline'} size={14} color={att.gpsVerified ? '#34a853' : '#ea4335'} />
                <Text style={[styles.infoText, { color: att.gpsVerified ? '#34a853' : '#ea4335' }]}> GPS</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name={att.selfieVerified ? 'camera' : 'camera-outline'} size={14} color={att.selfieVerified ? '#34a853' : '#ea4335'} />
                <Text style={[styles.infoText, { color: att.selfieVerified ? '#34a853' : '#ea4335' }]}> Selfie</Text>
              </View>
            </View>
            {att.adminRemarks ? <Text style={styles.remarks}>📝 {att.adminRemarks}</Text> : null}
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e8f0fe' }]} onPress={() => openEdit(att)}>
                <Ionicons name="create-outline" size={14} color="#1a73e8" />
                <Text style={[styles.actionText, { color: '#1a73e8' }]}> Edit Status</Text>
              </TouchableOpacity>
              {!att.approved ? (
                <>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e6f4ea' }]} onPress={() => { approveAttendance(att.id, true); Alert.alert('✅', 'Approved'); }}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#34a853" />
                    <Text style={[styles.actionText, { color: '#34a853' }]}> Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fce8e6' }]} onPress={() => { approveAttendance(att.id, false); Alert.alert('❌', 'Rejected'); }}>
                    <Ionicons name="close-circle-outline" size={14} color="#ea4335" />
                    <Text style={[styles.actionText, { color: '#ea4335' }]}> Reject</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.approvedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#34a853" />
                  <Text style={{ fontSize: 12, color: '#34a853', marginLeft: 4 }}>Approved</Text>
                </View>
              )}
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No attendance records found</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Attendance Status</Text>
            {selectedAtt && <Text style={styles.modalSub}>{selectedAtt.employeeName} • {selectedAtt.date}</Text>}
            <Text style={styles.modalLabel}>Select New Status:</Text>
            <View style={styles.statusGrid}>
              {['Present', 'Absent', 'Late', 'Half Day', 'Leave'].map(s => (
                <TouchableOpacity key={s} onPress={() => setNewStatus(s)}
                  style={[styles.statusOption, newStatus === s && { backgroundColor: STATUS_COLORS[s]?.bg, borderColor: STATUS_COLORS[s]?.text }]}>
                  <Text style={[styles.statusOptionText, newStatus === s && { color: STATUS_COLORS[s]?.text, fontWeight: 'bold' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalLabel}>Reason for Change: *</Text>
            <TextInput style={styles.modalInput} placeholder="Enter reason..." value={reason} onChangeText={setReason} multiline numberOfLines={3} placeholderTextColor="#aaa" />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f5f5f5' }]} onPress={() => setEditModal(false)}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#1a73e8' }]} onPress={handleUpdate}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Manual Add Modal */}
      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Manually Add Attendance</Text>
            <Text style={styles.modalLabel}>Employee ID:</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. EMP001" value={newRecord.employeeId} onChangeText={v => setNewRecord({ ...newRecord, employeeId: v })} placeholderTextColor="#aaa" />
            <Text style={styles.modalLabel}>Date (YYYY-MM-DD):</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. 2025-06-13" value={newRecord.date} onChangeText={v => setNewRecord({ ...newRecord, date: v })} placeholderTextColor="#aaa" />
            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.modalLabel}>Check-In:</Text>
                <TextInput style={styles.modalInput} placeholder="09:00" value={newRecord.checkIn} onChangeText={v => setNewRecord({ ...newRecord, checkIn: v })} placeholderTextColor="#aaa" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalLabel}>Check-Out:</Text>
                <TextInput style={styles.modalInput} placeholder="17:00" value={newRecord.checkOut} onChangeText={v => setNewRecord({ ...newRecord, checkOut: v })} placeholderTextColor="#aaa" />
              </View>
            </View>
            <Text style={styles.modalLabel}>Status:</Text>
            <View style={styles.statusGrid}>
              {['Present', 'Absent', 'Late', 'Half Day', 'Leave'].map(s => (
                <TouchableOpacity key={s} onPress={() => setNewRecord({ ...newRecord, status: s })}
                  style={[styles.statusOption, newRecord.status === s && { backgroundColor: STATUS_COLORS[s]?.bg, borderColor: STATUS_COLORS[s]?.text }]}>
                  <Text style={[styles.statusOptionText, newRecord.status === s && { color: STATUS_COLORS[s]?.text, fontWeight: 'bold' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f5f5f5' }]} onPress={() => setAddModal(false)}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#34a853' }]} onPress={handleAddManual}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  searchBox: { padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 10, marginBottom: 8, height: 40 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },
  filterRow: { marginTop: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 8 },
  filterChipActive: { backgroundColor: '#1a73e8' },
  filterChipText: { fontSize: 12, color: '#666' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  countText: { fontSize: 13, color: '#888' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a73e8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  card: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardLeft: { flex: 1 },
  empName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  empId: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardMid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 12, color: '#888' },
  remarks: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 8, backgroundColor: '#fffde7', padding: 6, borderRadius: 6 },
  cardActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  actionText: { fontSize: 12 },
  approvedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: '#aaa', marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#888', marginBottom: 16 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 8 },
  modalInput: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10, padding: 10, fontSize: 14, color: '#222', backgroundColor: '#f9f9f9' },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  statusOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#ddd', backgroundColor: '#f9f9f9' },
  statusOptionText: { fontSize: 13, color: '#666' },
  rowInputs: { flexDirection: 'row' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalBtn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
