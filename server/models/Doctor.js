const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  specialty: {
    type: String,
    required: [true, 'Please provide specialty'],
    enum: [
      'General Physician',
      'Cardiologist',
      'Dermatologist',
      'Pediatrician',
      'Orthopedic',
      'Neurologist',
      'Ophthalmologist',
      'ENT Specialist',
      'Psychiatrist',
      'Gynecologist',
      'Urologist',
      'Dentist'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: [0, 'Experience cannot be negative']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  image: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  slots: [{
    day: String,
    times: [String]
  }],
  consultationFee: {
    type: Number,
    default: 500
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
doctorSchema.index({ name: 'text', specialty: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
