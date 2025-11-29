# QR Attendance System – MCA 3rd Semester Project

Web-based student attendance tracking using QR codes on student ID cards. Built with MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## 🎯 Features

- **Admin Portal**: Add students, generate QR-enabled ID cards, mark attendance via scanner
- **Student Portal**: View attendance summary with percentage and detailed history
- **QR Scanner**: Real-time QR code scanning for instant attendance marking
- **Once-per-day Attendance**: Prevents duplicate attendance entries for the same day
- **Responsive UI**: Modern, clean interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Frontend**: React 18, Vite, React Router, Zustand (state management)
- **Authentication**: JWT with role-based access control
- **QR Code**: `qrcode` library for generation, `react-qr-reader` for scanning
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js >= 18
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```pwsh
cd c:\Users\malik\Downloads\AttendifyQR
```

### 2. Install Dependencies

```pwsh
# Install all dependencies (backend + frontend)
npm run install:all
```

### 3. Configure Environment Variables

Create `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/qr_attendance
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

### 4. Clean Up Old Database Collections (Optional)

If you have old/unused collections in MongoDB, run:

```pwsh
cd backend
node cleanup-db.js
cd ..
```

## ▶️ Running the Application

### Option 1: Run Both Servers Concurrently (Recommended)

```pwsh
npm run dev:full
```

This starts:

- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

### Option 2: Run Servers Separately

**Terminal 1 (Backend):**

```pwsh
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```pwsh
cd frontend
npm run dev
```

## 👥 User Roles & Access

### Admin

- Add and manage students
- Generate student ID cards with QR codes
- Mark attendance by scanning QR codes
- View today's attendance list

### Student

- View attendance summary (total days, present, absent, percentage)
- Filter attendance history by date range
- View detailed attendance records

## 🔐 Default Login Credentials

**Admin Account:**

- Email: `admin@example.com`
- Password: `password123`

**Student Accounts:**
Students are created by admin with default password:

- Default password for all new students: `student123`

## 📱 How to Use

### For Admin:

1. **Login** with admin credentials
2. **Add Students**:
   - Go to "Students" tab
   - Fill in student details (email, name, roll number, department, semester, section)
   - Click "Add Student"
   - Note the auto-generated QR token
3. **Generate ID Cards**:
   - Click "ID Card" button next to any student
   - Download and print the ID card with QR code
4. **Mark Attendance**:
   - Go to "Mark Attendance" tab
   - Allow camera permissions
   - Scan student QR code from their ID card
   - Attendance is automatically marked for the day
5. **View Today's Attendance**:
   - Go to "Today's Attendance" tab
   - See all students who attended today

### For Students:

1. **Login** with student email and default password (`student123`)
2. **View Summary**: See total days, present days, absent days, and percentage
3. **Filter History**: Use date filters to view attendance for specific periods
4. **Check Status**: Green background indicates ≥75% attendance, red indicates <75%

## 🗂️ Project Structure

```
AttendifyQR/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   └── server.js        # Express server
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # React components
│   │   ├── store/           # Zustand state management
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Admin Routes (Protected)

- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add new student
- `GET /api/admin/students/:id/id-card` - Generate ID card with QR
- `POST /api/admin/mark-attendance` - Mark attendance via QR scan
- `GET /api/admin/attendance/today` - Get today's attendance

### Student Routes (Protected)

- `GET /api/student/attendance` - Get attendance summary and records

## ⚠️ Troubleshooting

### 404 Error on Student Attendance

- Ensure backend server is running
- Check that JWT token is valid (try logging out and in again)
- Verify MongoDB connection is active

### Camera Not Working

- Grant camera permissions in browser
- Use HTTPS or localhost (required for camera access)
- Ensure camera is not being used by another application

### Module Errors

- Run `npm run install:all` to reinstall dependencies
- Delete `node_modules` folders and `package-lock.json`, then reinstall

## 📝 Database Schema

### User

- email, password (hashed), name, role (admin/student)

### StudentProfile

- userId (ref to User), rollNumber, department, semester, section, photo, qrToken

### AttendanceRecord

- studentId (ref to StudentProfile), date, status (present/absent), markedAt
- Unique constraint: one attendance record per student per day

## 🎓 Academic Use

This project was developed as a mini project for MCA 3rd Semester. It demonstrates:

- Full-stack web development with MERN
- JWT authentication and authorization
- QR code integration
- Real-time camera access and processing
- RESTful API design
- State management in React
- Responsive UI/UX design

## 📄 License

This is an academic project for educational purposes.

---

**Developed by**: [Your Name]  
**Course**: MCA 3rd Semester  
**Project**: QR Attendance System
