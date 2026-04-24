const Project = require('../models/Project');

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
        const project = await Project.getById(req.params.id);
        if (!project) return res.status(404).send("Project not found");
        
        res.render('project_detail', { project: project, roles: project.roles });
    } catch (error) {
        console.error("Database error on Project Details:", error);
        res.status(500).send("Server Error loading project details.");
    }
};

const showCreateProjectForm = (req, res) => {
    res.render('create_project');
};

const createProject = async (req, res) => {
    try {
        const projectData = req.body.title ? req.body : req.body.projectData;
        const ownerUserId = 2; // MVP placeholder
        
        await Project.create(projectData, ownerUserId);
        res.redirect('/projects');
    } catch (error) {
        console.error("CRITICAL ERROR PUBLISHING PROJECT:", error);
        res.status(500).send("Server Error while publishing project.");
    }
};

module.exports = {
    getProjectsFeed,
    getProjectDetails,
    showCreateProjectForm,
    createProject
};