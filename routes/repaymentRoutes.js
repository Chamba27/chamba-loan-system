// This file defines all repayment routes
// Handles payment scheduling and Paychangu integration

const express = require('express');
const router = express.Router();

// Import middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import all repayment controller functions
const {
  generateRepaymentSchedule,
  getMyRepayments,
  getRepaymentsByLoan,
  initiatePayment,
  paychanguWebhook,
  getAllRepayments,
} = require('../controllers/repaymentController');

/**
 * @swagger
 * /api/repayments/me:
 *   get:
 *     summary: Get my repayments
 *     description: Returns all repayments for the logged in user
 *     tags:
 *       - Repayments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Repayments returned successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/me', protect, getMyRepayments);

/**
 * @swagger
 * /api/repayments/loan/{loanId}:
 *   get:
 *     summary: Get repayments by loan
 *     description: Returns all repayments for a specific loan
 *     tags:
 *       - Repayments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         description: MongoDB ID of the loan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repayments returned successfully
 *       404:
 *         description: No repayments found
 *       500:
 *         description: Internal server error
 */
router.get('/loan/:loanId', protect, getRepaymentsByLoan);

/**
 * @swagger
 * /api/repayments/generate/{loanId}:
 *   post:
 *     summary: Generate repayment schedule
 *     description: >
 *       Generates monthly repayment schedule for an approved loan.
 *       Creates one repayment document per month.
 *     tags:
 *       - Repayments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         description: MongoDB ID of the approved loan
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Repayment schedule generated successfully
 *       400:
 *         description: Loan not approved or schedule already exists
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.post('/generate/:loanId', protect, generateRepaymentSchedule);

/**
 * @swagger
 * /api/repayments/initiate:
 *   post:
 *     summary: Initiate a payment via Paychangu
 *     description: >
 *       Creates a Paychangu payment request for a repayment.
 *       Returns a checkout URL where the user completes payment.
 *     tags:
 *       - Repayments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - repaymentId
 *             properties:
 *               repaymentId:
 *                 type: string
 *                 description: MongoDB ID of the repayment to pay
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               checkoutUrl: "https://paychangu.com/checkout/xxx"
 *               paymentReference: "CHAMBA-xxx-1234567890"
 *       400:
 *         description: Already paid or payment failed
 *       404:
 *         description: Repayment not found
 *       500:
 *         description: Internal server error
 */
router.post('/initiate', protect, initiatePayment);

/**
 * @swagger
 * /api/repayments/webhook:
 *   post:
 *     summary: Paychangu webhook
 *     description: >
 *       This endpoint is called by Paychangu servers after payment.
 *       NOT meant to be called by frontend directly.
 *       Marks repayment as paid when Paychangu confirms payment.
 *     tags:
 *       - Repayments
 *     responses:
 *       200:
 *         description: Webhook received
 *       500:
 *         description: Internal server error
 */
// No auth middleware on webhook!
// Paychangu calls this directly - it doesn't have our JWT token
router.post('/webhook', paychanguWebhook);

/**
 * @swagger
 * /api/repayments:
 *   get:
 *     summary: Get all repayments
 *     description: Admin only - returns all repayments in the system
 *     tags:
 *       - Repayments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All repayments returned successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, adminOnly, getAllRepayments);

module.exports = router;