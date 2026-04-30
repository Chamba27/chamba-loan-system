// This controller handles all user management functions
// These endpoints are mainly used by the admin
// Think of it as the HR department of our system

const User = require('../models/User');
const Loan = require('../models/Loan');

// ── GET ALL USERS ─────────────────────────────────────────────
// Handles GET /api/users
// Admin only - returns all registered users
const getAllUsers = async (req, res) => {
  try {

    // Find all users and exclude password field
    // We never return passwords even encrypted ones!
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   users.length,
      users,
    });

  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GET USER BY ID ────────────────────────────────────────────
// Handles GET /api/users/:id
// Admin only - returns one specific user with their loan history
const getUserById = async (req, res) => {
  try {

    // Find user by ID and exclude password
    const user = await User.findById(req.params.id).select('-password');

    // If user not found return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Also fetch all loans for this user
    // This gives admin the full picture of the user
    const loans = await Loan.find({ userId: req.params.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user,
      loans,
      totalLoans: loans.length,
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── UPDATE USER ───────────────────────────────────────────────
// Handles PUT /api/users/:id
// Admin only - update user details or role
const updateUser = async (req, res) => {
  try {

    // Fields admin is allowed to update
    // We never allow password update from here - that's a separate flow
    const { fullName, phone, role, isVerified } = req.body;

    // Find and update the user
    // new: true returns the updated document not the old one
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, role, isVerified },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GET MY PROFILE ────────────────────────────────────────────
// Handles GET /api/users/me/profile
// Any logged in user - returns their own profile with loan history
const getMyProfile = async (req, res) => {
  try {

    // Get logged in user from JWT token
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get all loans for this user
    const loans = await Loan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    // Calculate some stats for the profile
    const approvedLoans  = loans.filter(loan => loan.approved === true).length;
    const declinedLoans  = loans.filter(loan => loan.approved === false).length;
    const totalBorrowed  = loans
      .filter(loan => loan.approved === true)
      .reduce((sum, loan) => sum + loan.loanAmount, 0);

    return res.status(200).json({
      success: true,
      user,
      loanStats: {
        totalApplications: loans.length,
        approved:          approvedLoans,
        declined:          declinedLoans,
        totalBorrowed,
      },
      recentLoans: loans.slice(0, 5), // last 5 loans only
    });

  } catch (error) {
    console.error('Get my profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── UPDATE MY PROFILE ─────────────────────────────────────────
// Handles PUT /api/users/me/profile
// Any logged in user - update their own profile
const updateMyProfile = async (req, res) => {
  try {

    // Users can only update these fields on their own profile
    // They cannot change their own role!
    const { fullName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone },
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// Export all functions
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  getMyProfile,
  updateMyProfile,
};