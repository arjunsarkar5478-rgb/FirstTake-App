const db = require('../services/db');

class Project {
  constructor(project_id, owner_user_id, title, genre, location, description, director) {
    // FIX: Reverted variable names to match what the Pug templates expect
    this.project_id = project_id; 
    this.owner_user_id = owner_user_id; 
    this.title = title;
    this.genre = genre;
    this.location = location;
    this.description = description;
    this.director = director;
    this.roles = []; 
  }

  static async getAll() {
    const sql = `
      SELECT p.project_id, p.owner_user_id, p.title, p.genre, p.location, p.description, u.full_name AS director 
      FROM project p 
      LEFT JOIN users u ON p.owner_user_id = u.user_id
      ORDER BY p.project_id DESC
    `;
    const rows = await db.query(sql);
    return rows.map(row => new Project(
      row.project_id, row.owner_user_id, row.title, row.genre, row.location, row.description, row.director
    ));
  }

  static async getById(id) {
    const sql = `
      SELECT p.project_id, p.owner_user_id, p.title, p.genre, p.location, p.description, u.full_name AS director 
      FROM project p 
      LEFT JOIN users u ON p.owner_user_id = u.user_id
      WHERE p.project_id = ?
    `;
    const rows = await db.query(sql, [id]);
    
    if (!rows || rows.length === 0) return null;

    const proj = new Project(
      rows[0].project_id, rows[0].owner_user_id, rows[0].title, rows[0].genre, rows[0].location, rows[0].description, rows[0].director
    );

    // --- THE FIX IS HERE ---
    // We JOIN the two tables so we can get both the requirement details AND the opening_id
   // We add a COUNT() and JOIN the application table to get real numbers!
    const roleSql = `
      SELECT pr.*, pro.opening_id, COUNT(a.application_id) AS applicant_count
      FROM project_requirement pr
      LEFT JOIN project_role_opening pro ON pr.requirement_id = pro.role_id
      LEFT JOIN application a ON pro.opening_id = a.opening_id
      WHERE pr.project_id = ?
      GROUP BY pr.requirement_id, pro.opening_id
    `;
    proj.roles = await db.query(roleSql, [id]);

    return proj;
  }

  static async getByUserId(userId) {
      const sql = "SELECT *, 'London, UK' AS location FROM project WHERE owner_user_id = ? ORDER BY project_id DESC";
      const rows = await db.query(sql, [userId]);
      return rows; 
  }

  static async create(projectData, ownerId) {
    const projectSql = `INSERT INTO project (title, genre, location, description, owner_user_id) VALUES (?, ?, ?, ?, ?)`;
    const result = await db.query(projectSql, [
      projectData.title, projectData.genre, projectData.location, projectData.description, ownerId
    ]);
    
    const newId = result.insertId || (result[0] ? result[0].insertId : null);

    if (projectData.roles) {
      const rolesArray = Array.isArray(projectData.roles) ? projectData.roles : Object.values(projectData.roles);
      const roleSql = "INSERT INTO project_requirement (project_id, role_title, role_requirements) VALUES (?, ?, ?)";
      
      for (let role of rolesArray) {
        if (role.title && role.title.trim() !== "") {
          // 1. Insert the Requirement
          const reqResult = await db.query(roleSql, [newId, role.title, role.requirements]);
          
          // 2. Grab the new Requirement ID so we can link it
          const newReqId = reqResult.insertId || (reqResult[0] ? reqResult[0].insertId : null);

          // 3. THE FIX: Open the Role! 
          if (newReqId) {
            const openingSql = "INSERT INTO project_role_opening (project_id, role_id, role_title, opening_status) VALUES (?, ?, ?, 'OPEN')";
            await db.query(openingSql, [newId, newReqId, role.title]);
          }
        }
      }
    }
    return newId;
  }
}

module.exports = Project;