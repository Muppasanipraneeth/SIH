from flask import Flask, request, jsonify
import easyocr
import cv2
import os
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)

import warnings
warnings.filterwarnings('ignore', category=FutureWarning)

# Folder to temporarily store uploaded images
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Initialize the EasyOCR reader (loading model)
reader = easyocr.Reader(['en'])

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No file part"})
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"})
    
    if file and allowed_file(file.filename):
        # Save the uploaded image
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process the image with EasyOCR
        extracted_text, image_with_boxes = process_image(file_path)
        
        # Cleanup the uploaded image file
        os.remove(file_path)

        # Return the extracted text as JSON
        return jsonify({"success": True, "text": extracted_text})
    
    return jsonify({"success": False, "message": "Invalid file format"})

def process_image(image_path):
    # Use EasyOCR to extract text from the image
    results = reader.readtext(image_path)
    
    # Load the image with OpenCV for annotation
    image = cv2.imread(image_path)

    extracted_text = []
    
    # Iterate through results and annotate the image
    for (bbox, text, prob) in results:
        extracted_text.append({"text": text, "confidence": prob})
        
        # Draw bounding boxes on the image
        (top_left, top_right, bottom_right, bottom_left) = bbox
        top_left = tuple(map(int, top_left))
        bottom_right = tuple(map(int, bottom_right))
        
        # Draw the bounding box and the text on the image
        image = cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
        image = cv2.putText(image, text, top_left, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2, cv2.LINE_AA)
    
    # Convert BGR image to RGB (Optional for display purposes)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    return extracted_text, image_rgb

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
