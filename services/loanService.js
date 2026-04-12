// This is the loan eligibility service
// It contains all the business rules for deciding if a loan is approved or declined

// Import our two mock services
const { verifySalary } = require('../mock/salaryService');
const { checkCredit } = require('../mock/creditService');

// Eligibility rules defined as constants so they're easy to change
const RULES = {
  MIN_CREDIT_SCORE:    600,
  SALARY_TO_REPAYMENT: 3,
  MAX_ACTIVE_LOANS:    3,
};

// Main function that decides if a loan is approved or declined
const checkLoanEligibility = async (nationalId, loanAmount, termMonths) => {

  // STEP 1: Check salary
  const salaryResult = verifySalary(nationalId);

  // If salary check failed return immediately
  if (!salaryResult.success) {
    return {
      approved: false,
      reason: salaryResult.error
    };
  }

  // STEP 2: Check credit history
  const creditResult = checkCredit(nationalId);

  // If credit check failed return immediately
  if (!creditResult.success) {
    return {
      approved: false,
      reason: creditResult.error
    };
  }

  // STEP 3: Extract the data we need
  const { salary } = salaryResult.data;
  const { creditScore, activeLoans, hasDefaults } = creditResult.data;

  // Calculate monthly repayment
  const monthlyRepayment = loanAmount / termMonths;

  // STEP 4: Apply eligibility rules
  // Collect all decline reasons in an array
  const declineReasons = [];

  // Rule 1: Credit score must be 600 or above
  if (creditScore < RULES.MIN_CREDIT_SCORE) {
    declineReasons.push(
      `Credit score ${creditScore} is below minimum required ${RULES.MIN_CREDIT_SCORE}`
    );
  }

  // Rule 2: Salary must be at least 3x monthly repayment
  if (salary < monthlyRepayment * RULES.SALARY_TO_REPAYMENT) {
    declineReasons.push(
      `Monthly salary MK ${salary} is insufficient for monthly repayment of MK ${monthlyRepayment.toFixed(2)}`
    );
  }

  // Rule 3: No active defaults allowed
  if (hasDefaults) {
    declineReasons.push('Applicant has active defaults on record');
  }

  // Rule 4: Maximum 3 active loans
  if (activeLoans >= RULES.MAX_ACTIVE_LOANS) {
    declineReasons.push(
      `Applicant has ${activeLoans} active loans which exceeds maximum of ${RULES.MAX_ACTIVE_LOANS}`
    );
  }

  // STEP 5: Make the final decision
  if (declineReasons.length > 0) {
    return {
      approved:  false,
      reasons:   declineReasons,
      applicant: salaryResult.data,
      credit:    creditResult.data,
    };
  }

  // All rules passed - loan is approved!
  return {
    approved:         true,
    message:          'Congratulations! Your loan application has been approved',
    monthlyRepayment: monthlyRepayment.toFixed(2),
    applicant:        salaryResult.data,
    credit:           creditResult.data,
  };
};

// Export so our controller can use this function
module.exports = { checkLoanEligibility };