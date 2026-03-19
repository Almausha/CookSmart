const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ================= 1. USER ================= */
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dietProfile: {
    type: String,
    enum: ["diabetic", "vegan", "weight-loss", "halal", "none"],
    default: "none"
  },
  allergies: [{ type: String }], // e.g., ["nuts", "dairy"]
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
}, { timestamps: true });

/* ================= 2. ADMIN ================= */
const AdminSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  permissions: [String],
  managedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }]
});

/* ================= 3. INGREDIENT (Master List) ================= */
const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },

  /* Admin inputs P, C, F per 100g/ml. Backend calculates calories. */
  calories: { type: Number, default: 0 }, 
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  unit: { type: String, enum: ["g", "kg", "ml", "pcs", "tsp", "tbsp"], default: "g" },
  qualityType: {
    type: String,
    enum: ["fresh", "stale", "processed", "organic"],
    default: "fresh"
  },
  isAllergen: { type: Boolean, default: false },
  healthBenefits: [String],
  risks: [String]
});

/* ================= 4. PANTRY (User's Stock) ================= */
const PantrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: [{
    ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
    currentQuantity: { type: Number, default: 0 },
    unit: { 
      type: String, 
      enum: ["g", "kg", "ml", "pcs", "tsp", "tbsp"], 
      default: "g" 
    },
    expiryDate: Date
  }]
});

/* ================= 5. RECIPE ================= */

const RecipeSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  cookingTime: String,
  videourl: String,
  recipeTag: [String],
  isPublic: { type: Boolean, default: true },
  imageUrl: { type: String, default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },
  steps: [String],
  
  ingredients: [{
    ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
    quantityValue: { type: Number, required: true }, 
    unit: { 
      type: String, 
      enum: ["g", "kg", "ml", "pcs", "tsp", "tbsp"], 
      default: "g" 
    },
 
    substituteSuggestions: [String] 
  }],

  nutrition: {
    calories: { type: Number, default: 0 }, 
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }
}, { timestamps: true });

/* ================= 6-11. SUPPORTING SCHEMAS ================= */
const ReviewSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const SocialCookingFeedSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  photoUrl: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const ShoppingListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: [{ name: String, quantity: String, isPurchased: { type: Boolean, default: false } }]
});

const ShoppingCartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ name: String, price: Number, quantity: Number }]
});

const CheckoutSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  paymentStatus: { type: String, default: "Pending" },
  totalAmount: Number
});

const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
  cookedDate: { type: Date, default: Date.now }
});

/* ================= EXPORT ================= */
module.exports = {
  User: mongoose.model("User", UserSchema),
  Admin: mongoose.model("Admin", AdminSchema),
  Ingredient: mongoose.model("Ingredient", IngredientSchema),
  Pantry: mongoose.model("Pantry", PantrySchema),
  Recipe: mongoose.model("Recipe", RecipeSchema),
  Review: mongoose.model("Review", ReviewSchema),
  SocialCookingFeed: mongoose.model("SocialCookingFeed", SocialCookingFeedSchema),
  ShoppingList: mongoose.model("ShoppingList", ShoppingListSchema),
  ShoppingCart: mongoose.model("ShoppingCart", ShoppingCartSchema),
  Checkout: mongoose.model("Checkout", CheckoutSchema),
  History: mongoose.model("History", HistorySchema)
};