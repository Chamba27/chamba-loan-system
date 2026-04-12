// The controller receives incoming requests and sends back responses
// It does NOT contain business logic - it just coordinates between
// the request, the service and the response
// Think of it as the waiter - it takes your order to the kitchen and brings food back



// Import our loan eligibility service
const { checkLoanEligibility } = require('../services/loanService');

// This function handles POST /api/loans/apply
// It receives the loan application and returns a decision
const applyForLoan = async (req, res) => {

  try {

    // ── STEP 1: Extract data from the request body ──────────────
    // req.body contains the data sent by the user in their request
    // This is like reading the order a customer wrote on a form
    const { nationalId, loanAmount, termMonths } = req.body;

    // ── STEP 2: Validate the incoming data ──────────────────────
    // Before doing anything check that all required fields are present
    // This is called input validation - never trust data from outside!
    if (!nationalId || !loanAmount || !termMonths) {
      return res.status(400).json({
        success: false,
        error: 'Please provide nationalId, loanAmount and termMonths'
      });
    }

    // Check that loan amount and term are positive numbers
    if (loanAmount <= 0 || termMonths <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanAmount and termMonths must be positive numbers'
      });
    }

    // ── STEP 3: Call the loan eligibility service ────────────────
    // Pass the data to our service which contains all the rules
    // This is the waiter taking the order to the kitchen
    const decision = await checkLoanEligibility(
      nationalId,
      parseFloat(loanAmount),
      parseInt(termMonths)
    );

    // ── STEP 4: Send the response back ──────────────────────────
    // Status 200 means OK - everything worked
    return res.status(200).json({
      success: true,
      decision,
    });

  } catch (error) {

    // If something unexpected goes wrong catch it here
    // Status 500 means Internal Server Error
    console.error('Loan application error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });

  }

};

// Export so our routes file can use this function
module.exports = { applyForLoan };