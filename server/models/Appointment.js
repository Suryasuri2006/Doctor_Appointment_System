const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please provide doctor']
  },
  date: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  time: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  reason: {
    type: String,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
appointmentSchema.index({ user: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });

// Static method to mark past appointments as completed
appointmentSchema.statics.markPastAppointmentsAsCompleted = async function() {
  const now = new Date();
  
  // Get all appointments that are pending or confirmed and have passed
  const appointments = await this.find({
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { date: { $lt: now.toISOString().split('T')[0] } }, // Date is before today
      { 
        date: { $eq: now.toISOString().split('T')[0] }, // Date is today
        time: { $lt: now.toTimeString().slice(0, 5) } // Time is before current time
      }
    ]
  });

  // Update each past appointment to completed
  for (const appointment of appointments) {
    appointment.status = 'completed';
    await appointment.save();
  }

  return appointments.length;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
