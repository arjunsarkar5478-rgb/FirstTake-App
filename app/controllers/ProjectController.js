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
        const userId = req.session.uid; // Get the logged-in user

        // 1. Get the project and roles (This is your existing code)
        const project = await Project.getById(projectId);
        if (!project) return res.status(404).send("Project not found");

        // 2. THE NEW FIX: Check which roles THIS user has applied to
        let appliedOpeningIds = [];
        if (userId) {
            // Get all applications for this user
            const appliedSql = `SELECT opening_id FROM application WHERE applicant_user_id = ?`;
            
            // FIX 1: Removed the [ ] brackets around appliedRows!
            const appliedRows = await db.query(appliedSql, [userId]);
            
            // FIX 2: Added a safety net (appliedRows || []) just in case it returns null
            appliedOpeningIds = (appliedRows || []).map(row => row.opening_id); 
        }

        // 3. Send that array to the Pug file!
        res.render('project_detail', { 
            project: project, 
            roles: project.roles, 
            appliedOpeningIds: appliedOpeningIds // <-- Pass the array here
        });
    } catch (error) {
        console.error("Error loading project:", error);
        res.status(500).send("Server Error.");
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
        // Grab the data from the form
        const openingId = Number(req.body.opening_id);
        const userId = req.session.uid; // (Adjust this if your user ID variable is named differently)
        const message = req.body.message || "I am very interested in this role!"; 

        // 1. Check if the user already applied to this specific role
        const alreadyApplied = await Application.hasUserApplied(openingId, userId);

        if (alreadyApplied) {
            // If they already applied, stop here and show a polite message (No crash!)
            return res.status(400).send("You have already applied for this role!"); 
        }

        // 2. If it is a new application, save it to the database
        await Application.create(openingId, userId, message);
        
        // 3. THE MVP FINISH LINE: Redirect them back to the projects page safely!
        res.redirect('/projects'); 

    } catch (error) {
        // If something completely unexpected happens, log it and show a safe error
        console.error("Application Error:", error);
        res.status(500).send("Server Error submitting application.");
    }
};

module.exports = {
    getProjectsFeed,
    getProjectDetails,
    showCreateProjectForm,
    createProject,
    postApply
};