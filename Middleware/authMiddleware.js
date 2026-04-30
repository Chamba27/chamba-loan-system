// This middleware protects our routes
// It runs before every protected endpoint
// Think of it as the security guard checking JWT tokens

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── PROTECT MIDDLEWARE ────────────────────────────────────────
// This checks if the user is logged in
// Add this to any route that requires authentication
const protect = async (req, res, next) => {
  try {

    let token;

    // STEP 1: Check if token exists in request headers
    // Tokens are sent in the Authorization header like this:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract just the token part after "Bearer "
      token = req.headers.authorization.split(' ')[1];
    }

    // STEP 2: If no token found block the request
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized. Please login first.'
      });
    }

    // STEP 3: Verify the token is valid and not expired
    // jwt.verify throws an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // STEP 4: Attach user info to the request object
    // Now any controller after this middleware can access req.user
    // This is how getMe knows which user is asking!
    req.user = decoded;

    // STEP 5: Call next() to pass control to the next middleware or controller
    // Without next() the request would hang forever!
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized. Token is invalid or expired.'
    });
  }
};

// ── ADMIN MIDDLEWARE ──────────────────────────────────────────
// This checks if the logged in user is an admin
// Always use AFTER protect middleware
// Usage: router.get('/admin/users', protect, adminOnly, getUsers)
const adminOnly = (req, res, next) => {

  // req.user was set by protect middleware above
  if (req.user && req.user.role === 'admin') {
    // User is admin - allow through
    next();
  } else {
    // User is not admin - block
    return res.status(403).json({
      success: false,
      error: 'Not authorized. Admin access required.'
    });
  }
};

// Export both middleware functions
module.exports = { protect, adminOnly };