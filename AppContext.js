import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const INITIAL_EMPLOYEES = [
  { id: 'EMP001', name: 'Ahmed Khan', department: 'Sales', phone: '0300-1234567', salary: 25000, joinDate: '2024-01-01' },
  { id: 'EMP002', name: 'Sara Ali', department: 'Accounts', phone: '0301-2345678', salary: 22000, joinDate: '2024-02-15' },
  { id: 'EMP003', name: 'Usman Malik', department: 'Warehouse', phone: '0302-3456789', salary: 18000, joinDate: '2024-03-01' },
  { id: 'EMP004', name: 'Fatima Raza', department: 'HR', phone: '0303-4567890', salary: 28000, joinDate: '2023-12-01' },
  { id: 'EMP005', name: 'Bilal Sheikh', department: 'IT', phone: '0304-5678901', salary: 35000, joinDate: '2023-11-01' },
];

const INITIAL_ATTENDANCE = [
  { id: 'ATT001', employeeId: 'EMP001', employeeName: 'Ahmed Khan', date: '2025-06-10', checkIn: '09:00', checkOut: '17:00', status: 'Present', gpsVerified: true, selfieVerified: true, adminRemarks: '', approved: true },
  { id: 'ATT002', employeeId: 'EMP002', employeeName: 'Sara Ali', date: '2025-06-10', checkIn: '09:30', checkOut: '17:00', status: 'Late', gpsVerified: true, selfieVerified: true, adminRemarks: 'Traffic issue', approved: true },
  { id: 'ATT003', employeeId: 'EMP003', employeeName: 'Usman Malik', date: '2025-06-10', checkIn: '', checkOut: '', status: 'Absent', gpsVerified: false, selfieVerified: false, adminRemarks: '', approved: false },
  { id: 'ATT004', employeeId: 'EMP004', employeeName: 'Fatima Raza', date: '2025-06-10', checkIn: '09:00', checkOut: '13:00', status: 'Half Day', gpsVerified: true, selfieVerified: true, adminRemarks: 'Medical appointment', approved: true },
  { id: 'ATT005', employeeId: 'EMP005', employeeName: 'Bilal Sheikh', date: '2025-06-10', checkIn: '09:00', checkOut: '17:30', status: 'Present', gpsVerified: true, selfieVerified: true, adminRemarks: '', approved: true },
  { id: 'ATT006', employeeId: 'EMP001', employeeName: 'Ahmed Khan', date: '2025-06-11', checkIn: '08:55', checkOut: '17:05', status: 'Present', gpsVerified: true, selfieVerified: true, adminRemarks: '', approved: true },
  { id: 'ATT007', employeeId: 'EMP002', employeeName: 'Sara Ali', date: '2025-06-11', checkIn: '09:00', checkOut: '17:00', status: 'Present', gpsVerified: true, selfieVerified: false, adminRemarks: 'Selfie failed, manually verified', approved: false },
  { id: 'ATT008', employeeId: 'EMP003', employeeName: 'Usman Malik', date: '2025-06-11', checkIn: '09:15', checkOut: '17:00', status: 'Present', gpsVerified: true, selfieVerified: true, adminRemarks: '', approved: true },
];

const INITIAL_AUDIT_LOGS = [
  { id: 'LOG001', adminName: 'Admin', timestamp: '2025-06-10 10:30:00', employeeName: 'Sara Ali', originalStatus: 'Present', updatedStatus: 'Late', reason: 'Arrived at 09:30, corrected status' },
  { id: 'LOG002', adminName: 'Admin', timestamp: '2025-06-10 14:00:00', employeeName: 'Fatima Raza', originalStatus: 'Present', updatedStatus: 'Half Day', reason: 'Left early for medical appointment' },
];

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [currentUser] = useState({ id: 'ADMIN001', name: 'Admin', role: 'admin' });

  // Load from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const empData = await AsyncStorage.getItem('employees');
      const attData = await AsyncStorage.getItem('attendance');
      const logData = await AsyncStorage.getItem('auditLogs');
      if (empData) setEmployees(JSON.parse(empData));
      if (attData) setAttendance(JSON.parse(attData));
      if (logData) setAuditLogs(JSON.parse(logData));
    } catch (e) { console.log('Load error', e); }
  };

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) { console.log('Save error', e); }
  };

  // Add Employee
  const addEmployee = (emp) => {
    const newEmp = { ...emp, id: `EMP${String(employees.length + 1).padStart(3, '0')}` };
    const updated = [...employees, newEmp];
    setEmployees(updated);
    saveData('employees', updated);
    return newEmp;
  };

  // Update Employee
  const updateEmployee = (id, data) => {
    const updated = employees.map(e => e.id === id ? { ...e, ...data } : e);
    setEmployees(updated);
    saveData('employees', updated);
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    saveData('employees', updated);
  };

  // Add Attendance
  const addAttendance = (record) => {
    const newRecord = {
      ...record,
      id: `ATT${String(attendance.length + 1).padStart(3, '0')}`,
      approved: false,
    };
    const updated = [...attendance, newRecord];
    setAttendance(updated);
    saveData('attendance', updated);
    return newRecord;
  };

  // Admin: Update Attendance Status
  const updateAttendanceStatus = (attId, newStatus, reason, adminName = 'Admin') => {
    const record = attendance.find(a => a.id === attId);
    if (!record) return;

    const originalStatus = record.status;
    const updated = attendance.map(a =>
      a.id === attId ? { ...a, status: newStatus, adminRemarks: reason, approved: true } : a
    );
    setAttendance(updated);
    saveData('attendance', updated);

    // Create audit log
    const log = {
      id: `LOG${String(auditLogs.length + 1).padStart(3, '0')}`,
      adminName,
      timestamp: new Date().toLocaleString('en-PK'),
      employeeName: record.employeeName,
      employeeId: record.employeeId,
      date: record.date,
      originalStatus,
      updatedStatus: newStatus,
      reason,
    };
    const updatedLogs = [log, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveData('auditLogs', updatedLogs);
  };

  // Admin: Approve / Reject attendance
  const approveAttendance = (attId, approved, adminName = 'Admin') => {
    const record = attendance.find(a => a.id === attId);
    if (!record) return;

    const updated = attendance.map(a =>
      a.id === attId ? { ...a, approved } : a
    );
    setAttendance(updated);
    saveData('attendance', updated);

    const log = {
      id: `LOG${String(auditLogs.length + 1).padStart(3, '0')}`,
      adminName,
      timestamp: new Date().toLocaleString('en-PK'),
      employeeName: record.employeeName,
      employeeId: record.employeeId,
      date: record.date,
      originalStatus: record.status,
      updatedStatus: record.status,
      reason: approved ? 'Attendance Approved by Admin' : 'Attendance Rejected by Admin',
    };
    const updatedLogs = [log, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveData('auditLogs', updatedLogs);
  };

  // Admin: Manually Add Attendance
  const manualAddAttendance = (record, adminName = 'Admin') => {
    const newRecord = {
      ...record,
      id: `ATT${String(attendance.length + 1).padStart(3, '0')}`,
      approved: true,
      gpsVerified: false,
      selfieVerified: false,
      adminRemarks: `Manually added by ${adminName}`,
    };
    const updated = [...attendance, newRecord];
    setAttendance(updated);
    saveData('attendance', updated);

    const log = {
      id: `LOG${String(auditLogs.length + 1).padStart(3, '0')}`,
      adminName,
      timestamp: new Date().toLocaleString('en-PK'),
      employeeName: record.employeeName,
      employeeId: record.employeeId,
      date: record.date,
      originalStatus: 'N/A',
      updatedStatus: record.status,
      reason: 'Manually added by Admin',
    };
    const updatedLogs = [log, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveData('auditLogs', updatedLogs);
  };

  // Delete Attendance
  const deleteAttendance = (id) => {
    const updated = attendance.filter(a => a.id !== id);
    setAttendance(updated);
    saveData('attendance', updated);
  };

  // Get today's stats
  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAtt = attendance.filter(a => a.date === today);
    return {
      total: employees.length,
      present: todayAtt.filter(a => a.status === 'Present').length,
      absent: todayAtt.filter(a => a.status === 'Absent').length,
      late: todayAtt.filter(a => a.status === 'Late').length,
      halfDay: todayAtt.filter(a => a.status === 'Half Day').length,
      onLeave: todayAtt.filter(a => a.status === 'Leave').length,
      percentage: employees.length > 0
        ? Math.round((todayAtt.filter(a => ['Present', 'Late', 'Half Day'].includes(a.status)).length / employees.length) * 100)
        : 0,
    };
  };

  return (
    <AppContext.Provider value={{
      employees, attendance, auditLogs, currentUser,
      addEmployee, updateEmployee, deleteEmployee,
      addAttendance, updateAttendanceStatus, approveAttendance,
      manualAddAttendance, deleteAttendance, getTodayStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
