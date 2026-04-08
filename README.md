# Doctor Appointment System 🚀

## 📋 Overview
A full-stack MERN application for booking doctor appointments. Patients can browse doctors by specialty, view profiles, book/reschedule/cancel appointments, and manage their dashboard. Features JWT authentication, responsive design, and MongoDB persistence.

**Key Features:**
- User registration & login (JWT protected)
- Browse doctors list with search/filter
- Doctor profiles & availability
- Book, reschedule, cancel appointments
- User dashboard & appointments list
- Responsive UI (mobile-first)

See detailed [SPEC.md](SPEC.md) for UI/UX specs and [todo.md](todo.md) for completion status.

## 🛠️ Tech Stack
### Frontend (client/)
- React 18 + Vite 5
- React Router v6
- Axios, Context API
- CSS Modules

### Backend (server/)
- Node.js + Express 4
- MongoDB + Mongoose 8
- JWT, bcryptjs
- CORS enabled

## 📦 Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone & Setup
```bash
# Already in d:/React_JS
```

### 2. Backend (server/)
```bash
cd server
npm install
# Copy .env.example to .env and set MONGO_URI (e.g., mongodb://localhost:27017/doctor-appointments)
npm start
# Runs on http://localhost:5000
```

### 3. Frontend (client/)
```bash
cd ../client
npm install
npm run dev
# Runs on http://localhost:3000 (opens in browser)
```

**Note:** Backend must run first. Frontend proxies API calls to server.

## 📁 Project Structure
```
d:/React_JS/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Routes: Home, Doctors, etc.
│   │   └── services/       # API calls
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node/Express API
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/             # User, Doctor, Appointment
│   ├── routes/
│   └── package.json
├── SPEC.md                 # Detailed specs
├── todo.md                 # Completion plan
└── README.md              # This file
```

## 🌐 API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | - |
| POST | `/api/auth/login` | Login user | - |
| GET | `/api/doctors` | List doctors | - |
| GET | `/api/doctors/:id` | Doctor details | - |
| POST | `/api/appointments` | Book appointment | ✅ |
| GET | `/api/appointments` | User appointments | ✅ |
| PUT | `/api/appointments/:id` | Reschedule | ✅ |
| DELETE | `/api/appointments/:id` | Cancel | ✅ |

Base URL: `http://localhost:5000`

## 🎨 UI Design
- **Colors:** Primary teal (#0D9488), slate dark (#1E293B)
- **Typography:** 'Outfit' font
- **Responsive:** Mobile/tablet/desktop
- **Components:** Header, DoctorCard, AppointmentCard, BookingModal

Full specs in [SPEC.md](SPEC.md).

## 🧪 Testing
1. Register a new user.
2. Login and browse doctors.
3. Book an appointment.
4. View dashboard/appointments.
5. Reschedule/cancel.

Sample doctors auto-seeded on server start.

## 🔧 Troubleshooting
- **CORS errors:** Ensure server runs first.
- **MongoDB:** Check MONGO_URI in server/.env.
- **Port conflicts:** Kill processes on 3000/5000.

## 📈 Commands
```bash
# Install all
cd server && npm i && cd ../client && npm i

# Dev mode (two terminals)
# Terminal 1: cd server && npm start
# Terminal 2: cd client && npm run dev

# Build frontend
cd client && npm run build
```

## ✅ Status
Project fully implemented per SPEC.md. Ready for production!

---
**Built with ❤️ for seamless doctor bookings.**

