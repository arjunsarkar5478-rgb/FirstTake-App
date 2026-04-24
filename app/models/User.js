const db = require('../services/db');

class User {
  constructor(user_id, name, role, location) {
    // FIX: Reverted to user_id for the Pug template
    this.user_id = user_id; 
    this.name = name;
    this.role = role;
    this.location = location;
  }

  static async getAll() {
    const sql = "SELECT user_id, full_name AS name, bio AS role, 'London, UK' AS location FROM users";
    const rows = await db.query(sql);
    return rows.map(row => new User(row.user_id, row.name, row.role, row.location));
  }

  static async getById(id) {
    const sql = "SELECT * FROM users WHERE user_id = ?";
    const rows = await db.query(sql, [id]);
    if (!rows || rows.length === 0) return null;
    return rows[0]; 
  }
}

module.exports = User;