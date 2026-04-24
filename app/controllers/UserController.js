const User = require('../models/User');
const Project = require('../models/Project');

const getTalentsFeed = async (req, res) => {
    try {
        const users = await User.getAll();
        res.render('talents', { users: users });
    } catch (error) {
        console.error("Error loading talents:", error);
        res.status(500).send("Error loading talents.");
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.getById(userId);
        
        if (!user) return res.status(404).send("User not found.");

        const userProjects = await Project.getByUserId(userId);
        res.render('profile', { user: user, projects: userProjects });
    } catch (error) {
        console.error("Database error on User Profile:", error);
        res.status(500).send("Server Error loading profile.");
    }
};

module.exports = {
    getTalentsFeed,
    getUserProfile
};