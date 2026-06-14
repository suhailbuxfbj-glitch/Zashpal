import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

export default function EmployeeListScreen() {
  const { employees, attendance, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState({ name: '', department: '', phone: '', salary: '', joinDate: '' });

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditEmp(null); setForm({ name: '', department: '', phone: '', salary: '', joinDate: '' }); setModal(true); };
  const openEdit = (emp) => { setEditEmp(emp); setForm({ name: emp.name, department: emp.department, phone: emp.phone, salary: String(emp.salary), joinDate: emp.joinDate }); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.department) { Alert.alert('Required', 'Name and Department are required'); return; }
    if (editEmp) {
      updateEmployee(editEmp.id, { ...form, salary: Number(form.salary) });
      Alert.alert('✅', 'Employee updated');
    } else {
      addEmployee({ ...form, salary: Number(form.salary) });
      Alert.alert('✅', 'Employee added');
    }
    setModal(false);
  };

  const handleDelete = (emp) => {
    Alert.alert('Delete Employee', `Are you sure you want to delete ${emp.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteEmployee(emp.id); Alert.alert('Deleted', `${emp.name} removed`); } }
    ]);
  };

  const getEmpStats = (empId) => {
    const empAtt = attendance.filter(a => a.employeeId === empId);
    const present = empAtt.filter(a => ['Present', 'Late', 'Half Day'].includes(a.status)).length;
    const total = empAtt.length;
    return { present, total, pct: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  const DEPT_COLORS = { Sales: '#1a73e8', Accounts: '#34a853', Warehouse: '#f57c00', HR: '#9c27b0', IT: '#0097a7' };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput style={styles.searchInput} placeholder="Search employees..." value={search} onChangeText={setSearch} placeholderTextColor="#aaa" />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="person-add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>{filtered.length} of {employees.length} employees</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(emp => {
          const stats = getEmpStats(emp.id);
          const deptColor = DEPT_COLORS[emp.department] || '#888';
          return (
            <View key={emp.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={[styles.avatar, { backgroundColor: deptColor + '22' }]}>
                  <Text style={[styles.avatarText, { color: deptColor }]}>{emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.empName}>{emp.name}</Text>
                  <Text style={styles.empId}>{emp.id}</Text>
                  <View style={[styles.deptBadge, { backgroundColor: deptColor + '18' }]}>
                    <Text style={[styles.deptText, { color: deptColor }]}>{emp.department}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.salaryText}>₨{Number(emp.salary).toLocaleString()}</Text>
                <Text style={styles.attPct}>{stats.pct}% present</Text>
                <Text style={styles.attDays}>{stats.present}/{stats.total} days</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(emp)}>
                  <Ionicons name="create-outline" size={16} color="#1a73e8" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fce8e6' }]} onPress={() => handleDelete(emp)}>
                  <Ionicons name="trash-outline" size={16} color="#ea4335" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editEmp ? 'Edit Employee' : 'Add New Employee'}</Text>
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'e.g. Ahmed Khan' },
              { label: 'Department *', key: 'department', placeholder: 'e.g. Sales' },
              { label: 'Phone Number', key: 'phone', placeholder: '0300-1234567' },
              { label: 'Monthly Salary (₨)', key: 'salary', placeholder: '25000', keyboard: 'numeric' },
              { label: 'Join Date', key: 'joinDate', placeholder: '2025-01-01' },
            ].map(field => (
              <View key={field.key}>
                <Text style={styles.modalLabel}>{field.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChangeText={v => setForm({ ...form, [field.key]: v })}
                  keyboardType={field.keyboard || 'default'}
                  placeholderTextColor="#aaa"
                />
              </View>
            ))}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f5f5f5' }]} onPress={() => setModal(false)}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#1a73e8' }]} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editEmp ? 'Update' : 'Add Employee'}</Text>
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
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', gap: 10 },
  searchRow: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },
  addBtn: { width: 40, height: 40, backgroundColor: '#1a73e8', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  count: { fontSize: 12, color: '#888', paddingHorizontal: 16, paddingVertical: 8 },
  card: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  empName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  empId: { fontSize: 12, color: '#888', marginTop: 2 },
  deptBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  deptText: { fontSize: 11, fontWeight: '600' },
  cardRight: { position: 'absolute', right: 14, top: 14, alignItems: 'flex-end' },
  salaryText: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  attPct: { fontSize: 12, color: '#34a853', marginTop: 2 },
  attDays: { fontSize: 11, color: '#888' },
  cardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#e8f0fe', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 16 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 10 },
  modalInput: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10, padding: 10, fontSize: 14, color: '#222', backgroundColor: '#f9f9f9' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
