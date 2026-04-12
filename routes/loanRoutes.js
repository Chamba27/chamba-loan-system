// This file defines all the routes (endpoints) for our loan API
// It also contains special Swagger comments that generate our documentation
// These special comments start with /** and are called JSDoc comments

const express = require('express');
const router = express.Router();
const { applyForLoan } = require('../controllers/loanController');

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
 *           description: The applicant's national ID
 *           example: NAT001
 *         loanAmount:
 *           type: number
 *           description: The amount of loan requested in MK
 *           example: 500000
 *         termMonths:
 *           type: number
 *           description: The loan repayment period in months
 *           example: 12
 *     LoanDecision:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         decision:
 *           type: object
 *           properties:
 *             approved:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Congratulations! Your loan application has been approved
 *             monthlyRepayment:
 *               type: string
 *               example: "41666.67"
 */

/**
 * @swagger
 * /api/loans/apply:
 *   post:
 *     summary: Apply for a loan
 *     description: >
 *       Checks loan eligibility based on the following rules -
 *       Credit score must be 600 or above,
 *       Monthly salary must be at least 3x the monthly repayment,
 *       No active defaults,
 *       Maximum 3 active loans.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoanDecision'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Please provide nationalId, loanAmount and termMonths
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Something went wrong. Please try again later.
 */

// POST /api/loans/apply - handles loan applications
router.post('/apply', applyForLoan);

module.exports = router;