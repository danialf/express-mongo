import express, { json } from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import errorHandlerMiddleware from './middleware/errorMiddleware.js';
// import connectDB from './config/db';

// Load env vars
config({
     path: './config/config.env'
});


// Routes
import bootcamps from './routes/bootcampRoute.js';


const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV !== "production") {
     app.use(morgan('dev'));
}

// ping
app.get('/ping', (req, res) => {
     res.status(200).send({
          success: true,
          message: `server time ${Date.now.toString}`
     })
})

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

// Error handler Middleware
app.use(errorHandlerMiddleware);

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