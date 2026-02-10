/**
 * INDUSTRY STANDARD MIDDLEWARE EXAMPLE
 * Scenario: A protected route to update user profile.
 */

const express = require('express');
const app = express();

// 1. BUILT-IN MIDDLEWARE
// This is the "Translator". It takes the raw data sent by the user 
// and converts it into a JavaScript object we can use (req.body).
app.use(express.json());

// 2. CUSTOM LOGGING MIDDLEWARE (Application-level)
// Every time a request hits the server, we want to see it in the console.
app.use((req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} request to ${req.url}`);
    
    // next() tells Express: "I'm done logging, go to the next person in line."
    next(); 
});

// 3. AUTHENTICATION MIDDLEWARE (The Security Guard)
// We only want to let people in if they have a valid "token".
const checkAuth = (req, res, next) => {
    const authToken = req.headers['authorization'];

    if (authToken === 'secret-token-123') {
        console.log("Auth Successful");
        next(); // User is allowed! Move to the next middleware or route.
    } else {
        // If we DON'T call next(), the request stops here.
        // We send a response, ending the cycle.
        res.status(403).json({ error: "Unauthorized: You need a token!" });
    }
};

// 4. DATA VALIDATION MIDDLEWARE (The Inspector)
// Checking if the user actually sent the data we need.
const validateUpdate = (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        // We stop the request early because the data is bad.
        return res.status(400).json({ error: "Missing name or email" });
    }

    next(); // Data is good, move forward.
};

// --- THE ACTUAL ROUTE ---
// Notice how we "stack" the middleware. 
// It goes: Auth -> Validation -> Final Logic.
app.put('/api/user/update', checkAuth, validateUpdate, (req, res) => {
    // If we reached here, it means the request is logged, authenticated, and validated!
    console.log("Updating database with:", req.body);
    
    res.json({ message: "Profile updated successfully!" });
});

// 5. ERROR HANDLING MIDDLEWARE (The Safety Net)
// This is unique: it has 4 arguments (err, req, res, next).
// Express knows this is the "emergency exit".
app.use((err, req, res, next) => {
    console.error("SOMETHING CRASHED:", err.stack);
    
    // We send a 500 status so the user knows it's our fault, not theirs.
    res.status(500).json({ error: "Internal Server Error. Our bad!" });
});

app.listen(3000, () => console.log('Server running on port 3000'));