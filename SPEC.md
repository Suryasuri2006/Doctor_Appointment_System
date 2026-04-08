# Doctor Appointment System - MERN Stack Project

## Project Overview
- **Project Name**: Doctor Appointment System
- **Type**: Full-stack Web Application (MERN)
- **Core Functionality**: A healthcare appointment scheduling platform where patients can browse doctors, book appointments, reschedule, and cancel visits
- **Target Users**: Patients seeking medical appointments, Doctors managing their schedules

---

## Technology Stack

### Frontend
- React 18 with Vite
- React Router v6 for navigation
- Context API for state management
- Axios for API calls
- CSS Modules with custom styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Database
- MongoDB
- Collections: users, doctors, appointments

---

## UI/UX Specification

### Color Palette
- **Primary**: `#0D9488` (Teal - trust, health)
- **Primary Dark**: `#0F766E`
- **Primary Light**: `#5- **Secondary**:EEAD4`
 `#1E293B` (Slate dark)
- **Accent**: `#F59E0B` (Amber - attention/alerts)
- **Background**: `#F8FAFC` (Light gray-blue)
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Success**: `#10B981`
- **Error**: `#EF4444`
- **Warning**: `#F59E0B`

### Typography
- **Primary Font**: 'Outfit', sans-serif (modern, clean)
- **Headings**: 'Outfit', weights 600-700
- **Body**: 'Outfit', weight 400-500
- **Font Sizes**:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Spacing System
- Base unit: 8px
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

### Layout Structure
- **Header**: Fixed top navigation with logo, nav links, user menu
- **Main Content**: Max-width 1200px, centered, padding 24px
- **Footer**: Simple footer with copyright
- **Responsive Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Visual Effects
- Card shadows: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- Hover transitions: 0.3s ease
- Button hover: scale(1.02) + brightness increase
- Page load animations: fade-in with stagger

---

## Page Specifications

### 1. Landing Page (Home)
- Hero section with welcome message and CTA buttons
- Featured doctors grid (6 doctors)
- How it works section (3 steps)
- Statistics counter section

### 2. Doctors Page (`/doctors`)
- Search bar with filters (specialty, date)
- Grid of doctor cards (3 columns desktop, 2 tablet, 1 mobile)
- Each card shows: photo, name, specialty, rating, availability indicator

### 3. Doctor Detail Page (`/doctors/:id`)
- Full doctor profile
- Availability calendar
- Book appointment button

### 4. Authentication Pages
- **Login** (`/login`): Email/password form
- **Register** (`/register`): Name, email, password, confirm password
- Clean centered card design with form validation

### 5. Dashboard (`/dashboard`)
- Welcome message with user name
- Upcoming appointments list
- Quick action buttons
- Recent activity

### 6. My Appointments (`/appointments`)
- Tabs: Upcoming / Past / Cancelled
- Appointment cards with:
  - Doctor info (photo, name, specialty)
  - Date and time
  - Status badge
  - Action buttons (Reschedule, Cancel)

### 7. Book Appointment Modal
- Date picker
- Time slot selection
- Reason for visit textarea
- Confirm button

---

## Component Specifications

### Header Component
- Logo (left)
- Navigation links: Home, Doctors, My Appointments (center)
- Auth buttons or User dropdown (right)
- Mobile: Hamburger menu

### Doctor Card Component
- Doctor avatar (rounded)
- Name (h3)
- Specialty badge
- Rating stars
- Availability dot (green/red)
- View Profile button

### Appointment Card Component
- Doctor mini profile
- Appointment date/time
- Status badge (Confirmed/Pending/Cancelled/Completed)
- Action buttons based on status and timing

### Button Variants
- Primary: Teal background, white text
- Secondary: White background, teal border/text
- Danger: Red background for cancel actions
- Ghost: Transparent with hover effect

### Form Inputs
- Rounded corners (8px)
- Focus: Teal border glow
- Error state: Red border + error message
- Labels above inputs

---

## Functionality Specification

### Authentication
- User registration with validation
- User login with JWT token
- Token stored in localStorage
- Protected routes redirect to login
- Logout clears token and redirects

### Doctor Management
- GET /api/doctors - List all doctors with filters
- GET /api/doctors/:id - Get single doctor details

### Appointment Management
- POST /api/appointments - Create new appointment
- GET /api/appointments - Get user's appointments
- PUT /api/appointments/:id - Reschedule appointment
- DELETE /api/appointments/:id - Cancel appointment

### Booking Flow
1. User selects doctor
2. Views available time slots
3. Selects date and time
4. Adds reason for visit
5. Confirms booking
6. Receives confirmation

### Appointment Status Flow
- Pending → Confirmed → Completed
- Pending → Cancelled
- Confirmed → Cancelled (with notice)

---

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doctor Routes
- `GET /api/doctors` - Get all doctors (with query params for specialty)
- `GET /api/doctors/:id` - Get doctor by ID

### Appointment Routes
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update/reschedule appointment
- `DELETE /api/appointments/:id` - Cancel appointment

---

## Data Models

### User
```
javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  createdAt: Date
}
```

### Doctor
```
javascript
{
  name: String (required),
  specialty: String (required),
  experience: Number,
  rating: Number,
  image: String,
  bio: String,
  availableDays: [String], // ['Monday', 'Tuesday', etc.]
  slots: [{
    day: String,
    times: [String] // ['09:00', '10:00', etc.]
  }],
  createdAt: Date
}
```

### Appointment
```
javascript
{
  user: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  date: Date,
  time: String,
  reason: String,
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  createdAt: Date
}
```

---

## Acceptance Criteria

### Must Have
- [x] User can register and login
- [x] User can view list of doctors
- [x] User can view doctor details
- [x] User can book an appointment
- [x] User can view their appointments
- [x] User can reschedule an appointment
- [x] User can cancel an appointment
- [x] Protected routes for authenticated users
- [x] Responsive design works on all devices
- [x] Clean, modern UI with specified color palette

### Visual Checkpoints
- [ ] Landing page loads with hero and doctor cards
- [ ] Doctor cards display properly in grid
- [ ] Login/Register forms validate input
- [ ] Dashboard shows user info and appointments
- [ ] Appointment cards show correct status badges
- [ ] Modals animate smoothly
- [ ] Navigation works between all pages

---

## Project Structure

```
doctor-appointment-system/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Node Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
└── README.md
