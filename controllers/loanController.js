// The controller receives incoming requests and sends back responses
// It coordinates between the request, the service and the database
// Think of it as the waiter - takes your order, goes to kitchen, saves the receipt

// Import our loan eligibility service
const { checkLoanEligibility } = require('../services/loanService');

// Import our Loan Model - this is how we talk to MongoDB
const Loan = require('../models/Loan');

// This function handles POST /api/loans/apply
const applyForLoan = async (req, res) => {
  try {

    // STEP 1: Extract data from the request body
    const { nationalId, loanAmount, termMonths } = req.body;

    // STEP 2: Validate the incoming data
    if (!nationalId || !loanAmount || !termMonths) {
      return res.status(400).json({
        success: false,
        error: 'Please provide nationalId, loanAmount and termMonths'
      });
    }

    if (loanAmount <= 0 || termMonths <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanAmount and termMonths must be positive numbers'
      });
    }

    // STEP 3: Call the loan eligibility service
    // This checks salary and credit and applies the rules
    const decision = await checkLoanEligibility(
      nationalId,
      parseFloat(loanAmount),
      parseInt(termMonths)
    );

    // STEP 4: Save the application and decision to MongoDB
    // We create a new Loan document using our Model blueprint
    const loanApplication = new Loan({
      nationalId,
      loanAmount:       parseFloat(loanAmount),
      termMonths:       parseInt(termMonths),
      approved:         decision.approved,
      monthlyRepayment: decision.approved ? parseFloat(decision.monthlyRepayment) : null,
      declineReasons:   decision.reasons || [],
      applicantDetails: decision.applicant || {},
      creditDetails:    decision.credit   || {},
    });

    // .save() actually writes the document to MongoDB
    // We await it because saving to DB takes a moment
    const savedApplication = await loanApplication.save();

    // STEP 5: Send the response back with the decision and saved ID
    return res.status(200).json({
      success:       true,
      applicationId: savedApplication._id,
      decision,
    });

  } catch (error) {
    console.error('Loan application error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// This function handles GET /api/loans
// Returns all loan applications from MongoDB
const getAllLoans = async (req, res) => {
  try {

    // .find() with no arguments returns ALL documents in the collection
    // sort({ createdAt: -1 }) means newest first
    // -1 = descending (newest first), 1 = ascending (oldest first)
    const loans = await Loan.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   loans.length,
      loans,
    });

  } catch (error) {
    console.error('Get loans error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// This function handles GET /api/loans/:id
// Returns one specific loan application by its MongoDB ID
const getLoanById = async (req, res) => {
  try {

    // req.params.id gets the ID from the URL
    // e.g. /api/loans/507f1f77bcf86cd799439011
    const loan = await Loan.findById(req.params.id);

    // If no loan found with that ID return 404
    if (!loan) {
      return res.status(404).json({
        success: false,
        error:   'Loan application not found'
      });
    }

    return res.status(200).json({
      success: true,
      loan,
    });

  } catch (error) {
    console.error('Get loan error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// This function handles GET /api/loans/applicant/:nationalId
// Returns all loans for one specific person
const getLoansByNationalId = async (req, res) => {
  try {

    // Find all loans where nationalId matches the URL parameter
    const loans = await Loan.find({
      nationalId: req.params.nationalId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   loans.length,
      loans,
    });

  } catch (error) {
    console.error('Get loans by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// Export all four functions so our routes file can use them
module.exports = {
  applyForLoan,
  getAllLoans,
  getLoanById,
  getLoansByNationalId,
};















