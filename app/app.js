// Import required Node.js modules
const express = require("express");
const path = require("path");

// Initialize express application
const app = express();

// Configure static files directory and body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 

// Configure the Pug templating engine and set the views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// --- IMPORT CONTROLLERS (MVC) ---
// ==========================================
// These files now handle all the complex logic and database calls
const projectController = require('./controllers/ProjectController');
const userController = require('./controllers/UserController');

// ==========================================
// --- ROUTES ---
// ==========================================

// 1. Landing Page (No database logic, so it stays simple)
app.get("/", function(req, res) {
    res.render("index");
});

// 2. Talents & User Routes
app.get('/talents', userController.getTalentsFeed);
app.get('/user/:id', userController.getUserProfile);

// 3. Project Routes
app.get('/projects', projectController.getProjectsFeed);
app.get('/project/:id', projectController.getProjectDetails);

// 4. Project Creation Routes
app.get('/create_project', projectController.showCreateProjectForm);
app.post('/publish-project', projectController.createProject);

// ==========================================
// --- START SERVER ---
// ==========================================
app.listen(3000, '0.0.0.0', function(){
    console.log(`FirstTake server running at http://localhost:3000/`);
});