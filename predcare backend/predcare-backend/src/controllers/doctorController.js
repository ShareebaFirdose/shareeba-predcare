const { query } = require('../config/database');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const { status, specialization, search } = req.query;
    
    let sql = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (specialization) {
      sql += ' AND specialization = ?';
      params.push(specialization);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR specialization LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY created_at DESC';

    const doctors = await query(sql, params);

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

// Get single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctors = await query(
      'SELECT * FROM doctors WHERE id = ?',
      [id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctors[0]
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

// Create new doctor
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      license_number,
      address,
      profile_image,
      status,
      primary_clinic
    } = req.body;

    // Validation
    if (!name || !email || !specialization || !license_number) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, specialization, and license number are required'
      });
    }

    // Check if email already exists
    const existing = await query(
      'SELECT id FROM doctors WHERE email = ? OR license_number = ?',
      [email, license_number]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    // Insert doctor
    const result = await query(
      `INSERT INTO doctors (name, email, phone, specialization, license_number, 
       address, profile_image, status, primary_clinic) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone || null,
        specialization,
        license_number,
        address || null,
        profile_image || null,
        status || 'Inactive',
        primary_clinic || 'PRED CLINIC'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: {
        id: result.insertId,
        name,
        email,
        specialization,
        license_number,
        status: status || 'Inactive'
      }
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      specialization,
      license_number,
      address,
      profile_image,
      status,
      primary_clinic
    } = req.body;

    // Check if doctor exists
    const existing = await query('SELECT id FROM doctors WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check for duplicate email or license (excluding current doctor)
    if (email || license_number) {
      const duplicate = await query(
        'SELECT id FROM doctors WHERE (email = ? OR license_number = ?) AND id != ?',
        [email, license_number, id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Another doctor with this email or license number already exists'
        });
      }
    }

    // Update doctor
    await query(
      `UPDATE doctors SET 
       name = COALESCE(?, name),
       email = COALESCE(?, email),
       phone = COALESCE(?, phone),
       specialization = COALESCE(?, specialization),
       license_number = COALESCE(?, license_number),
       address = COALESCE(?, address),
       profile_image = COALESCE(?, profile_image),
       status = COALESCE(?, status),
       primary_clinic = COALESCE(?, primary_clinic)
       WHERE id = ?`,
      [
        name,
        email,
        phone,
        specialization,
        license_number,
        address,
        profile_image,
        status,
        primary_clinic,
        id
      ]
    );

    // Get updated doctor
    const updated = await query('SELECT * FROM doctors WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const existing = await query('SELECT id FROM doctors WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Delete doctor (cascade will delete availability)
    await query('DELETE FROM doctors WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};

// Get doctor statistics
const getDoctorStats = async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_doctors,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_doctors,
        SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive_doctors,
        COUNT(DISTINCT specialization) as total_specializations
      FROM doctors
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorStats
};