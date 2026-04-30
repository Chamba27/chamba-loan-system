// This is our User Model
// It defines the shape of every user document saved to MongoDB
// Every person who registers gets one User document

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    fullName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Email is unique - no two users can have same email
    email: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      lowercase: true, // always saves email in lowercase
    },

    // Phone number
    phone: {
      type:     String,
      required: true,
      trim:     true,
    },

    // National ID
    nationalId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },

    // Password - we never store plain text passwords!
    // required is false because Google users don't have passwords
    password: {
      type:     String,
      required: false,
      minlength: 6,
    },

    // Role determines what the user can access
    // applicant - regular user who applies for loans
    // admin - can see everything and manage the system
    role: {
      type:    String,
      enum:    ['applicant', 'admin'], // only these two values allowed
      default: 'applicant',           // everyone starts as applicant
    },

    // Google ID for users who sign in with Google
    // null for users who register with email/password
    googleId: {
      type:    String,
      default: null,
    },

    // Whether the user has verified their email
    isVerified: {
      type:    Boolean,
      default: false,
    },

    // Token for email verification and password reset
    verificationToken: {
      type:    String,
      default: null,
    },

  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);


// ── MIDDLEWARE ────────────────────────────────────────────────
// This runs automatically BEFORE every save to MongoDB
// It encrypts the password if it was changed
userSchema.pre('save', async function() {

  // Only encrypt if password was changed or is new
  // This prevents re-encrypting an already encrypted password
  if (!this.isModified('password') || !this.password) {
    return;
  }

  // Generate a salt - random data added to password before hashing
  // 10 is the number of rounds - higher = more secure but slower
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// ── METHODS ───────────────────────────────────────────────────
// This is a custom method we add to every User document
// It checks if a provided password matches the stored hash
// We use this during login to verify the entered password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Model from the Schema
const User = mongoose.model("User", userSchema);

module.exports = User