const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

/* ==========================================================
   RECIPE SYSTEM ROUTES
   ========================================================== */

// ১. নতুন রেসিপি তৈরি করা (Admin/User Form থেকে)
// URL: POST /api/recipes
router.post("/", recipeController.create);

// ২. সব পাবলিক রেসিপি লিস্ট পাওয়া (PublicRecipes.tsx এর জন্য)
// URL: GET /api/recipes/public
router.get("/public", recipeController.getPublic);

// ৩. আইডি দিয়ে নির্দিষ্ট রেসিপি ডিটেইলস পাওয়া (RecipeDetails.tsx এর জন্য)
// URL: GET /api/recipes/:id
router.get("/:id", recipeController.getById);

module.exports = router;