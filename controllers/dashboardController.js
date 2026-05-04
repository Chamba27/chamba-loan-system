// This controller handles dashboard data for both admin and applicant
// It aggregates and summarizes data from MongoDB
// Think of it as the reporting department of our system

const Loan = require('../models/Loan');
const User = require('../models/User');

// ── ADMIN DASHBOARD ───────────────────────────────────────────
// Handles GET /api/dashboard/admin
// Returns summary statistics for the admin dashboard
const getAdminDashboard = async (req, res) => {
  try {

    // Count total users registered
    const totalUsers = await User.countDocuments({ role: 'applicant' });

    // Count total loan applications
    const totalApplications = await Loan.countDocuments();

    // Count approved loans
    const approvedLoans = await Loan.countDocuments({ approved: true });

    // Count declined loans
    const declinedLoans = await Loan.countDocuments({ approved: false });

    // Calculate total loan portfolio
    // This adds up all approved loan amounts
    const portfolioResult = await Loan.aggregate([
      // Only include approved loans
      { $match: { approved: true } },
      // Add up all loan amounts
      { $group: {
        _id:          null,
        totalAmount:  { $sum: '$loanAmount' },
        averageAmount: { $avg: '$loanAmount' },
      }}
    ]);

    // Extract portfolio values or default to 0
    const totalPortfolio  = portfolioResult[0]?.totalAmount  || 0;
    const averageLoanSize = portfolioResult[0]?.averageAmount || 0;

    // Get recent applications - last 5
    const recentApplications = await Loan.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
            path:   'userId',
            select: 'fullName email',
            // If userId doesn't exist don't crash
            options: { strictPopulate: false }
  });

    // Get monthly application stats for chart
    // Groups loans by month and counts them
    const monthlyStats = await Loan.aggregate([
      {
        $group: {
          // Group by year and month
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total:    { $sum: 1 },
          approved: { $sum: { $cond: ['$approved', 1, 0] } },
          declined: { $sum: { $cond: ['$approved', 0, 1] } },
        }
      },
      // Sort by most recent month first
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      // Only last 6 months
      { $limit: 6 }
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalUsers,
          totalApplications,
          approvedLoans,
          declinedLoans,
          totalPortfolio,
          averageLoanSize,
          // Approval rate as percentage
          approvalRate: totalApplications > 0
            ? ((approvedLoans / totalApplications) * 100).toFixed(1)
            : 0,
        },
        recentApplications,
        monthlyStats,
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── APPLICANT DASHBOARD ───────────────────────────────────────
// Handles GET /api/dashboard/applicant
// Returns summary for the logged in applicant
const getApplicantDashboard = async (req, res) => {
  try {

    // Get logged in user's ID from JWT token
    const userId = req.user.userId;

    // Get user details
    const user = await User.findById(userId).select('-password');

    // Get all loans for this user
    const allLoans = await Loan.find({ userId }).sort({ createdAt: -1 });

    // Calculate stats
    const totalApplications = allLoans.length;
    const approvedLoans      = allLoans.filter(l => l.approved === true);
    const declinedLoans      = allLoans.filter(l => l.approved === false);

    // Calculate total amount borrowed
    const totalBorrowed = approvedLoans.reduce(
      (sum, loan) => sum + loan.loanAmount, 0
    );

    // Calculate total monthly repayments
    const totalMonthlyRepayments = approvedLoans.reduce(
      (sum, loan) => sum + (loan.monthlyRepayment || 0), 0
    );

    // Get most recent application
    const latestApplication = allLoans[0] || null;

    // Get recent 5 applications
    const recentApplications = allLoans.slice(0, 5);

    return res.status(200).json({
      success: true,
      dashboard: {
        user,
        stats: {
          totalApplications,
          approvedLoans:         approvedLoans.length,
          declinedLoans:         declinedLoans.length,
          totalBorrowed,
          totalMonthlyRepayments,
        },
        latestApplication,
        recentApplications,
      }
    });

  } catch (error) {
    console.error('Applicant dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// Export both functions
module.exports = {
  getAdminDashboard,
  getApplicantDashboard,
};