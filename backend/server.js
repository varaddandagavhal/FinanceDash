const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/summary', require('./routes/summaryRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  // 1. Static files
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // 2. CATCH-ALL: This middleware approach avoids all path-to-regexp errors!
  app.use((req, res, next) => {
    // Only catch GET requests that aren't API calls
    if (req.method === 'GET' && !req.url.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
    } else {
      next();
    }
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Finance Dashboard API is running (Development)' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
