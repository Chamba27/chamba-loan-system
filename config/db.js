// This file handles our connection to MongoDB
// We keep it separate so any file can use it by just importing it
// Think of it as the key to our database safe

const mongoose = require('mongoose');

// This function connects to our MongoDB database
// We make it async because connecting takes a moment
const connectDB = async () => {
  try {

    // Use the connection string from our .env file
    // process.env.MONGODB_URI reads the value from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // If connection is successful log the host name
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    // If connection fails log the error and stop the server
    // We stop the server because without a database our app can't work
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);

  }
};

// Export so index.js can use it
module.exports = connectDB;