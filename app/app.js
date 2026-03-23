// Import express.js
const express = require("express");

// 1. Create express app FIRST (This fixes the fatal crash!)
var app = express();

// 2. Tell Express to use the 'public' folder for static files like CSS and images
app.use(express.static('public'));
app.use(express.static("static")); // Keeping your university scaffolding static folder

// 3. Use the Pug templating engine and set the correct views folder
app.set('view engine', 'pug');
app.set('views', './views'); // FIXED: Changed from './app/views' to './views'

// 4. Get the models and database services (From your scaffolding)
const { Student } = require("./models/student");
const db = require('./services/db');


// --- YOUR UNIVERSITY SCAFFOLDING ROUTES ---

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});

// Task 1 JSON formatted listing of students
app.get("/all-students", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });
});

// Task 2 display a formatted list of students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
        res.render('all-students', {data: results});
    });
});

// Task 3 single student page
app.get("/student-single/:id", async function (req, res) {
    var stId = req.params.id;
    var student = new Student(stId);
    await student.getStudentName();
    console.log(student);
    res.send(student);
});

app.get("/single-student/:id", async function (req, res) {
    var stId = req.params.id;
    var student = new Student(stId);
    await student.getStudentName();
    res.render('student', {student:student});
});

// JSON output of all programmes
app.get("/all-programmes", function(req, res) {
    var sql = 'select * from Programmes';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });
});

// Single programme page (no formatting or template)
app.get("/programme-single/:id", async function (req, res) {
    var pCode = req.params.id;
    var pSql = "SELECT * FROM Programmes WHERE id = ?";
    var results = await db.query(pSql, [pCode]);
    var modSql = "SELECT * FROM Programme_Modules pm JOIN Modules m on m.code = pm.module WHERE programme = ?";
    var modResults = await db.query(modSql, [pCode]);
    res.send(JSON.stringify(results) + JSON.stringify(modResults));  
});

// Create a route for testing the db
app.get("/sd2-db", function(req, res) {
    var sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });
});

app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

app.get("/hello/:name", function(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});


// --- YOUR NEW SPRINT 3 FRONTEND ROUTE ---

// Route for the Talents (Users List) Page
app.get('/talents', (req, res) => {
    // We pass dummy data here so your PUG file has something to display!
    const dummyUsers = [
        { name: 'Olivia', role: 'Aspiring Actor', location: 'London' },
        { name: 'Alex', role: 'Director', location: 'UK' }
    ];
    res.render('talents', { users: dummyUsers }); 
});
// Route for the Project Listing Page (The Feed)
app.get('/projects', (req, res) => {
    // Dummy data for film projects
    const dummyProjects = [
        { title: 'Weekend Horror Short', director: 'Alex', genre: 'Horror', lookingFor: 'Cinematographer, Sound Engineer' },
        { title: 'Neon Nights', director: 'Marcus', genre: 'Sci-Fi', lookingFor: 'Lead Actor, Editor' }
    ];
    
    // Render the 'projects.pug' file and pass the data
    res.render('projects', { projects: dummyProjects });
});
// Route for the Project Detail Page
app.get('/project/weekend-horror', (req, res) => {
    // Dummy data for one specific project and its roles
    const projectDetail = {
        title: 'Weekend Horror Short',
        director: 'Alex',
        description: 'Shooting a short horror film in London over a weekend. No budget, but food and travel will be provided. Requires a cinematographer with their own RED camera setup or similar.',
        roles: [
            { title: 'Cinematographer', requirements: 'Own camera equipment', applicants: 1 },
            { title: 'Sound Engineer', requirements: 'Boom mic & recorder', applicants: 5 } // This one should trigger your Anti-Crash logic!
        ]
    };
    
    res.render('project-detail', { project: projectDetail });
});
// Route for the User Profile Page
app.get('/profile', (req, res) => {
    // Dummy data for Olivia's profile based on your Sprint 2 wireframes
    const myProfile = {
        name: 'Olivia',
        primaryRole: 'Aspiring Actor',
        location: 'London, UK',
        bio: 'I have a day job in the retail industry but desire to establish my acting showreel. I am looking for serious student work which will actually be completed.',
        roles: ['Director', 'Actor/Talent'], // Multi-Hyphenate Badges!
        collaborations: [
            { title: 'The Coffee Shop (Student Film)', role: 'Supporting Actor', status: 'Completed', rating: '★★★★☆' }
        ]
    };
    
    res.render('profile', { profile: myProfile });
});
// --- START SERVER ---

// Start server on port 3000 (Using '0.0.0.0' so Docker allows the connection)
app.listen(3000, '0.0.0.0', function(){
    console.log(`Server running at http://localhost:3000/`);
});