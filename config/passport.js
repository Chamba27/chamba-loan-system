// This file configures Passport.js for Google Sign In
// Passport is an authentication middleware for Node.js
// Think of it as a specialist that handles Google's complex auth flow for us

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure the Google Strategy
// This tells Passport how to handle Google Sign In
passport.use(
  new GoogleStrategy(
    {
      // These come from our .env file
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },

    // This function runs after Google verifies the user
    // profile contains the user's Google account information
    async (accessToken, refreshToken, profile, done) => {
      try {

        // STEP 1: Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        // STEP 2: If user exists just return them
        if (user) {
          return done(null, user);
        }

        // STEP 3: Check if user exists with same email
        // This handles case where user registered with email first
        // then tries to sign in with Google using same email
        const existingUser = await User.findOne({
          email: profile.emails[0].value
        });

        if (existingUser) {
          // Link Google ID to existing account
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // STEP 4: Create new user from Google profile
        // Google gives us name, email and profile picture
        user = await User.create({
          fullName:   profile.displayName,
          email:      profile.emails[0].value,
          googleId:   profile.id,
          isVerified: true, // Google already verified their email!
          // Phone and nationalId will be empty for Google users
          // They'll need to complete their profile later
          phone:      'pending',
          nationalId: `GOOGLE-${profile.id}`, // temporary ID
          role:       'applicant',
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user - what to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user - how to retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;