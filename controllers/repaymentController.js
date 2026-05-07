// This controller handles all repayment operations
// It generates repayment schedules and processes payments via Paychangu

const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');

// Import email service
const { sendPaymentReceivedEmail } = require('../utils/emailService');

// Import User model
const User = require('../models/User');

// ── GENERATE REPAYMENT SCHEDULE ───────────────────────────────
// Handles POST /api/repayments/generate/:loanId
// Generates monthly repayment schedule when loan is approved
const generateRepaymentSchedule = async (req, res) => {
  try {

    // Find the loan
    const loan = await Loan.findById(req.params.loanId);

    // Check if loan exists
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Check if loan is approved
    if (!loan.approved) {
      return res.status(400).json({
        success: false,
        error: 'Cannot generate schedule for a declined loan'
      });
    }

    // Check if schedule already exists
    const existingSchedule = await Repayment.findOne({ loanId: loan._id });
    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        error: 'Repayment schedule already exists for this loan'
      });
    }

    // Generate repayment schedule
    const repayments = [];
    const startDate = new Date();

    // Create one repayment document per month
    for (let i = 1; i <= loan.termMonths; i++) {

      // Calculate due date for each installment
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      repayments.push({
        loanId:            loan._id,
        // Use loan's userId if available otherwise use logged in user's ID
        userId:            loan.userId || req.user.userId,
        amount:            loan.monthlyRepayment,
        installmentNumber: i,
        totalInstallments: loan.termMonths,
        dueDate,
        status:            'pending',
      });
    }

    // Save all repayments to MongoDB at once
    // insertMany is faster than saving one by one
    const savedRepayments = await Repayment.insertMany(repayments);

    return res.status(201).json({
      success:     true,
      message:     `Generated ${loan.termMonths} repayment installments`,
      totalAmount: loan.monthlyRepayment * loan.termMonths,
      repayments:  savedRepayments,
    });

  } catch (error) {
    console.error('Generate repayment schedule error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GET MY REPAYMENTS ─────────────────────────────────────────
// Handles GET /api/repayments/me
// Returns all repayments for the logged in user
const getMyRepayments = async (req, res) => {
  try {

    const repayments = await Repayment.find({ userId: req.user.userId })
      .populate('loanId', 'loanAmount termMonths nationalId')
      .sort({ dueDate: 1 });

    // Calculate summary stats
    const totalPaid    = repayments.filter(r => r.status === 'paid').length;
    const totalPending = repayments.filter(r => r.status === 'pending').length;
    const totalOverdue = repayments.filter(r => r.status === 'overdue').length;

    // Find next payment due
    const nextPayment = repayments.find(r => r.status === 'pending');

    return res.status(200).json({
      success: true,
      summary: {
        totalInstallments: repayments.length,
        paid:              totalPaid,
        pending:           totalPending,
        overdue:           totalOverdue,
        nextPayment,
      },
      repayments,
    });

  } catch (error) {
    console.error('Get my repayments error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── GET REPAYMENTS BY LOAN ────────────────────────────────────
// Handles GET /api/repayments/loan/:loanId
// Returns all repayments for a specific loan
const getRepaymentsByLoan = async (req, res) => {
  try {

    const repayments = await Repayment.find({
      loanId: req.params.loanId
    }).sort({ installmentNumber: 1 });

    if (!repayments.length) {
      return res.status(404).json({
        success: false,
        error: 'No repayments found for this loan'
      });
    }

    // Calculate how much has been paid so far
    const amountPaid = repayments
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    // Calculate how much is remaining
    const amountRemaining = repayments
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    return res.status(200).json({
      success: true,
      summary: {
        totalInstallments: repayments.length,
        amountPaid,
        amountRemaining,
      },
      repayments,
    });

  } catch (error) {
    console.error('Get repayments by loan error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── INITIATE PAYMENT ──────────────────────────────────────────
// Handles POST /api/repayments/initiate
// Creates a Paychangu payment request for a repayment
const initiatePayment = async (req, res) => {
  try {

    const { repaymentId } = req.body;

    // Find the repayment and populate user and loan details
    const repayment = await Repayment.findById(repaymentId)
      .populate('loanId')
      .populate('userId', 'fullName email phone');

    if (!repayment) {
      return res.status(404).json({
        success: false,
        error: 'Repayment not found'
      });
    }

    // Check if already paid
    if (repayment.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'This repayment has already been paid'
      });
    }

    // Split full name into first and last name
    // Paychangu requires them separately
    const nameParts = repayment.userId.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(' ') || nameParts[0];

    // Generate unique transaction reference
    // tx_ref must be unique for every transaction
    const txRef = `CHAMBA-${repayment._id}-${Date.now()}`;

    // Paychangu payment payload - correct format from their docs
    const paychanguPayload = {
      amount:       repayment.amount,
      currency:     'MWK',
      email:        repayment.userId.email,
      first_name:   firstName,
      last_name:    lastName,
      callback_url: `${process.env.API_URL}/api/repayments/webhook`,
      return_url:   `${process.env.CLIENT_URL}/repayments/cancel`,
      tx_ref:       txRef,
      customization: {
        title:       'Chamba Loan Repayment',
        description: `Installment ${repayment.installmentNumber} of ${repayment.totalInstallments}`,
      },
      meta: {
        repaymentId: repayment._id.toString(),
        loanId:      repayment.loanId._id.toString(),
      }
    };

    // Call Paychangu API
    const paychanguResponse = await fetch(
      'https://api.paychangu.com/payment',
      {
        method:  'POST',
        headers: {
          'Accept':        'application/json',
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        },
        body: JSON.stringify(paychanguPayload),
      }
    );

    const paychanguData = await paychanguResponse.json();

    // If Paychangu returned an error
    if (!paychanguResponse.ok) {
      return res.status(400).json({
        success: false,
        error:   'Payment initiation failed',
        details: paychanguData,
      });
    }

    // Update repayment with payment reference
    repayment.paymentReference = txRef;
    await repayment.save();

    return res.status(200).json({
      success:          true,
      message:          'Payment initiated successfully',
      paymentReference: txRef,
      // Paychangu returns checkout_url inside data object
      checkoutUrl:      paychanguData.data?.checkout_url,
    });

  } catch (error) {
    console.error('Initiate payment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// ── PAYCHANGU WEBHOOK ─────────────────────────────────────────
// Handles POST /api/repayments/webhook
// Paychangu calls this endpoint after payment is completed
// This is NOT called by our frontend - called by Paychangu servers!
const paychanguWebhook = async (req, res) => {
  try {

    const { tx_ref, status, transaction_id, payment_method } = req.body;

    // Find the repayment by payment reference
    const repayment = await Repayment.findOne({
      paymentReference: tx_ref
    });

    if (!repayment) {
      return res.status(404).json({
        success: false,
        error: 'Repayment not found'
      });
    }

    // Update repayment based on Paychangu status
  if (status === 'success') {
  repayment.status        = 'paid';
  repayment.paidDate      = new Date();
  repayment.transactionId = transaction_id;
  repayment.paymentMethod = payment_method;
  await repayment.save();

  // Send payment confirmation email
  const user = await User.findById(repayment.userId);
  if (user) {
    sendPaymentReceivedEmail(user, repayment)
      .catch(err => console.error('Payment email failed:', err));
  }

  console.log(`Payment successful for repayment ${repayment._id}`);
}

    // Always return 200 to Paychangu
    // If we return an error Paychangu will keep retrying!
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true });
  }
};

// ── GET ALL REPAYMENTS (ADMIN) ────────────────────────────────
// Handles GET /api/repayments
// Admin only - returns all repayments in the system
const getAllRepayments = async (req, res) => {
  try {

    const repayments = await Repayment.find()
      .populate('userId', 'fullName email')
      .populate('loanId', 'loanAmount nationalId')
      .sort({ createdAt: -1 });

    // Calculate overall stats
    const totalCollected = repayments
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPending = repayments
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalOverdue = repayments
      .filter(r => r.status === 'overdue')
      .reduce((sum, r) => sum + r.amount, 0);

    return res.status(200).json({
      success: true,
      summary: {
        totalRepayments: repayments.length,
        totalCollected,
        totalPending,
        totalOverdue,
      },
      repayments,
    });

  } catch (error) {
    console.error('Get all repayments error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// Export all functions
module.exports = {
  generateRepaymentSchedule,
  getMyRepayments,
  getRepaymentsByLoan,
  initiatePayment,
  paychanguWebhook,
  getAllRepayments,
};