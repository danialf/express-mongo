const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({
     path: './config/config.env'
});


// Routes
const bootcamps = require('./routes/bootcampRoute');

const app = express();

if (process.env.NODE_ENV !== "production") {
     app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 3000;

const server = app.listen(
     PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejection
process.on('uncaughtException', (err, promise) => {
     console.log(`Error: ${err.message}`);

     // close the server
     server.close(() => process.exit(1));
})