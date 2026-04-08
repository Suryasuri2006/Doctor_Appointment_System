const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

// Helper function to create notification
const createNotification = async (userId, type, title, message, appointmentId = null) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      appointment: appointmentId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// @desc    Get all appointments for user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // Automatically mark past appointments as completed
    await Appointment.markPastAppointmentsAsCompleted();

    const { status } = req.query;
    let query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialty image experience rating location')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialty image experience rating location')
      .populate('user', 'name email phone');

    if (appointment) {
      // Check if user owns this appointment
      if (appointment.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this appointment' });
      }

      // Check if the appointment has passed and update status to completed
      const now = new Date();
      const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];
      
      if (appointment.status === 'pending' || appointment.status === 'confirmed') {
        if (appointmentDate < today || (appointmentDate === today && appointment.time < now.toTimeString().slice(0, 5))) {
          appointment.status = 'completed';
          await appointment.save();
        }
      }

      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointment
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason,
      status: 'pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialty image experience rating location')
      .populate('user', 'name email phone');

    // Create notification for appointment booked
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    await createNotification(
      req.user._id,
      'appointment_booked',
      'Appointment Booked!',
      `Your appointment with ${doctor.name} has been booked for ${formattedDate} at ${time}.`,
      appointment._id
    );

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment (reschedule)
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { date, time, status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Check if appointment can be updated
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update a cancelled or completed appointment' });
    }

    // Get doctor info for notification
    const doctor = await Doctor.findById(appointment.doctor);

    // Update fields
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    const updatedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('doctor', 'name specialty image experience rating location')
      .populate('user', 'name email phone');

    // Create notification for reschedule
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    await createNotification(
      req.user._id,
      'appointment_rescheduled',
      'Appointment Rescheduled',
      `Your appointment with ${doctor.name} has been rescheduled to ${formattedDate} at ${appointment.time}.`,
      appointment._id
    );

    res.json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    // Get doctor info for notification
    const doctor = await Doctor.findById(appointment.doctor);

    appointment.status = 'cancelled';
    await appointment.save();

    // Create notification for cancellation
    await createNotification(
      req.user._id,
      'appointment_cancelled',
      'Appointment Cancelled',
      `Your appointment with ${doctor.name} scheduled for ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
      appointment._id
    );

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment
};
