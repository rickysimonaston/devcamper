// 3rd party requires
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

// Own App requirements
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

// Load ENV vars
dotenv.config({
  path: './config/config.env',
});

// Connect to database
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');

// Create express app
const app = express();

// Body Parser
app.use(express.json());

// Dev logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Middleware
app.use(errorHandler);

// Create express server
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow
    .bold,
  ),
);

// Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});