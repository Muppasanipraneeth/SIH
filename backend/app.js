const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Use the image routes
app.use('/api/images', imageRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
