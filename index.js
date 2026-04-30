// ── STEP 1: Load environment variables FIRST ──────────────────
require('dotenv').config();

// ── STEP 2: Import all packages ───────────────────────────────
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// ── STEP 3: Import database connection ────────────────────────
const connectDB = require('./config/db');

// ── STEP 4: Import all routes ─────────────────────────────────
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// ── STEP 5: Create Express app ────────────────────────────────
const app = express();

// ── STEP 6: Connect to MongoDB ────────────────────────────────
connectDB();

// ── STEP 7: Register all middleware ───────────────────────────
// Parse incoming JSON data
app.use(express.json());

// Enable CORS for React frontend
app.use(cors());

// Session middleware - required by Passport
app.use(session({
  secret:            process.env.JWT_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ── STEP 8: Swagger Documentation ────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── STEP 9: Register all routes ───────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);

// ── STEP 10: Welcome endpoint ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Chamba Loan API!',
    docs:    'Visit http://localhost:5000/api-docs to see the API documentation'
  });
});

// ── STEP 11: Start the server ─────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Chamba Loan API is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});