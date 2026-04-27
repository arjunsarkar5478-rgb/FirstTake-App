const bcrypt = require('bcryptjs');
const db = require('../services/db');

class User {
  constructor(user_id, name, role, location) {
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

  // Update a user's profile details
  static async updateProfile(id, bio, location, primary_link, secondary_link) {
    const sql = "UPDATE users SET bio = ?, location = ?, primary_link = ?, secondary_link = ? WHERE user_id = ?";
    await db.query(sql, [bio, location, primary_link, secondary_link, id]);
    return true;
  }

  static async create(fullName, email, passwordHash, roles, phone) {
    const sql = "INSERT INTO users (full_name, email, password, roles, phone) VALUES (?, ?, ?, ?, ?)";
    // Brackets removed!
    const result = await db.query(sql, [fullName, email, passwordHash, roles, phone]);
    
    return result.insertId;
  }

  // Updates the profile picture path in the database
  static async updateProfilePicture(id, imagePath) {
    const sql = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
    await db.query(sql, [imagePath, id]);
    return true;
  }

  // --- NEW METHODS (Authentication) ---
  
  // Register a new user
  static async register(email, password, fullName, roles, gdprConsent) {
    const pw = await bcrypt.hash(password, 10);
    const consentValue = gdprConsent ? 1 : 0;

    // Using table name 'users' and the new columns we discussed
    const sql = "INSERT INTO users (email, password, full_name, roles, gdpr_consent) VALUES (?, ?, ?, ?, ?)";
    const result = await db.query(sql, [email, pw, fullName, roles, consentValue]);
    
    return result.insertId; // Returns the new user_id
  }

  // Check login credentials
  static async authenticate(email, submittedPassword) {
    const sql = "SELECT * FROM users WHERE email = ?"; 
    const rows = await db.query(sql, [email]); 
    
    if (rows && rows.length > 0) {
        const match = await bcrypt.compare(submittedPassword, rows[0].password);
        if (match) {
            return rows[0]; // Return the full user record if password matches
        }
    }
    return null; // Return null if failed
  }
}

module.exports = User;