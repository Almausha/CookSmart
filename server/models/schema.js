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
  allergies: [{ type: String }],
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

/* ================= 4. PANTRY ================= */
const PantrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, 
    ref: "User", required: true },
  ingredients: [{
    ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
    ingredientName: { type: String, required: true },
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

/* ================= 6. REVIEW ================= */
const ReviewSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

/* ================= 7. SOCIAL COOKING FEED ================= */
const SocialCookingFeedSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  photoUrl: String,
  caption: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    text: String
  }],
  shareCount: { type: Number, default: 0 }
});

/* ================= 8. SHOPPING LIST ================= */
const ShoppingListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: [{ 
    name: String, 
    quantity: String, 
    isPurchased: { type: Boolean, default: false },
    externalLink: String
  }]
});

/* ================= 9. SHOPPING CART ================= */
const ShoppingCartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    name: String,
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 1 }
  }]
});

/* ================= 10. CHECKOUT ================= */
const CheckoutSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  cartId: { type: Schema.Types.ObjectId, ref: "ShoppingCart" },
  paymentStatus: { type: String, default: "Pending" },
  totalAmount: Number
});

/* ================= 11. HISTORY ================= */
const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
  cookedDate: { type: Date, default: Date.now },
  lastVisited: Date,
  payslip: String
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