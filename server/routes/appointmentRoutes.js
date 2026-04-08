const express = require('express');
const router = express.Router();
const { 
  getAppointments, 
  getAppointmentById,
  createAppointment, 
  updateAppointment, 
  cancelAppointment 
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(cancelAppointment);

module.exports = router;
