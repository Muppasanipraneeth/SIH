const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Define the path to the Python executable
const pythonPath = 'C:\\Python39\\python.exe';  // Update to your Python executable path

// API route for image upload and processing
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    console.log('Image uploaded:', imagePath);

    // Define the path to your Python script
    const pythonScriptPath = path.join(__dirname, 'ml_model.py');

    // Spawn the Python process to run OCR
    const pythonProcess = spawn(pythonPath, [pythonScriptPath, imagePath]);

    let pythonOutput = '';

    // Capture the Python script's output (the extracted text)
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);

        // Return the extracted text to the React frontend
        if (code === 0) {
            res.json({ success: true, text: pythonOutput });
        } else {
            res.status(500).json({ success: false, message: 'Error in Python script execution' });
        }

        // Clean up the uploaded image file after processing
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting the image file:', err);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
