// This file defines all dashboard routes
// Admin and applicant have separate dashboard endpoints
// Each returns data specific to their role

const express = require('express');
const router = express.Router();

// Import middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import dashboard controller functions
const {
  getAdminDashboard,
  getApplicantDashboard,
} = require('../controllers/dashboardController');

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     description: >
 *       Admin only - returns summary statistics including
 *       total users, loan portfolio, approval rates and monthly trends
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data returned successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               dashboard:
 *                 stats:
 *                   totalUsers: 50
 *                   totalApplications: 150
 *                   approvedLoans: 98
 *                   declinedLoans: 52
 *                   totalPortfolio: 45000000
 *                   approvalRate: "65.3"
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/admin', protect, adminOnly, getAdminDashboard);

/**
 * @swagger
 * /api/dashboard/applicant:
 *   get:
 *     summary: Get applicant dashboard data
 *     description: >
 *       Returns the logged in applicant's personal dashboard
 *       including their loan history and statistics
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applicant dashboard data returned successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               dashboard:
 *                 stats:
 *                   totalApplications: 3
 *                   approvedLoans: 2
 *                   declinedLoans: 1
 *                   totalBorrowed: 700000
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/applicant', protect, getApplicantDashboard);

module.exports = router;