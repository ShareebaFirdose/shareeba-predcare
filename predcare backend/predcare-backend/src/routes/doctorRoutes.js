// src/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

// Public routes - anyone can view doctors
router.get('/', doctorController.getAllDoctors);
router.get('/stats', doctorController.getDoctorStats);
router.get('/:id', doctorController.getDoctorById);

// Protected routes - admin only
router.post('/', authMiddleware, requireRole(['admin']), doctorController.createDoctor);
router.put('/:id', authMiddleware, requireRole(['admin']), doctorController.updateDoctor);
router.delete('/:id', authMiddleware, requireRole(['admin']), doctorController.deleteDoctor);

module.exports = router;