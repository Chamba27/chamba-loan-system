// This file defines all routes for our loan API
// It also contains Swagger documentation comments for each endpoint

const express = require('express');
const router = express.Router();
// Import auth middleware to protect our routes
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import all four controller functions
const {
  applyForLoan,
  getAllLoans,
  getLoanById,
  getLoansByNationalId,
} = require('../controllers/loanController');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoanApplication:
 *       type: object
 *       required:
 *         - nationalId
 *         - loanAmount
 *         - termMonths
 *       properties:
 *         nationalId:
 *           type: string
 *           example: NAT001
 *         loanAmount:
 *           type: number
 *           example: 500000
 *         termMonths:
 *           type: number
 *           example: 12
 */

/**
 * @swagger
 * /api/loans/apply:
 *   post:
 *     summary: Apply for a loan
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Checks loan eligibility based on salary and credit history.
 *       Rules - Credit score must be 600+, Salary must be 3x monthly repayment,
 *       No active defaults, Maximum 3 active loans.
 *     tags:
 *       - Loans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanApplication'
 *     responses:
 *       200:
 *         description: Loan decision returned successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
// POST /apply - must be logged in to apply
router.post('/apply', protect, applyForLoan);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loan applications
 *     security:
 *       - bearerAuth: []
 *     description: Returns all loan applications stored in the database, newest first
 *     tags:
 *       - Loans
 *     responses:
 *       200:
 *         description: List of all loan applications
 *       500:
 *         description: Internal server error
 */
// GET / - admin only - sees ALL applications
router.get('/', protect, adminOnly, getAllLoans);

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get a loan by ID
 *     description: Returns one specific loan application by its MongoDB ID
 *     tags:
 *       - Loans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the loan application
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Loan application found
 *       404:
 *         description: Loan application not found
 *       500:
 *         description: Internal server error
 */
// GET /:id - must be logged in
router.get('/:id', protect, getLoanById);

/**
 * @swagger
 * /api/loans/applicant/{nationalId}:
 *   get:
 *     summary: Get all loans for a specific applicant
 *     description: Returns all loan applications for one person by their national ID
 *     tags:
 *       - Loans
 *     parameters:
 *       - in: path
 *         name: nationalId
 *         required: true
 *         description: The national ID of the applicant
 *         schema:
 *           type: string
 *           example: NAT001
 *     responses:
 *       200:
 *         description: List of loans for this applicant
 *       500:
 *         description: Internal server error
 */
// GET /applicant/:nationalId - must be logged in
router.get('/applicant/:nationalId', protect, getLoansByNationalId);

module.exports = router;