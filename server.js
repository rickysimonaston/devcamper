const express = require("express");
const dotenv = require("dotenv");

// Load ENV vars
dotenv.config({ path: "./config/config.env" });

// Create express app
const app = express();

// Create express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `App listening on port ${process.env.NODE_ENV} mode on port ${PORT}!`
  );
});
