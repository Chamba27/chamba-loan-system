// This file configures Swagger - our API documentation tool
// Swagger reads this configuration and generates a beautiful
// interactive webpage where developers can see and test all endpoints

const swaggerJsdoc = require('swagger-jsdoc');

// This is the main Swagger configuration object
const options = {
  definition: {
    openapi: '3.0.0', // The version of OpenAPI standard we're using
    info: {
      title: 'Chamba Loan Eligibility API', // Name shown at top of docs
      version: '1.0.0',                     // Your API version
      description:
        'An API that checks loan eligibility based on salary and credit history. ' +
        'Built with Express.js by Chamba Inc.',
      contact: {
        name: 'Chamba Inc',
        email: 'support@chamba.com',
      },
    },
    servers: [
      {
        // This tells Swagger where your API is running
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  // This tells Swagger where to find our endpoint documentation comments
  // It will scan our routes file for special comments called JSDoc comments
  apis: ['./routes/*.js'],
};

// Generate the Swagger specification from our options
const swaggerSpec = swaggerJsdoc(options);

// Export so index.js can use it
module.exports = swaggerSpec;