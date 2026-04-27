// Intercepts requests and verifies session authentication status
const requireAuth = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
        // Authentication verified; proceed to the requested route
        next();
    } else {
        // Unauthenticated access attempt; redirect to login page
        res.redirect('/login');
    }
};

module.exports = { requireAuth };