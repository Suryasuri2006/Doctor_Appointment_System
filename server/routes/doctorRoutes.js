const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  getDoctorById, 
  getDoctorAvailability,
  getSpecialties 
} = require('../controllers/doctorController');

// More specific routes first
router.get('/specialties', getSpecialties);
router.get('/availability/:id', getDoctorAvailability);

// Then parameterized routes
router.get('/:id', getDoctorById);
router.get('/', getDoctors);

module.exports = router;
