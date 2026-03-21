require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const recognitionRoutes = require('./routes/recognition');
const historyRoutes = require('./routes/history');
const generationRoutes = require('./routes/generation');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5002; 

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// Add axios for image proxy
const axios = require('axios');

// Image Proxy Endpoint to bypass ORB/CORS
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL is required");
  
  try {
    const response = await axios.get(url, { 
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    });
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).send("Error proxying image");
  }
});

app.use('/api', recognitionRoutes);
app.use('/api', historyRoutes);
app.use('/api', generationRoutes);
app.use('/api', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: "CraftVision AI Backend is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/api/recognition`);
});
