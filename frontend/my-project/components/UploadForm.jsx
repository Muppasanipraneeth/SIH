import  { useState } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types'

const UploadForm = ({ setAddress }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('image', selectedFile);
  
    try {
      const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAddress(response.data.address);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="upload-form">
      <h2>Upload Address Image</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>Upload</button>
      </form>
      {loading && <p>Processing...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
UploadForm.propTypes = {
  setAddress: PropTypes.func.isRequired, // Ensure setAddress is a function and is required
};

export default UploadForm;
