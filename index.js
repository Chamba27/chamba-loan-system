// Import Express - the framework that handles all our API requests
const express = require('express');

// Import CORS - allows our React frontend to talk to this API
const cors = require('cors');

// Import Swagger packages
// swaggerUi creates the visual documentation webpage
// swaggerSpec is our configuration from swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Import our loan routes
const loanRoutes = require('./routes/loanRoutes');

// Create our Express application
const app = express();

// Tell Express to understand JSON data
app.use(express.json());

// Turn on CORS so our React app can communicate with this API
app.use(cors());

// ── Swagger Documentation ──────────────────────────────────────
// This creates a webpage at /api-docs showing all our endpoints
// Anyone can visit this page to see and test the API
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

// Define which port our server listens on
const PORT = 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Chamba Loan API is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});