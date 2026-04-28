const Project = require('../models/Project');
const Application = require('../models/Application');
const db = require('../services/db');

const getProjectsFeed = async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.render('projects', { projects: projects });
    } catch (error) {
        console.error("Error loading project feed:", error);
        res.status(500).send("Server Error loading projects.");
    }
};

const getProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.uid; 

        const project = await Project.getById(projectId);
        if (!project) return res.status(404).send("Project not found");

        // --- HELPER FUNCTION FOR YOUR CUSTOM DB ---
        const extractRows = (result) => {
            if (!result) return [];
            if (Array.isArray(result) && Array.isArray(result[0])) return result[0]; 
            if (Array.isArray(result)) return result; 
            return [result]; 
        };

        // --- THE "MISSING STATUS" FIX ---
        // Force the controller to grab the true status from the database
        const statusResult = await db.query(`SELECT status FROM project WHERE project_id = ?`, [projectId]);
        const statusRow = extractRows(statusResult);
        if (statusRow.length > 0 && statusRow[0].status) {
            project.status = statusRow[0].status; 
        }

        // 2. ACTOR VIEW
        let appliedOpeningIds = [];
        if (userId) {
            const appliedResult = await db.query(
                `SELECT opening_id FROM application WHERE applicant_user_id = ?`, 
                [userId]
            );
            const rows = extractRows(appliedResult);
            // Force Number so Pug matches perfectly
            appliedOpeningIds = rows.map(row => Number(row.opening_id)); 
        }

        // 3. DIRECTOR VIEW
        let applicants = [];
        if (userId == project.owner_user_id) {
            const appResult = await db.query(`
                SELECT 
                    u.full_name, u.email, u.user_id, 
                    a.status, a.application_id, 
                    pro.role_title
                FROM application a
                LEFT JOIN users u ON a.applicant_user_id = u.user_id
                LEFT JOIN project_role_opening pro ON a.opening_id = pro.opening_id
                WHERE pro.project_id = ?
            `, [projectId]);
            
            applicants = extractRows(appResult);
        }

        res.render('project_detail', { 
            project: project, 
            roles: project.roles || [], 
            appliedOpeningIds: appliedOpeningIds, 
            applicants: applicants, 
            loggedInUserId: userId 
        });

    } catch (error) {
        console.error("Error in getProjectDetails:", error);
        res.status(500).send("Error loading project details");
    }
};

const showCreateProjectForm = (req, res) => {
    res.render('create_project');
};

const createProject = async (req, res) => {
    try {
        const projectData = req.body.title ? req.body : req.body.projectData;
        const ownerUserId = req.session.uid;
        
        await Project.create(projectData, ownerUserId);
        res.redirect('/projects');
    } catch (error) {
        console.error("CRITICAL ERROR PUBLISHING PROJECT:", error);
        res.status(500).send("Server Error while publishing project.");
    }
};

const postApply = async (req, res) => {
    try {
        const userId = req.session.uid;
        const { opening_id } = req.body; 

        if (!userId) return res.status(401).send("You must be logged in.");
        if (!opening_id) return res.status(400).send("No opening ID sent.");

        // Check if applied (NO brackets here either!)
        const checkResult = await db.query(
            `SELECT * FROM application WHERE opening_id = ? AND applicant_user_id = ?`, 
            [opening_id, userId]
        );
        
        const existingRows = Array.isArray(checkResult) && Array.isArray(checkResult[0]) ? checkResult[0] : (Array.isArray(checkResult) ? checkResult : []);

        if (existingRows.length > 0) {
            return res.redirect('back'); // Block double-applications
        }

        // Insert the application
        await db.query(`
            INSERT INTO application (opening_id, applicant_user_id, status, message) 
            VALUES (?, ?, 'APPLIED', 'I am very interested in this role!')
        `, [opening_id, userId]);

        res.redirect('back');

    } catch (error) {
        console.error("Apply Error:", error);
        res.status(500).send("Error applying.");
    }
};

// 1. Mark the project as completed
const markProjectComplete = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.uid;

        console.log("\n=== 🏁 MARK COMPLETE BUTTON CLICKED ===");
        console.log(`Attempting to complete Project ID: ${projectId} for User ID: ${userId}`);

        const sql = `UPDATE project SET status = 'completed' WHERE project_id = ? AND owner_user_id = ?`;
        
        // THE FIX: Removed the [] brackets around result!
        const result = await db.query(sql, [projectId, userId]);
        
        console.log("Database Update Result:", result);
        console.log("=======================================\n");

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("\n❌ ERROR MARKING PROJECT COMPLETE:", error);
        res.status(500).send("Error completing project");
    }
};

// 2. Submit a 3-part professional review
const submitReview = async (req, res) => {
    try {
        const reviewerId = req.session.uid; // The person logged in writing the review
        
        // Grab all custom fields from the form!
        const { revieweeId, projectId, punctuality_rating, behavior_rating, skill_rating, comment } = req.body;

        const sql = `
            INSERT INTO review (project_id, reviewer_user_id, reviewee_user_id, punctuality_rating, behavior_rating, skill_rating, comment) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sql, [projectId, reviewerId, revieweeId, punctuality_rating, behavior_rating, skill_rating, comment]);

        // Redirect to the actor's profile so they can see the new review!
        res.redirect(`/user/${revieweeId}`); 

    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).send("Error saving review");
    }
};


// ==========================================
// 3. HIRE APPLICANT
// ==========================================
const hireApplicant = async (req, res) => {
    try {
        console.log("\n=== 🤝 HIRE BUTTON CLICKED ===");
        console.log("Data received from button:", req.body);
        
        const { applicationId, projectId } = req.body;

        // Security Guard: Check if the IDs actually made it to the server
        if (!applicationId || !projectId) {
            console.log("❌ CRITICAL: The button forgot to send the IDs!");
            return res.status(400).send("Missing data from the button! Check your terminal.");
        }

        const sql = `UPDATE application SET status = 'Hired' WHERE application_id = ?`;
        console.log(`Executing SQL: [${sql}] with Application ID: ${applicationId}`);
        
        // Run the update
        await db.query(sql, [applicationId]);
        
        console.log("✅ Success! Redirecting back to project...");
        console.log("================================\n");

        res.redirect(`/project/${projectId}`);
        
    } catch (error) {
        // This prints the EXACT database error to your terminal
        console.error("\n❌ DATABASE CRASH IN HIRE APPLICANT:");
        console.error(error);
        console.error("====================================\n");
        res.status(500).send("Error hiring applicant");
    }
};

module.exports = {
    getProjectsFeed,
    getProjectDetails,
    showCreateProjectForm,
    createProject,
    postApply,
    markProjectComplete,
    submitReview,
    hireApplicant
};