import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Load env variables
dotenv.config({
    path: '.env'
});

const __dirname = path.resolve();

// Load models
import Bootcamps from './models/Bootcamp.js';
import { exit } from 'process';

// Connect to DB
const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/bootcamps.json`, 'utf-8'
    ))

// Import into DB
const importData = async () => {
    try {
        await Bootcamps.create(bootcamps);

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