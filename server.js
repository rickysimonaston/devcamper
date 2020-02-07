// 3rd party requires
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Own App requirements

//Route Files
const bootcamps = require('./routes/bootcamps');

// Load ENV vars
dotenv.config({
  path: './config/config.env',
});

// Create express app
const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Create express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `App listening on port ${process.env.NODE_ENV} mode on port ${PORT}!`,
  );
});
