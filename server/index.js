const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

// Route imports
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Seed doctors data
const seedDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      const doctors = [
        {
          name: 'Dr. Priya Shanmugan',
          specialty: 'General Physician',
          experience: 15,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Experienced general physician with a focus on preventive care and patient wellness.',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Monday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Tuesday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Wednesday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Thursday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '21:30'] }
          ],
          consultationFee: 500,
          location: 'Trust Health Clinic Gandhipuram'
        },
        {
          name: 'Dr. Harish Kumar',
          specialty: 'Cardiologist',
          experience: 20,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Board-certified cardiologist specializing in interventional cardiology and heart disease prevention.',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          slots: [
            { day: 'Monday', times: ['10:00', '11:00', '14:00', '15:00'] },
            { day: 'Wednesday', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Friday', times: ['10:00', '11:00', '14:00'] }
          ],
          consultationFee: 1000,
          location: 'Sai Hospital Thudiyalur'
        },
        {
          name: 'Dr. Reena',
          specialty: 'Dermatologist',
          experience: 12,
          rating: 4.7,
          image: 'https://plus.unsplash.com/premium_photo-1702598599506-9ff660bc50f5?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Specializing in cosmetic dermatology, skin cancer treatment, and anti-aging procedures.',
          availableDays: ['Tuesday', 'Thursday', 'Saturday'],
          slots: [
            { day: 'Tuesday', times: ['09:00', '10:00', '11:00', '15:00', '16:00'] },
            { day: 'Thursday', times: ['09:00', '10:00', '11:00', '15:00', '16:00'] },
            { day: 'Saturday', times: ['10:00', '11:00', '12:00'] }
          ],
          consultationFee: 800,
          location: 'Skin Wellness Center'
        },
        {
          name: 'Dr. Jaya Prakash',
          specialty: 'Pediatrician',
          experience: 18,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1612523138351-4643808db8f3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Compassionate pediatrician dedicated to providing comprehensive care for children from infancy to adolescence.',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Monday', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
            { day: 'Tuesday', times: ['09:00', '10:00', '14:00', '15:00'] },
            { day: 'Wednesday', times: ['09:00', '10:00', '11:00', '14:00'] },
            { day: 'Thursday', times: ['10:00', '11:00', '14:00', '15:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00'] }
          ],
          consultationFee: 600,
          location: 'Children\'s Health Center Saravanampatti'
        },
        {
          name: 'Dr. Sai Pallavi',
          specialty: 'Orthopedic',
          experience: 14,
          rating: 4.6,
          image: 'https://plus.unsplash.com/premium_photo-1661780752599-963ae9b817f1?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Expert in sports medicine, joint replacement, and minimally invasive orthopedic surgery.',
          availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Monday', times: ['10:00', '11:00', '14:00', '15:00'] },
            { day: 'Tuesday', times: ['10:00', '11:00', '14:00'] },
            { day: 'Thursday', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Friday', times: ['10:00', '11:00', '14:00'] }
          ],
          consultationFee: 900,
          location: 'KG Coimbatore'
        },
        {
          name: 'Dr. Nandha Kumar',
          specialty: 'Neurologist',
          experience: 22,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1758691461513-88a0aef72160?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Leading neurologist specializing in stroke treatment, epilepsy, and neurodegenerative disorders.',
          availableDays: ['Wednesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Wednesday', times: ['09:00', '10:00', '11:00', '14:00'] },
            { day: 'Thursday', times: ['09:00', '10:00', '14:00', '15:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
          ],
          consultationFee: 1200,
          location: 'GH Coimbatore'
        },
        {
          name: 'Dr. Harsha Varshana',
          specialty: 'Ophthalmologist',
          experience: 10,
          rating: 4.7,
          image: 'https://plus.unsplash.com/premium_photo-1661548320515-7d574b9f4f61?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Specializing in cataract surgery, LASIK, and treatment of various eye conditions.',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Saturday'],
          slots: [
            { day: 'Monday', times: ['09:00', '10:00', '11:00'] },
            { day: 'Tuesday', times: ['14:00', '15:00', '16:00'] },
            { day: 'Wednesday', times: ['09:00', '10:00', '14:00', '15:00'] },
            { day: 'Saturday', times: ['10:00', '11:00', '12:00'] }
          ],
          consultationFee: 700,
          location: 'KMCH Coimbatore'
        },
        {
          name: 'Dr. Vikram Narayana',
          specialty: 'ENT Specialist',
          experience: 16,
          rating: 4.5,
          image: 'https://plus.unsplash.com/premium_photo-1702598889894-93b91d2e445e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Expert in treating ear, nose, and throat disorders, including hearing loss and sinus conditions.',
          availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Monday', times: ['10:00', '11:00', '15:00', '16:00'] },
            { day: 'Wednesday', times: ['10:00', '11:00', '14:00', '15:00'] },
            { day: 'Thursday', times: ['09:00', '10:00', '14:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00'] }
          ],
          consultationFee: 650,
          location: 'Vikram ENT Coiimbatore'
        },
        {
          name: 'Dr. Smrithi Mandhana',
          specialty: 'Psychiatrist',
          experience: 12,
          rating: 4.9,
          image: 'https://plus.unsplash.com/premium_photo-1661773895828-3d35e0eeb981?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'Compassionate psychiatrist specializing in anxiety, depression, and mood disorders.',
          availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          slots: [
            { day: 'Tuesday', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
            { day: 'Wednesday', times: ['09:00', '10:00', '14:00', '15:00'] },
            { day: 'Thursday', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00'] }
          ],
          consultationFee: 1100,
          location: 'Mental Wellness Clinic'
        },
        {
          name: 'Dr. Karthik Sharma',
          specialty: 'Dentist',
          experience: 8,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1674775372058-c4c8813c6611?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bio: 'General dentist providing preventive care, cosmetic dentistry, and dental implants.',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          slots: [
            { day: 'Monday', times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
            { day: 'Tuesday', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
            { day: 'Wednesday', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
            { day: 'Thursday', times: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
            { day: 'Friday', times: ['09:00', '10:00', '11:00', '14:00'] },
            { day: 'Saturday', times: ['10:00', '11:00', '12:00'] }
          ],
          consultationFee: 400,
          location: 'Smile Dental Care Ooty'
        }
      ];

      await Doctor.insertMany(doctors);
      console.log('Doctors seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding doctors:', error);
  }
};

// Connect to database and start server
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Doctor Appointment Server Running 🚀");
});

// Schedule job to automatically mark past appointments as completed
const startPastAppointmentScheduler = () => {
  // Run every minute to check for past appointments
  setInterval(async () => {
    try {
      const count = await Appointment.markPastAppointmentsAsCompleted();
      if (count > 0) {
        console.log(`[Scheduler] Marked ${count} past appointment(s) as completed`);
      }
    } catch (error) {
      console.error('[Scheduler] Error marking past appointments:', error);
    }
  }, 60000); // Every 60 seconds
};

const startServer = async () => {
  await connectDB();
  await seedDoctors();
  
  // Start the scheduler
  startPastAppointmentScheduler();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
