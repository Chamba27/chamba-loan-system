// This is our Loan Model
// It defines the exact shape of every loan document saved to MongoDB
// Think of it as a Figma component - every loan must follow this structure

const mongoose = require('mongoose');

// STEP 1: Define the Schema - the rules for our loan data
const loanSchema = new mongoose.Schema(
  {

    // Reference to the User who applied for this loan
    // Links the loan to a specific user account
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: false, // false for old loans that don't have userId
    },

    // The applicant's national ID
    nationalId: {
      type: String,      // must be text
      required: true,    // cannot be empty
      trim: true,        // removes accidental spaces e.g "NAT001 " becomes "NAT001"
    },

    // The amount of loan requested
    loanAmount: {
      type: Number,      // must be a number
      required: true,    // cannot be empty
      min: 1,            // must be at least 1
    },

    // The repayment period in months
    termMonths: {
      type: Number,      // must be a number
      required: true,    // cannot be empty
      min: 1,            // must be at least 1 month
    },

    // Whether the loan was approved or declined
    approved: {
      type: Boolean,     // must be true or false
      required: true,
    },

    // The monthly repayment amount if approved
    monthlyRepayment: {
      type: Number,      // must be a number
      default: null,     // null means no value - used when loan is declined
    },

    // The reasons for declining if not approved
    // This is an array because there can be multiple reasons
    declineReasons: {
      type: [String],    // array of text items
      default: [],       // empty array by default
    },

    // Applicant details from salary service
    applicantDetails: {
      name:     { type: String },
      salary:   { type: Number },
      employer: { type: String },
      status:   { type: String },
    },

    // Credit details from credit bureau
    creditDetails: {
      creditScore: { type: Number },
      activeLoans: { type: Number },
      hasDefaults: { type: Boolean },
      rating:      { type: String },
    },

  },
  {
    // This automatically adds two fields to every document:
    // createdAt - when the loan was applied
    // updatedAt - when it was last updated
    // MongoDB manages these automatically - we never set them manually
    timestamps: true,
  }
);

// STEP 2: Create the Model from the Schema
// 'Loan' is the model name - MongoDB will create a collection called 'loans'
// MongoDB automatically makes it lowercase and plural!
const Loan = mongoose.model('Loan', loanSchema);

// Export so our controller can use it to save and retrieve loans
module.exports = Loan;