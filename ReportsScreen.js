import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../data/AppContext';

export default function ReportsScreen() {
  const { attendance, employees } = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

  const getDailyData = () => attendance.filter(a => a.date === today);
  const getWeeklyData = () => attendance.filter(a => new Date(a.date) >= thisWeekStart);
  const getMonthlyData = () => attendance.filter(a => a.date.startsWith(thisMonth));

  const generateCSV = (data, title) => {
    if (data.length === 0) { Alert.alert('No Data', 'No attendance records for this period'); return; }
    const headers = ['Employee Name', 'Employee ID', 'Date', 'Check-In', 'Check-Out', 'Status', 'GPS Verified', 'Selfie Verified', 'Admin Remarks'];
    const rows = data.map(a => [
      a.employeeName, a.employeeId, a.date,
      a.checkIn || '--', a.checkOut || '--', a.status,
      a.gpsVerified ? 'Yes' : 'No',
      a.selfieVerified ? 'Yes' : 'No',
      a.adminRemarks || ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    Alert.alert(
      '📊 Export Ready',
      `${title}\n\n${data.length} records prepared.\n\nCSV Format:\n${csvContent.substring(0, 200)}...\n\n✅ In production app, this saves to device Downloads folder as .xlsx file.`,
      [{ text: 'OK' }]
    );
  };

  const ReportCard = ({ title, icon, color, bg, count, onExport, data }) => (
    <View style={[styles.reportCard, { borderLeftColor: color }]}>
      <View style={styles.reportTop}>
        <View style={[styles.reportIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportCount}>{count} records</Text>
        </View>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: color }]} onPress={onExport}>
          <Ionicons name="download-outline" size={16} color="#fff" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>
      {/* Summary */}
      <View style={styles.reportStats}>
        {[
          { label: 'Present', val: data.filter(a => a.status === 'Present').length, color: '#34a853' },
          { label: 'Absent', val: data.filter(a => a.status === 'Absent').length, color: '#ea4335' },
          { label: 'Late', val: data.filter(a => a.status === 'Late').length, color: '#f57c00' },
          { label: 'Leave', val: data.filter(a => ['Half Day', 'Leave'].includes(a.status)).length, color: '#9c27b0' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const EmployeeWiseCard = () => (
    <View style={styles.empWiseCard}>
      <View style={styles.ewHeader}>
        <Text style={styles.ewTitle}>Employee-wise Report</Text>
        <TouchableOpacity style={styles.ewExport} onPress={() => generateCSV(attendance, 'All Employee Attendance')}>
          <Ionicons name="download-outline" size={16} color="#fff" />
          <Text style={styles.ewExportText}>Export All</Text>
        </TouchableOpacity>
      </View>
      {employees.map(emp => {
        const empAtt = attendance.filter(a => a.employeeId === emp.id);
        const present = empAtt.filter(a => a.status === 'Present').length;
        const absent = empAtt.filter(a => a.status === 'Absent').length;
        const late = empAtt.filter(a => a.status === 'Late').length;
        const pct = empAtt.length > 0 ? Math.round(((present + late) / empAtt.length) * 100) : 0;
        return (
          <View key={emp.id} style={styles.ewRow}>
            <View style={styles.ewLeft}>
              <Text style={styles.ewName}>{emp.name}</Text>
              <Text style={styles.ewId}>{emp.id} • {emp.department}</Text>
            </View>
            <View style={styles.ewStats}>
              <Text style={styles.ewStat}>✅ {present}</Text>
              <Text style={styles.ewStat}>❌ {absent}</Text>
              <Text style={styles.ewStat}>⏰ {late}</Text>
            </View>
            <View style={[styles.pctBadge, { backgroundColor: pct >= 80 ? '#e6f4ea' : pct >= 60 ? '#fef3e2' : '#fce8e6' }]}>
              <Text style={[styles.pctText, { color: pct >= 80 ? '#34a853' : pct >= 60 ? '#f57c00' : '#ea4335' }]}>{pct}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="bar-chart" size={22} color="#1a73e8" />
        <Text style={styles.headerTitle}>Attendance Reports</Text>
      </View>

      <Text style={styles.sectionTitle}>Export Reports</Text>
      <ReportCard title="Daily Report" icon="today" color="#1a73e8" bg="#e8f0fe" count={getDailyData().length} data={getDailyData()}
        onExport={() => generateCSV(getDailyData(), `Daily Report - ${today}`)} />
      <ReportCard title="Weekly Report" icon="calendar" color="#34a853" bg="#e6f4ea" count={getWeeklyData().length} data={getWeeklyData()}
        onExport={() => generateCSV(getWeeklyData(), 'Weekly Attendance Report')} />
      <ReportCard title="Monthly Report" icon="stats-chart" color="#f57c00" bg="#fef3e2" count={getMonthlyData().length} data={getMonthlyData()}
        onExport={() => generateCSV(getMonthlyData(), `Monthly Report - ${thisMonth}`)} />

      <Text style={styles.sectionTitle}>Employee-wise Reports</Text>
      <EmployeeWiseCard />

      {/* Excel Format Info */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#1a73e8" />
        <Text style={styles.infoText}>
          Export files include: Employee Name, ID, Date, Check-In/Out, Status, GPS Verification, Selfie Verification, Admin Remarks
        </Text>
      </View>

      <View style={styles.cloudCard}>
        <Ionicons name="cloud-upload" size={22} color="#9c27b0" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cloudTitle}>Cloud Backup</Text>
          <Text style={styles.cloudSub}>Attendance data auto-saved to local storage. Cloud sync available with Firebase integration.</Text>
        </View>
        <TouchableOpacity style={styles.syncBtn} onPress={() => Alert.alert('☁️ Cloud Sync', 'In production: connects to Firebase/Google Drive for automatic backup')}>
          <Text style={styles.syncBtnText}>Sync</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginLeft: 8 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginHorizontal: 16, marginTop: 16, marginBottom: 10 },
  reportCard: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 16, elevation: 1, borderWidth: 1, borderColor: '#eee', borderLeftWidth: 4 },
  reportTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reportIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  reportCount: { fontSize: 12, color: '#888', marginTop: 2 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  exportBtnText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  reportStats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold' },
  statLbl: { fontSize: 11, color: '#888', marginTop: 2 },
  empWiseCard: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1, borderWidth: 1, borderColor: '#eee' },
  ewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  ewTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  ewExport: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9c27b0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ewExportText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  ewRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  ewLeft: { flex: 1 },
  ewName: { fontSize: 13, fontWeight: '600', color: '#222' },
  ewId: { fontSize: 11, color: '#888', marginTop: 1 },
  ewStats: { flexDirection: 'row', gap: 8, marginRight: 8 },
  ewStat: { fontSize: 12, color: '#666' },
  pctBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  pctText: { fontSize: 12, fontWeight: 'bold' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 12, marginBottom: 10, backgroundColor: '#e8f0fe', borderRadius: 14, padding: 14 },
  infoText: { flex: 1, fontSize: 12, color: '#444', marginLeft: 8, lineHeight: 18 },
  cloudCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginBottom: 24, backgroundColor: '#f3e5f5', borderRadius: 14, padding: 14 },
  cloudTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  cloudSub: { fontSize: 11, color: '#666', marginTop: 2 },
  syncBtn: { backgroundColor: '#9c27b0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  syncBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
