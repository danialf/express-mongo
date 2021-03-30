import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { exit } from 'process';

//Load env variables
dotenv.config({
    path: '.env'
});

const __dirname = path.resolve();

// Load models
import Bootcamps from './models/Bootcamp.js';
import Courses from './models/Course.js';


// Connect to DB
const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/bootcamps.json`, 'utf8'));
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/courses.json`, 'utf8'));

// Import into DB
const importData = async () => {
    try {
        await Bootcamps.create(bootcamps);
        await Courses.create(courses);

        console.log('Data imported');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete Data
const removeData = async () => {
    try {
        await Bootcamps.deleteMany();
        await Courses.deleteMany();

        console.log('Data imported');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Help
const showHekp = () => {
    console.log(`switch statements:
        -i : import data
        -d : delete all data
    `)

    exit();
}

// Main 
const statement = process.argv[2];
switch (statement) {
    case "-i":
        importData();
        break;

    case "-d":
        removeData();
        break;

    default:
        showHekp();
}