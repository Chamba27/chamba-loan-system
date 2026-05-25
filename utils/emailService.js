// This file handles all email sending for our system
// We use Nodemailer which connects to Gmail SMTP
// Think of it as our postal service department

const nodemailer = require('nodemailer');

// ── CREATE TRANSPORTER ────────────────────────────────────────
// The transporter is our connection to Gmail's email servers
// It's like setting up our postal truck before sending mail
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   process.env.EMAIL_PORT,
  secure: false, // false for port 587, true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── HELPER FUNCTION ───────────────────────────────────────────
// Base function that sends any email
// All our specific email functions call this one
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from:    `"Chamba Loan System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, // HTML content of the email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// ── WELCOME EMAIL ─────────────────────────────────────────────
// Sent when a new user registers
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Chamba Loan System! 🎉';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a237e; padding: 30px; text-align: center;">
        <h1 style="color: #c6f135; margin: 0;">CHAMBA</h1>
        <p style="color: #fff; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #1a237e;">Welcome, ${user.fullName}! 👋</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now apply for loans, track your applications and manage repayments.</p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a237e; margin-top: 0;">Your Account Details:</h3>
          <p><strong>Name:</strong> ${user.fullName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>National ID:</strong> ${user.nationalId}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/dashboard"
           style="background: #c6f135; color: #111; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Dashboard
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>Chamba Loan System | Blantyre, Malawi</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// ── LOAN APPROVED EMAIL ───────────────────────────────────────
// Sent when a loan application is approved
const sendLoanApprovedEmail = async (user, loan) => {
  const subject = '🎉 Your Loan Application Has Been Approved!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a237e; padding: 30px; text-align: center;">
        <h1 style="color: #c6f135; margin: 0;">CHAMBA</h1>
        <p style="color: #fff; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">✅</span>
          <h2 style="color: #2e7d32;">Loan Approved!</h2>
        </div>
        <p>Dear <strong>${user.fullName}</strong>,</p>
        <p>Congratulations! Your loan application has been approved.</p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;
                    border-left: 4px solid #c6f135;">
          <h3 style="color: #1a237e; margin-top: 0;">Loan Details:</h3>
          <p><strong>Loan Amount:</strong> MK ${loan.loanAmount.toLocaleString()}</p>
          <p><strong>Term:</strong> ${loan.termMonths} months</p>
          <p><strong>Monthly Repayment:</strong> MK ${loan.monthlyRepayment.toLocaleString()}</p>
          <p><strong>Total Repayable:</strong> MK ${(loan.monthlyRepayment * loan.termMonths).toLocaleString()}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/repayments"
           style="background: #c6f135; color: #111; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Repayment Schedule
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>Chamba Loan System | Blantyre, Malawi</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// ── LOAN DECLINED EMAIL ───────────────────────────────────────
// Sent when a loan application is declined
const sendLoanDeclinedEmail = async (user, loan, reasons) => {
  const subject = 'Update on Your Loan Application';
  const reasonsList = reasons
    .map(r => `<li style="margin-bottom: 8px;">${r}</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a237e; padding: 30px; text-align: center;">
        <h1 style="color: #c6f135; margin: 0;">CHAMBA</h1>
        <p style="color: #fff; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">❌</span>
          <h2 style="color: #c62828;">Application Unsuccessful</h2>
        </div>
        <p>Dear <strong>${user.fullName}</strong>,</p>
        <p>Unfortunately your loan application for <strong>MK ${loan.loanAmount.toLocaleString()}</strong>
           was not successful at this time.</p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;
                    border-left: 4px solid #e53935;">
          <h3 style="color: #c62828; margin-top: 0;">Reasons for Decline:</h3>
          <ul style="padding-left: 20px; color: #555;">
            ${reasonsList}
          </ul>
        </div>
        <p>You are welcome to apply again once you have addressed the above points.</p>
        <a href="${process.env.CLIENT_URL}/loans/apply"
           style="background: #1a237e; color: #fff; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Apply Again
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>Chamba Loan System | Blantyre, Malawi</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// ── PAYMENT RECEIVED EMAIL ────────────────────────────────────
// Sent when a repayment is confirmed as paid
const sendPaymentReceivedEmail = async (user, repayment) => {
  const subject = '✅ Payment Received - Thank You!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a237e; padding: 30px; text-align: center;">
        <h1 style="color: #c6f135; margin: 0;">CHAMBA</h1>
        <p style="color: #fff; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">💰</span>
          <h2 style="color: #2e7d32;">Payment Received!</h2>
        </div>
        <p>Dear <strong>${user.fullName}</strong>,</p>
        <p>We have received your loan repayment. Thank you!</p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;
                    border-left: 4px solid #c6f135;">
          <h3 style="color: #1a237e; margin-top: 0;">Payment Details:</h3>
          <p><strong>Amount Paid:</strong> MK ${repayment.amount.toLocaleString()}</p>
          <p><strong>Installment:</strong> ${repayment.installmentNumber} of ${repayment.totalInstallments}</p>
          <p><strong>Date Paid:</strong> ${new Date(repayment.paidDate).toLocaleDateString()}</p>
          <p><strong>Reference:</strong> ${repayment.paymentReference}</p>
          <p><strong>Remaining Installments:</strong> ${repayment.totalInstallments - repayment.installmentNumber}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/repayments"
           style="background: #c6f135; color: #111; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          View All Repayments
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>Chamba Loan System | Blantyre, Malawi</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// ── PAYMENT REMINDER EMAIL ────────────────────────────────────
// Sent 3 days before a repayment is due
const sendPaymentReminderEmail = async (user, repayment) => {
  const subject = '⚠️ Payment Reminder - Due in 3 Days';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a237e; padding: 30px; text-align: center;">
        <h1 style="color: #E4F222; margin: 0;">CHAMBA</h1>
        <p style="color: #000000; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">⏰</span>
          <h2 style="color: #e65100;">Payment Due Soon!</h2>
        </div>
        <p>Dear <strong>${user.fullName}</strong>,</p>
        <p>This is a friendly reminder that your loan repayment is due in <strong>3 days.</strong></p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;
                    border-left: 4px solid #ff9800;">
          <h3 style="color: #000000; margin-top: 0;">Payment Due:</h3>
          <p><strong>Amount:</strong> MK ${repayment.amount.toLocaleString()}</p>
          <p><strong>Installment:</strong> ${repayment.installmentNumber} of ${repayment.totalInstallments}</p>
          <p><strong>Due Date:</strong> ${new Date(repayment.dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please ensure you have sufficient funds to avoid any penalties.</p>
        <a href="${process.env.CLIENT_URL}/repayments"
           style="background: #c6f135; color: #111; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Pay Now
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>Chamba Loan System | Blantyre, Malawi</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// ── OTP EMAIL ─────────────────────────────────────────────────
// Sent when user logs in - contains 6 digit OTP code
const sendOTPEmail = async (user, otp) => {
  const subject = '🔐 Your Login Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; padding: 30px; text-align: center;">
        <h1 style="color: #E4F222; margin: 0;">CHAMBA</h1>
        <p style="color: #fff; margin: 5px 0;">Loan Management System</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #000;">Verification Code 🔐</h2>
        <p>Hi <strong>${user.fullName}</strong>,</p>
        <p>Use the code below to complete your login:</p>
        <div style="background: #000; color: #E4F222; font-size: 40px; font-weight: 900;
                    letter-spacing: 12px; text-align: center; padding: 24px;
                    border-radius: 12px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">
          This code expires in <strong>10 minutes.</strong>
          If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// Export all email functions
module.exports = {
  sendWelcomeEmail,
  sendLoanApprovedEmail,
  sendLoanDeclinedEmail,
  sendPaymentReceivedEmail,
  sendPaymentReminderEmail,
  sendOTPEmail,
};