// src/models/userModel.js
const { query } = require('../config/database');

const UserModel = {
  // Create new user
  create: async (userData) => {
    const { email, password, full_name, phone, role } = userData;
    const result = await query(
      `INSERT INTO users (email, password, full_name, phone, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, password, full_name, phone || null, role || 'patient']
    );
    return result.insertId;
  },

  // Find user by email
  findByEmail: async (email) => {
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users.length > 0 ? users[0] : null;
  },

  // Find user by ID
  findById: async (id) => {
    const users = await query(
      'SELECT id, email, full_name, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return users.length > 0 ? users[0] : null;
  },

  // Update user
  update: async (id, userData) => {
    const { full_name, phone } = userData;
    await query(
      'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
      [full_name, phone, id]
    );
    return UserModel.findById(id);
  },

  // Update password
  updatePassword: async (id, hashedPassword) => {
    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  },

  // Find all users with filters
  findAll: async (filters = {}) => {
    let sql = 'SELECT id, email, full_name, phone, role, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    sql += ' ORDER BY created_at DESC';

    return await query(sql, params);
  },

  // Delete user
  delete: async (id) => {
    await query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = UserModel;