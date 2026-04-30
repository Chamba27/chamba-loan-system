// This file configures Swagger documentation
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Chamba Loan Eligibility API',
      version:     '1.0.0',
      description: 'A loan eligibility system built with Express.js, MongoDB and JWT Authentication',
      contact: {
        name:  'Chamba Inc',
        email: 'support@chamba.com',
      },
    },
    servers: [
      {
        url:         'http://localhost:5000',
        description: 'Development server',
      },
    ],
    // This adds the Authorization input to Swagger UI
    // So we can test protected endpoints directly from the docs
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
          description:  'Enter your JWT token here. Get it from /api/auth/login'
        }
      }
    }
  },
  // Scan both routes files for Swagger comments
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;