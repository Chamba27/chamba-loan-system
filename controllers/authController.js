// This controller handles all authentication logic
// Registration, Login, Google Sign In, and getting current user
// Think of it as the security desk of our building

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ── HELPER FUNCTION ───────────────────────────────────────────
// Generates a JWT token for a user
// We call this after registration and login
const generateToken = (userId, role) => {
  return jwt.sign(
    // Payload - data stored inside the token
    { userId, role },
    // Secret key - used to sign the token
    process.env.JWT_SECRET,
    // Options - when the token expires
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// ── REGISTER ──────────────────────────────────────────────────
// Handles POST /api/auth/register
// Creates a new user account
const register = async (req, res) => {
  try {

    // STEP 1: Extract data from request body
    const { fullName, email, phone, nationalId, password } = req.body;

    // STEP 2: Validate all fields are provided
    if (!fullName || !email || !phone || !nationalId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // STEP 3: Check if email already exists
    // We never want two accounts with same email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    // STEP 4: Check if national ID already exists
    const nationalIdExists = await User.findOne({ nationalId });
    if (nationalIdExists) {
      return res.status(400).json({
        success: false,
        error: 'An account with this national ID already exists'
      });
    }

    // STEP 5: Create the new user
    // Password gets encrypted automatically by our pre-save hook
    const user = await User.create({
      fullName,
      email,
      phone,
      nationalId,
      password,
      role: 'applicant', // everyone starts as applicant
    });

    // STEP 6: Generate JWT token for the new user
    const token = generateToken(user._id, user.role);

    // STEP 7: Send response with token and user details
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id:         user._id,
        fullName:   user.fullName,
        email:      user.email,
        phone:      user.phone,
        nationalId: user.nationalId,
        role:       user.role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
// Handles POST /api/auth/login
// Logs in an existing user
const login = async (req, res) => {
  try {

    // STEP 1: Extract email and password
    const { email, password } = req.body;

    // STEP 2: Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // STEP 3: Find user by email
    // .select('+password') includes password field
    // We excluded it by default for security
    const user = await User.findOne({ email });

    // STEP 4: Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // STEP 5: Check if password matches
    // Uses our custom matchPassword method from User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // STEP 6: Generate JWT token
    const token = generateToken(user._id, user.role);

    // STEP 7: Send response
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id:         user._id,
        fullName:   user.fullName,
        email:      user.email,
        phone:      user.phone,
        nationalId: user.nationalId,
        role:       user.role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GET CURRENT USER ──────────────────────────────────────────
// Handles GET /api/auth/me
// Returns the currently logged in user's details
// This route is protected - only logged in users can access it
const getMe = async (req, res) => {
  try {

    // req.user is set by our auth middleware
    // It contains the logged in user's data
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id:         user._id,
        fullName:   user.fullName,
        email:      user.email,
        phone:      user.phone,
        nationalId: user.nationalId,
        role:       user.role,
        isVerified: user.isVerified,
        createdAt:  user.createdAt,
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GOOGLE AUTH CALLBACK ───────────────────────────────────────
// This runs after Google verifies the user
// Passport has already found or created the user
// We just need to generate a JWT token and redirect to frontend
const googleCallback = async (req, res) => {
  try {

    // req.user is set by Passport after successful Google login
    const user = req.user;

    // Generate JWT token for this user
    const token = generateToken(user._id, user.role);

    // Redirect to frontend with token in URL
    // Frontend will extract the token and store it
    res.redirect(
      `${process.env.CLIENT_URL}/auth/google/success?token=${token}&role=${user.role}`
    );

  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/google/failed`);
  }
};

// ── GOOGLE AUTH FAILURE ───────────────────────────────────────
// This runs if Google login fails for any reason
const googleAuthFailed = (req, res) => {
  return res.status(401).json({
    success: false,
    error: 'Google authentication failed. Please try again.'
  });
};



// Export all functions
module.exports = {
  register,
  login,
  getMe,
  googleCallback,
  googleAuthFailed,
};