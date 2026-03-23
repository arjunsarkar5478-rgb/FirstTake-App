// Import required Node.js modules
const express = require("express");
const path = require("path");

// Initialize express application
const app = express();

// Import database connection service
const db = require('./services/db');

// Configure static files directory for CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// Configure the Pug templating engine and set the views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- LIVE DATABASE ROUTES ---

// Render the brand new Landing Page
app.get("/", function(req, res) {
    res.render("index");
});

// Route for the Talents (Users List) Page
app.get('/talents', async (req, res) => {
    try {
        // Querying name, role, and location
        const sql = "SELECT full_name AS name, bio AS role, 'London, UK' AS location FROM users";
        const liveUsers = await db.query(sql);
        res.render('talents', { users: liveUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading talents.");
    }
});

// Route for the Project Listing Page (The Feed)
app.get('/projects', async (req, res) => {
    try {
        // Fetch projects and join with users table
        const sql = `
            SELECT 
                p.title, 
                p.genre, 
                p.description AS lookingFor, 
                u.full_name AS director 
            FROM project p 
            LEFT JOIN users u ON p.owner_user_id = u.user_id
        `;
        
        const liveProjects = await db.query(sql);
        res.render('projects', { projects: liveProjects });

    } catch (error) {
        // DIAGNOSTIC FIX: Print the exact crash report directly to the web page
        const errorMessage = `
            <div style="padding: 20px; font-family: sans-serif;">
                <h1 style="color: #ef4444;">CRASH REPORT</h1>
                <h3 style="color: #b91c1c;">Message: ${error.message}</h3>
                <pre style="background: #f1f5f9; padding: 15px; border-radius: 8px;">${error.stack}</pre>
            </div>
        `;
        res.status(500).send(errorMessage);
    }
});

// Route for the User Profile Page (Displaying User ID 1 for MVP)
// --- USER PROFILE ROUTE ---
app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Get the User's Information
        const [userData] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        
        // If the user doesn't exist, stop here
        if (!userData || userData.length === 0) {
            return res.status(404).send("User not found.");
        }

        // 2. Get all Projects owned by this User
        const [userProjects] = await db.query("SELECT * FROM project WHERE owner_user_id = ? ORDER BY project_id DESC", [userId]);

        // 3. Send both sets of data to the Pug template
        res.render('profile', { 
            user: userData[0], 
            projects: userProjects 
        });

    } catch (error) {
        console.error("Database error on User Profile:", error);
        res.status(500).send("Server Error loading profile.");
    }
});

// --- PROJECT DETAILS ROUTE ---
app.get('/project/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // 1. Get the Project Details
        const projectSql = `
            SELECT 
                p.project_id,
                p.owner_user_id,
                p.title, 
                p.genre, 
                p.description, 
                u.full_name AS director 
            FROM project p 
            LEFT JOIN users u ON p.owner_user_id = u.user_id
            WHERE p.project_id = ?
        `;
        const [projects] = await db.query(projectSql, [projectId]);

        if (!projects || projects.length === 0) {
            return res.status(404).send("Project not found");
        }

        // 2. Get the Roles required for this project
        // (Assuming your table is called project_requirement)
        const roleSql = `SELECT * FROM project_requirement WHERE project_id = ?`;
        const [roles] = await db.query(roleSql, [projectId]);

        // 3. Send both project data and roles array to Pug
        res.render('project_detail', { 
            project: projects[0],
            roles: roles 
        });

    } catch (error) {
        console.error("Database error on Project Details:", error);
        res.status(500).send("Server Error");
    }
});

// --- START SERVER ---

// Start server on port 3000 mapping to 0.0.0.0 for Docker compatibility
app.listen(3000, '0.0.0.0', function(){
    console.log(`FirstTake server running at http://localhost:3000/`);
});