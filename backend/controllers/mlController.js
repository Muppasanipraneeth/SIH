const tesseract = require('tesseract.js');

// Function to process image using OCR (Tesseract.js)
const processImage = (imagePath, callback) => {
  tesseract.recognize(imagePath, 'eng', { logger: (m) => console.log(m) })
    .then(({ data: { text } }) => {
      // Here, you can format or process the extracted text (address)
      callback(null, text);
    })
    .catch((err) => {
      console.error('Error processing image:', err);
      callback(err, null);
    });
};

module.exports = { processImage };
