// This is our Repayment Model
// It tracks every monthly repayment for every approved loan
// Think of it as a payment schedule tracker

const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema(
  {
    // Reference to the loan this repayment belongs to
    loanId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Loan',
      required: true,
    },

    // Reference to the user making the repayment
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // The repayment amount due
    amount: {
      type:     Number,
      required: true,
    },

    // Which repayment number this is
    // e.g. 1 = first payment, 6 = sixth payment
    installmentNumber: {
      type:     Number,
      required: true,
    },

    // Total number of installments for this loan
    totalInstallments: {
      type:     Number,
      required: true,
    },

    // When this repayment is due
    dueDate: {
      type:     Date,
      required: true,
    },

    // When the user actually paid
    // null means not paid yet
    paidDate: {
      type:    Date,
      default: null,
    },

    // Current status of this repayment
    status: {
      type:    String,
      enum:    ['pending', 'paid', 'overdue'],
      default: 'pending',
    },

    // Paychangu payment reference number
    // This is returned by Paychangu after payment
    paymentReference: {
      type:    String,
      default: null,
    },

    // Paychangu transaction ID for verification
    transactionId: {
      type:    String,
      default: null,
    },

    // Payment method used
    // e.g. Airtel Money, TNM Mpamba, Bank Card
    paymentMethod: {
      type:    String,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

// Create the Model
const Repayment = mongoose.model('Repayment', repaymentSchema);

module.exports = Repayment;