const express = require("express");
const path = require("path");
const session = require("express-session");
const multer = require('multer');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(session({
    secret: 'secretkeysdfjsflyoifasd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ==========================================
// --- GLOBAL TEMPLATE VARIABLES ---
// ==========================================
// Attaches session status to all Pug templates automatically
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.userId = req.session.uid || null;
    next();
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const projectController = require('./controllers/ProjectController');
const userController = require('./controllers/UserController');
const { requireAuth } = require('./middleware/auth'); // Import security middleware


// Configure local file storage for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This forces Docker to use the exact folder next to app.js
    cb(null, path.join(__dirname, 'public', 'uploads')); 
  },
  filename: function (req, file, cb) {
    cb(null, 'user-' + req.session.uid + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==========================================
// --- ROUTES ---
// ==========================================

app.get("/", function(req, res) { res.render("index"); });

app.get('/talents', userController.getTalentsFeed);
app.get('/user/:id', userController.getPublicProfile);
app.get('/projects', projectController.getProjectsFeed);
app.get('/project/:id', projectController.getProjectDetails);

app.get('/register', userController.getRegister);
app.post('/register', userController.postRegister);
app.post('/project/:id/complete', projectController.markProjectComplete);
app.post('/reviews/add', projectController.submitReview);
app.post('/hire-applicant', projectController.hireApplicant);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout); // Logout route

// ==========================================
// --- PROTECTED ROUTES ---
// ==========================================
// requireAuth intercepts these requests to ensure the user is logged in
app.get('/my-profile', requireAuth, userController.getMyProfile);
app.get('/edit-profile', requireAuth, userController.getEditProfile);


// THE FIX: upload.single() is now intercepting the file right here!
app.post('/edit-profile', requireAuth, upload.single('profile_picture'), userController.postEditProfile);

app.get('/create_project', requireAuth, projectController.showCreateProjectForm);
app.post('/publish-project', requireAuth, projectController.createProject);

app.get('/verify-otp', userController.getVerifyOtp);
app.post('/verify-otp', userController.postVerifyOtp);

app.post('/apply', requireAuth, projectController.postApply);


app.listen(3000, '0.0.0.0', function(){
    console.log(`FirstTake server running at http://localhost:3000/`);
});