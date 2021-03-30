import path from 'path';
import express from 'express';
import fileupload from 'express-fileupload';
import { config } from 'dotenv';
import morgan from 'morgan';
import errorHandlerMiddleware from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

// Load env vars
config({
     path: '.env'
});

// Connect to Database
connectDB();

// Routes
import bootcamps from './routes/bootcampRoute.js';
import courses from './routes/coursesRoute.js';
import connectDb from './config/db';

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV !== "production") {
     app.use(morgan('dev'));
}

// File upload
app.use(fileupload());

// serve static folder middleware
app.use(express.static(path.join(__dirname,'public')))

// ping
app.get('/ping', (req, res) => {
     res.status(200).send({
          success: true,
          message: `server time: ${new Date().toLocaleString()}`
     })
})

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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