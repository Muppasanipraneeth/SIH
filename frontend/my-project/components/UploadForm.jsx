import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedText, setUploadedText] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedFile) {
            alert("Please select a file first.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle response from the backend
            if (response.data.success) {
                setUploadedText(response.data.text);  // Assuming it's an array of text and confidence objects
            } else {
                setError('Failed to extract text from the image.');
            }
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('An error occurred while uploading the file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-form">
            <h2>Upload an Image for OCR</h2>
            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {uploadedText.length > 0 && (
                <div>
                    <h3>Extracted Text:</h3>
                    <ul>
                        {uploadedText.map((item, index) => (
                            <li key={index}>
                                <strong>Text:</strong> {item.text} <br />
                                <strong>Confidence:</strong> {item.confidence}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
