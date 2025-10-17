import dotenv from 'dotenv';
dotenv.config();

// Debug: Check if environment variables are loading
console.log('Environment check:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'NOT LOADED');
console.log('PORT:', process.env.PORT || 5000);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import blogPostRoutes from './routes/blogPosts';
import subscriberRoutes from './routes/subscribers';
import newsletterRoutes from './routes/newsletter';
import commentRoutes from './routes/comments';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/posts', blogPostRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/comments', commentRoutes);


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doterran-blog';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;

// Only start the server if MongoDB connects successfully
mongoose.connection.on('connected', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

export default app;