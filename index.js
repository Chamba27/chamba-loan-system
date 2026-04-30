// Import dotenv first - before anything else!
// This loads our .env file so process.env variables are available

const session = require('express-session');

require('dotenv').config();

// Import passport for Google Sign In
const passport = require('./config/passport');

// Import Express
const express = require('express');

// Import CORS
const cors = require('cors');

// Import Swagger packages
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Import our database connection
const connectDB = require('./config/db');

// Import our loan routes
const loanRoutes = require('./routes/loanRoutes');
// Import auth routes
const authRoutes = require('./routes/authRoutes');

// Create our Express applicatio
const app = express();

// ── Connect to MongoDB ─────────────────────────────────────────
// We connect to the database before starting the server
// This ensures the database is ready before we accept any requests
connectDB();

// Tell Express to understand JSON data
app.use(express.json());


// Session middleware - required by Passport for Google Sign In
// This creates a session for each user visit
app.use(session({
  // Secret used to sign the session cookie
  secret: process.env.JWT_SECRET,
  // Don't save session if nothing changed
  resave: false,
  // Don't create session until something is stored
  saveUninitialized: false,
  cookie: {
    // Session expires after 1 day
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize passport middleware
app.use(passport.initialize());

// Allow passport to use sessions
app.use(passport.session());

// Initialize passport middleware
app.use(passport.initialize());

// Turn on CORS
app.use(cors());

// ── Swagger Documentation ──────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Register our routes ────────────────────────────────────────
app.use('/api/loans', loanRoutes);
// Register auth routes

// Any request starting with /api/auth goes to authRoutes
app.use('/api/auth', authRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Chamba Loan API!',
    docs: 'Visit http://localhost:5000/api-docs to see the API documentation'
  });
});

// Read PORT from .env file
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Chamba Loan API is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});