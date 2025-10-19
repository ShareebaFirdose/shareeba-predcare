// src/controllers/availabilityController.js
const { query } = require('../config/database');

// Get availability for a specific doctor
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    
    if (doctor.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const availability = await query(
      `SELECT * FROM availability 
       WHERE doctor_id = ? 
       ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`,
      [doctorId]
    );

    res.json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

// Get availability by ID
const getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await query('SELECT * FROM availability WHERE id = ?', [id]);

    if (availability.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found'
      });
    }

    res.json({
      success: true,
      data: availability[0]
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

// Create or update doctor availability
const setAvailability = async (req, res) => {
  try {
    const { doctor_id, day_of_week, start_time, end_time, is_available } = req.body;

    // Validation
    if (!doctor_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, day of week, start time, and end time are required'
      });
    }

    // Validate day_of_week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day_of_week)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day of week'
      });
    }

    // Check if doctor exists
    const doctor = await query('SELECT id FROM doctors WHERE id = ?', [doctor_id]);
    if (doctor.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if availability already exists for this doctor and day
    const existing = await query(
      'SELECT id FROM availability WHERE doctor_id = ? AND day_of_week = ?',
      [doctor_id, day_of_week]
    );

    let result;
    if (existing.length > 0) {
      // Update existing availability
      await query(
        `UPDATE availability 
         SET start_time = ?, end_time = ?, is_available = ?
         WHERE doctor_id = ? AND day_of_week = ?`,
        [start_time, end_time, is_available !== undefined ? is_available : true, doctor_id, day_of_week]
      );
      result = { id: existing[0].id };
    } else {
      // Create new availability
      result = await query(
        `INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, is_available)
         VALUES (?, ?, ?, ?, ?)`,
        [doctor_id, day_of_week, start_time, end_time, is_available !== undefined ? is_available : true]
      );
    }

    // Get the updated/created availability
    const availability = await query(
      'SELECT * FROM availability WHERE doctor_id = ? AND day_of_week = ?',
      [doctor_id, day_of_week]
    );

    res.status(existing.length > 0 ? 200 : 201).json({
      success: true,
      message: existing.length > 0 ? 'Availability updated successfully' : 'Availability created successfully',
      data: availability[0]
    });
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set availability',
      error: error.message
    });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, is_available } = req.body;

    // Check if availability exists
    const existing = await query('SELECT id FROM availability WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found'
      });
    }

    // Validate day_of_week if provided
    if (day_of_week) {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (!validDays.includes(day_of_week)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid day of week'
        });
      }
    }

    // Update availability
    await query(
      `UPDATE availability SET 
       day_of_week = COALESCE(?, day_of_week),
       start_time = COALESCE(?, start_time),
       end_time = COALESCE(?, end_time),
       is_available = COALESCE(?, is_available)
       WHERE id = ?`,
      [day_of_week, start_time, end_time, is_available, id]
    );

    // Get updated availability
    const updated = await query('SELECT * FROM availability WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
};

// Delete availability
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if availability exists
    const existing = await query('SELECT id FROM availability WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found'
      });
    }

    // Delete availability
    await query('DELETE FROM availability WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete availability',
      error: error.message
    });
  }
};

// Get all availability records (admin view)
const getAllAvailability = async (req, res) => {
  try {
    const { doctor_id, day_of_week } = req.query;
    
    let sql = `SELECT a.*, d.name as doctor_name, d.specialization 
               FROM availability a 
               JOIN doctors d ON a.doctor_id = d.id 
               WHERE 1=1`;
    const params = [];

    if (doctor_id) {
      sql += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }

    if (day_of_week) {
      sql += ' AND a.day_of_week = ?';
      params.push(day_of_week);
    }

    sql += ` ORDER BY d.name, FIELD(a.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`;

    const availability = await query(sql, params);

    res.json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    console.error('Get all availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability records',
      error: error.message
    });
  }
};

// Bulk set availability for a doctor (set entire week schedule)
const bulkSetAvailability = async (req, res) => {
  try {
    const { doctor_id, schedule } = req.body;

    // Validation
    if (!doctor_id || !schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and schedule array are required'
      });
    }

    // Check if doctor exists
    const doctor = await query('SELECT id FROM doctors WHERE id = ?', [doctor_id]);
    if (doctor.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const results = [];

    for (const item of schedule) {
      const { day_of_week, start_time, end_time, is_available } = item;

      if (!validDays.includes(day_of_week)) {
        continue;
      }

      // Check if availability exists
      const existing = await query(
        'SELECT id FROM availability WHERE doctor_id = ? AND day_of_week = ?',
        [doctor_id, day_of_week]
      );

      if (existing.length > 0) {
        // Update
        await query(
          `UPDATE availability 
           SET start_time = ?, end_time = ?, is_available = ?
           WHERE doctor_id = ? AND day_of_week = ?`,
          [start_time, end_time, is_available !== undefined ? is_available : true, doctor_id, day_of_week]
        );
      } else {
        // Insert
        await query(
          `INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, is_available)
           VALUES (?, ?, ?, ?, ?)`,
          [doctor_id, day_of_week, start_time, end_time, is_available !== undefined ? is_available : true]
        );
      }

      results.push(day_of_week);
    }

    // Get updated schedule
    const updatedSchedule = await query(
      `SELECT * FROM availability 
       WHERE doctor_id = ? 
       ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`,
      [doctor_id]
    );

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Bulk set availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set schedule',
      error: error.message
    });
  }
};

module.exports = {
  getDoctorAvailability,
  getAvailabilityById,
  setAvailability,
  updateAvailability,
  deleteAvailability,
  getAllAvailability,
  bulkSetAvailability
};