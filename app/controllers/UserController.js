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

// Render the forms
const getRegister = (req, res) => res.render('register');
const getLogin = (req, res) => res.render('login');

// Process Registration
const bcrypt = require('bcrypt');


// 1. Handle Initial Registration Submission
const postRegister = async (req, res) => {
    try {
        const { full_name, email, password, roles, phone } = req.body;
        
        // Generate a random 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash the password now
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // STORE DATA TEMPORARILY IN SESSION (Do not hit DB yet!)
        req.session.pendingUser = {
           full_name, email, password: hashedPassword, roles, phone, otpCode
        };

        // SIMULATE SENDING SMS:
        console.log(`\n=========================================`);
        console.log(`📱 SMS SENT TO ${phone}: Your FirstTake code is ${otpCode}`);
        console.log(`=========================================\n`);
        
        res.redirect('/verify-otp');
    } catch (error) {

        console.error("REGISTRATION CRASH LOG:", error);
        res.status(500).send("Error starting registration");
    }
};

// 2. Show the OTP Screen
const getVerifyOtp = (req, res) => {
    if (!req.session.pendingUser) return res.redirect('/register');
    res.render('verify_otp');
};

// 3. Process the OTP
const postVerifyOtp = async (req, res) => {
    try {
        const enteredOtp = req.body.otp;
        const pendingUser = req.session.pendingUser;

        if (!pendingUser) return res.redirect('/register');

        // Check if the code matches!
        if (enteredOtp === pendingUser.otpCode) {
            // SUCCESS! Now we actually save them to the database
            const userId = await User.create(
                pendingUser.full_name, 
                pendingUser.email, 
                pendingUser.password, 
                pendingUser.roles, 
                pendingUser.phone
            );

            // Log them in
            req.session.uid = userId;
            req.session.loggedIn = true;
            
            // Clear the temporary data
            delete req.session.pendingUser; 

            res.redirect('/');
        } else {
            // Failed OTP
            res.send("<h1>Invalid OTP Code. Please try again.</h1><a href='/verify-otp'>Go Back</a>");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error verifying account");
    }
};

// Process Login
const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Call new static authenticate method
        const loggedInUser = await User.authenticate(email, password);
        
        if (loggedInUser) {
            // Note: table uses 'user_id', so we save that to the session
            req.session.uid = loggedInUser.user_id; 
            req.session.loggedIn = true;
            
            // Redirect them to the talents feed once logged in!
            res.redirect('/'); 
        } else {
            res.send('Incorrect email or password. Please try again!');
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).send("An error occurred during login.");
    }
};

// Destroys the active session and redirects to the landing page
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).send("Error logging out.");
        }
        res.redirect('/');
    });
};

// Render the logged-in user's profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.getById(req.session.uid);
        res.render('my_profile', { user: user });
    } catch (error) {
        res.status(500).send("Error loading profile");
    }
};

// Render the Edit Profile form
const getEditProfile = async (req, res) => {
    try {
        const user = await User.getById(req.session.uid);
        res.render('edit_profile', { user: user });
    } catch (error) {
        res.status(500).send("Error loading edit page");
    }
};

// Process the Edit Profile form
const postEditProfile = async (req, res) => {
        console.log("--- DEBUG UPLOAD ---");
        console.log("FILE RECEIVED:", req.file);
    try {
        const { bio, location, primary_link, secondary_link } = req.body;
        
        // 1. Update standard text fields
        await User.updateProfile(req.session.uid, bio, location, primary_link, secondary_link);
        
        // 2. Check if a file was uploaded and update the image path
        if (req.file) {
            const imagePath = '/uploads/' + req.file.filename;
            await User.updateProfilePicture(req.session.uid, imagePath);
        }
        
        res.redirect('/my-profile'); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating profile");
    }
};

// Export EVERYTHING so app.js can use it
module.exports = {
    getTalentsFeed,
    getUserProfile,
    getRegister,
    getLogin,
    postRegister,
    postLogin,
    logout,
    getMyProfile,
    getEditProfile,
    postEditProfile,
    postRegister,
    getVerifyOtp,
    postVerifyOtp

};
