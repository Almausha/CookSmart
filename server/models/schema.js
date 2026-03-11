const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ================= USER ================= */

const UserSchema = new Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
  dietProfile: String
});


/* ================= ADMIN ================= */

const AdminSchema = new Schema({
  adminId: String
});


/* ================= INGREDIENT ================= */

const IngredientSchema = new Schema({
  ingredientId: String,
  name: String,
  quantity: Number,
  expiryDate: Date,
  qualityType: String
});


/* ================= PANTRY ================= */

const PantrySchema = new Schema({

  pantryId: String,

  ingredients: [IngredientSchema]

});


/* ================= RECIPE ================= */

const RecipeSchema = new Schema({

  ownerId: String,
  recipeId: String,

  title: String,
  difficulty: String,
  cookingTime: String,
  videoURL: String,

  recipeTag: [String],

  steps: [String],

  ingredients: [
    {
      ingredientId: String,
      name: String,
      quantity: Number
    }
  ]

});


/* ================= REVIEW ================= */

const ReviewSchema = new Schema({

  recipeId: String,
  rating: Number,
  comment: String

});


/* ================= SOCIAL COOKING FEED ================= */

const SocialCookingFeedSchema = new Schema({

  recipeId: String,
  likeId: String,
  commentId: String,
  shareId: String,
  rateId: String

});


/* ================= SHOPPING LIST ================= */

const ShoppingListSchema = new Schema({

  listId: String,

  ingredients: [
    {
      ingredientId: String,
      name: String,
      quantity: Number
    }
  ]

});


/* ================= SHOPPING CART ================= */

const ShoppingCartSchema = new Schema({

  cartId: String,

  items: [
    {
      ingredientId: String,
      name: String,
      quantity: Number
    }
  ]

});


/* ================= CHECKOUT ================= */

const CheckoutSchema = new Schema({

  cartId: String,
  paymentStatus: String

});


/* ================= HISTORY ================= */

const HistorySchema = new Schema({

  cookedDate: Date,
  payslip: String,
  socialId: String

});


/* ================= EXPORT MODELS ================= */

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