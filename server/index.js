require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const recipesRoutes = require('./routes/recipes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✔️ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));


app.use('/recipes', recipesRoutes);