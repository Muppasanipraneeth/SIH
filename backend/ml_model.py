import sys
import easyocr
import cv2
from matplotlib import pyplot as plt

# Get the image path from Node.js argument
image_path = sys.argv[1]

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])  # Specify the language(s) you need; 'en' for English

# Use EasyOCR to extract text from the image
results = reader.readtext(image_path)

# Load the image using OpenCV
image = cv2.imread(image_path)

# Display the image and annotate the detected text
for (bbox, text, prob) in results:
    # Extract the bounding box
    (top_left, top_right, bottom_right, bottom_left) = bbox
    top_left = tuple(map(int, top_left))
    bottom_right = tuple(map(int, bottom_right))

    # Draw the bounding box on the image
    image = cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)

    # Put the text above the bounding box
    image = cv2.putText(image, text, top_left, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2, cv2.LINE_AA)

# Convert BGR to RGB for displaying with Matplotlib (optional if you want to display the image)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Output the extracted text to Node.js
for (bbox, text, prob) in results:
    print(f"Detected text: {text} (Confidence: {prob:.2f})")
