# AttendPro - Employee Attendance Management App

## Features
- ✅ Admin Dashboard with live stats
- ✅ Employee check-in/check-out (GPS + Selfie)
- ✅ Admin: Approve / Reject attendance
- ✅ Admin: Change attendance status (Present/Absent/Late/Half Day/Leave)
- ✅ Admin: Manually add attendance
- ✅ Full Audit Log (admin name, timestamp, old/new status, reason)
- ✅ Excel/CSV export (Daily/Weekly/Monthly/Employee-wise)
- ✅ Search by name, date, month
- ✅ Permanent data storage (AsyncStorage)
- ✅ Employee management (Add/Edit/Delete)

## Login Credentials
| Role     | Username | Password |
|----------|----------|----------|
| Admin    | admin    | admin123 |
| Employee | ahmed    | 1234     |
| Employee | sara     | 1234     |
| Employee | usman    | 1234     |

---

## APK Build Instructions

### Option 1: Expo Snack (EASIEST - No install needed)
1. Go to https://snack.expo.dev
2. Upload all files
3. Run on Android device via Expo Go app

### Option 2: Build APK with EAS (Recommended)

#### Step 1: Install tools
```bash
npm install -g eas-cli expo-cli
```

#### Step 2: Setup project
```bash
cd attendance-app
npm install
```

#### Step 3: Login to Expo
```bash
eas login
# Create free account at https://expo.dev if needed
```

#### Step 4: Configure build
```bash
eas build:configure
```

#### Step 5: Build APK
```bash
# For APK (sideload / direct install):
eas build --platform android --profile preview

# For Play Store (AAB):
eas build --platform android --profile production
```

#### Step 6: Download APK
- Build takes ~10-15 minutes
- Download link provided by Expo
- Install on any Android phone

### Option 3: Local Build (Advanced)
```bash
npm install
npx expo run:android
```
Requires Android Studio + JDK installed.

---

## Project Structure
```
attendance-app/
├── App.js                    # Main entry + Navigation
├── app.json                  # Expo config
├── eas.json                  # Build config
├── package.json              # Dependencies
└── src/
    ├── data/
    │   └── AppContext.js     # Global state + AsyncStorage
    └── screens/
        ├── LoginScreen.js
        ├── AdminDashboard.js
        ├── AttendanceScreen.js
        ├── EmployeeListScreen.js
        ├── ReportsScreen.js
        ├── AdminControlScreen.js
        ├── EmployeeDashboard.js
        └── AuditLogScreen.js
```

## Upgrade Options
- 💰 **Salary/Payroll**: Add per-day salary calculation
- 📅 **Leave Management**: Annual/sick/casual leave tracking
- 🔔 **Push Notifications**: Alert admin on check-in
- 🌐 **Firebase Backend**: Real-time cloud sync
- 📷 **Live Selfie**: expo-camera integration
- 📍 **GPS Verification**: expo-location integration
