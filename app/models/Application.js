const db = require('../services/db');

class Application {
  // 1. Create a new application
  static async create(openingId, userId, message) {
    const sql = "INSERT INTO application (opening_id, applicant_user_id, message, status) VALUES (?, ?, ?, 'APPLIED')";
    const result = await db.query(sql, [openingId, userId, message]);
    return result.insertId;
  }

 static async hasUserApplied(openingId, userId) {
    const sql = "SELECT * FROM application WHERE opening_id = ? AND applicant_user_id = ?";
    
    // 1. Run the query
    const result = await db.query(sql, [openingId, userId]);

    // 2. The Fix: Look at the first part of the result. 
    // If it exists, we call it 'rows'. If it doesn't, we make it an empty list [].
    const rows = result[0] || [];
    
    // 3. Now we can safely check the length
    return rows.length > 0;
  }
}

module.exports = Application;