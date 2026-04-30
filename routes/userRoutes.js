// This file defines all user management routes
// Some are for admin only, some for any logged in user

const express = require('express');
const router = express.Router();

// Import middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import all user controller functions
const {
  getAllUsers,
  getUserById,
  updateUser,
  getMyProfile,
  updateMyProfile,
} = require('../controllers/userController');

/**
 * @swagger
 * /api/users/me/profile:
 *   get:
 *     summary: Get my profile
 *     description: Returns the logged in user's profile with loan statistics
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile returned successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/me/profile', protect, getMyProfile);

/**
 * @swagger
 * /api/users/me/profile:
 *   put:
 *     summary: Update my profile
 *     description: Update the logged in user's own profile details
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jester Chamba
 *               phone:
 *                 type: string
 *                 example: "+265991234567"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.put('/me/profile', protect, updateMyProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Admin only - returns all registered users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Admin only - returns one user with their loan history
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, adminOnly, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Admin only - update user details or role
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [applicant, admin]
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, adminOnly, updateUser);

module.exports = router;