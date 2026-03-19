require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Test route
app.get('/', (req, res) => {
  res.send('CookSmart API Running');
});

// 3. Routes Import
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const recipeRecommendRoutes = require('./routes/recipeRecommendRoutes');
const missingRoutes = require('./routes/missingRoutes'); 
const youtubeRoutes = require('./routes/youtubeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes'); 
const userRecipeRoutes = require('./routes/userRecipeRoutes'); 
const masterIngredientRoutes = require('./routes/masterIngredient.routes');
// 4. Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recommend', recipeRecommendRoutes);
app.use('/api/check-missing', missingRoutes); 
app.use('/api/video', youtubeRoutes);        

app.use('/api/ingredients', ingredientRoutes); 
app.use('/api/master-ingredients', masterIngredientRoutes); // master-ingredients করে দিন

app.use('/api/user-recipe', userRecipeRoutes); 

// 5. MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✔️ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// 6. Start server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});