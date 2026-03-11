require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("CookSmart API Running");
});



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✔️ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));