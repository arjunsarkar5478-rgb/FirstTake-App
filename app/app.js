// Import required Node.js modules
const express = require("express");
const path = require("path");

// Initialize express application
const app = express();

// Import database connection service
const db = require('./services/db');

// Configure static files directory and body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // ALLOWS HANDLING OF POST FORM DATA - MUST BE HERE!

// Configure the Pug templating engine and set the views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// ==========================================
// --- LIVE DATABASE ROUTES ---
// ==========================================

// 1. Landing Page
app.get("/", function(req, res) {
    res.render("index");
});

// 2. Talents (Users List) Page
app.get('/talents', async (req, res) => {
    try {
        const sql = "SELECT user_id, full_name AS name, bio AS role, 'London, UK' AS location FROM users";
        const liveUsers = await db.query(sql);
        res.render('talents', { users: liveUsers });
    } catch (error) {
        console.error("Error loading talents:", error);
        res.status(500).send("Error loading talents.");
    }
});

// 3. Projects Feed Route (We added location to the SELECT here)
app.get('/projects', async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.project_id, 
                p.owner_user_id,
                p.title, 
                p.genre, 
                p.location, /* <--- We selected location here now that we updated the DB! */
                p.description, 
                u.full_name AS director 
            FROM project p 
            LEFT JOIN users u ON p.owner_user_id = u.user_id
            ORDER BY p.project_id DESC
        `;
        
        const liveProjects = await db.query(sql);
        res.render('projects', { projects: liveProjects });
        
    } catch (error) {
        console.error("Error loading project feed:", error);
        res.status(500).send("Server Error loading projects.");
    }
});

// 4. Project Details Route (Displays a specific project + roles + location)
app.get('/project/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        
        const projectSql = `
            SELECT 
                p.project_id,
                p.owner_user_id,
                p.title, 
                p.genre, 
                p.location, 
                p.description, 
                u.full_name AS director 
            FROM project p 
            LEFT JOIN users u ON p.owner_user_id = u.user_id
            WHERE p.project_id = ?
        `;
        // THE FIX: Removed the [] brackets around projects
        const projects = await db.query(projectSql, [projectId]);

        if (!projects || projects.length === 0) {
            return res.status(404).send("Project not found");
        }

        const roleSql = `SELECT * FROM project_requirement WHERE project_id = ?`;
        
        // THE FIX: Removed the [] brackets around roles
        const roles = await db.query(roleSql, [projectId]);

        res.render('project_detail', { 
            project: projects[0],
            roles: roles 
        });

    } catch (error) {
        console.error("Database error on Project Details:", error);
        res.status(500).send("Server Error loading project details.");
    }
});

// 5. User Profile Route (Shows specific user + their projects)
app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // THE FIX: Removed the [] brackets around userData
        const userData = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        
        if (!userData || userData.length === 0) {
            return res.status(404).send("User not found.");
        }

        // THE FIX: Removed the [] brackets around userProjects
        const userProjects = await db.query("SELECT *, 'London, UK' AS location FROM project WHERE owner_user_id = ? ORDER BY project_id DESC", [userId]);

        res.render('profile', { 
            user: userData[0], 
            projects: userProjects 
        });

    } catch (error) {
        console.error("Database error on User Profile:", error);
        res.status(500).send("Server Error loading profile.");
    }
});

// ==========================================
// --- NEW PROJECT CREATION ROUTES (Match image_7.png) ---
// ==========================================

// Route A: Display the "Create New Project" page exactly like image_7.png
app.get('/create_project', function(req, res) {
    res.render('create_project');
});

// Route B: Handle the form submission when a user clicks "PUBLISH PROJECT"
// We are connecting this POST route to the backend!
app.post('/publish-project', async (req, res) => {
    try {
        const projectData = req.params.projectData;
        console.log("RECEIVED FORM DATA:", projectData);

        // For MVP, we will make "Sarah" (User ID 2) the owner of all new projects.
        // Later we will get this from the logged-in user session.
        const ownerUserId = 2;

        // 1. Insert the main Project Details (Crucially including location!)
        const projectSql = `
            INSERT INTO project (title, genre, location, description, owner_user_id) 
            VALUES (?, ?, ?, ?, ?)`
        ;
        const [projectResult] = await db.query(projectSql, [
            projectData.title, 
            projectData.genre, 
            projectData.location, 
            projectData.description, 
            ownerUserId
        ]);

        // Get the specific ID of the project we JUST created.
        // This is needed to link the roles to this project.
        const newProjectId = projectResult.insertId;
        console.log(`Main Project Inserted (ID: ${newProjectId})`);

        // 2. Insert dynamic Roles (if any were provided)
        if (projectData.roles && Array.isArray(projectData.roles)) {
            
            console.log("Processing roles...");
            const roleSql = "INSERT INTO project_requirement (project_id, role_title, role_requirements) VALUES (?, ?, ?)";

            // Loop through each role submitted from the frontend and save it to MySQL
            for (let i = 0; i < projectData.roles.length; i++) {
                const role = projectData.roles[i];
                // Only insert if the role has a title
                if (role.title && role.title.trim() !== "") {
                    await db.query(roleSql, [newProjectId, role.title, role.requirements]);
                    console.log(`   - Saved Role: ${role.title}`);
                }
            }
        }

        // 3. SUCCESS! Redirect back to the feed where they can see their new project.
        res.redirect('/projects');
        
    } catch (error) {
        console.error("CRITICAL ERROR PUBLISHING PROJECT:", error);
        res.status(500).send("Server Error while publishing project.");
    }
});


// ==========================================
// --- START SERVER ---
// ==========================================
app.listen(3000, '0.0.0.0', function(){
    console.log(`FirstTake server running at http://localhost:3000/`);
});