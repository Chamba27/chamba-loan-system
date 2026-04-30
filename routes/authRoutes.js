// This file defines all authentication routes
// It connects URLs to their controller functions
// It also contains Swagger documentation for each endpoint

const express = require('express');
const router = express.Router();

// Import auth controller functions
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

// Import auth middleware
// protect - checks if user is logged in
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phone
 *         - nationalId
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: Jester Chamba
 *         email:
 *           type: string
 *           example: jester@chamba.com
 *         phone:
 *           type: string
 *           example: "+265991234567"
 *         nationalId:
 *           type: string
 *           example: NAT001
 *         password:
 *           type: string
 *           example: password123
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: jester@chamba.com
 *         password:
 *           type: string
 *           example: password123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: >
 *       Creates a new applicant account.
 *       Password is automatically encrypted before saving.
 *       Returns a JWT token on success.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing fields or duplicate email/nationalId
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to existing account
 *     description: >
 *       Logs in with email and password.
 *       Returns a JWT token to use for protected endpoints.
 *       Include token in Authorization header as - Bearer your-token-here
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     description: >
 *       Returns the profile of the currently logged in user.
 *       Requires a valid JWT token in the Authorization header.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Not authorized. Please login first.
 *       500:
 *         description: Internal server error
 */
router.get('/me', protect, getMe);

module.exports = router;