const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://apchaudhary6695:anand8126@cluster0.m0uykuj.mongodb.net/image', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for storing file information in MongoDB
const fileSchema = new mongoose.Schema({
  image: String,
  name: String 
});

const File = mongoose.model('File', fileSchema);

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Serve the HTML form
// GET API to fetch all files
app.get('/files', async (req, res) => {
    try {
        // Query the database to get all files
        const files = await File.find({});
        res.json(files); // Return the files as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving files from MongoDB.');
    }
});

// Handle file upload and form data
app.post('/upload', uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    // Create a new File document with the image path and name
    let newFile = new File({
        name: req.body.jobProfile,
        image: `${basePath}${fileName}`, // Full path to the image
    });

    try {
        // Save the new File document to the database
        newFile = await newFile.save();
        res.send(newFile); // Return the saved File document as the response
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving file information to MongoDB.');
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
