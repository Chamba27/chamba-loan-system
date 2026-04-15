// Import dotenv first - before anything else!
// This loads our .env file so process.env variables are available
require('dotenv').config();



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

// Create our Express applicatio
const app = express();

// ── Connect to MongoDB ─────────────────────────────────────────
// We connect to the database before starting the server
// This ensures the database is ready before we accept any requests
connectDB();

// Tell Express to understand JSON data
app.use(express.json());

// Turn on CORS
app.use(cors());

// ── Swagger Documentation ──────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Register our routes ────────────────────────────────────────
app.use('/api/loans', loanRoutes);

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