const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ================= USER ================= */
const UserSchema = new Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  dietProfile: {
    type: String,
    enum: ["diabetic", "vegan", "weight-loss", "halal", "none"],
    default: "none"
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

}, { timestamps: true });



/* ================= ADMIN ================= */
const AdminSchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  permissions: [String],

  managedRecipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  }]

});



/* ================= INGREDIENT ================= */
const IngredientSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  quantity: {
  type: Number,
  default: 0,
  min: 0
  },

  expiryDate: Date,

  qualityType: {
    type: String,
    enum: ["fresh", "stale", "processed", "organic"]
  },

  /* Health & Safety Profile */
  healthBenefits: [String],

  risks: [String],

  isAllergen: {
    type: Boolean,
    default: false
  }

});



/* ================= PANTRY ================= */
const PantrySchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ingredients: [{

    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient"
    },

    currentQuantity: {
    type: Number,
    min: 0
    }

  }]

});



/* ================= RECIPE ================= */
const RecipeSchema = new Schema({

  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },

  cookingTime: String,

  videourl: String,

  recipeTag: [String],

  isPublic: {
    type: Boolean,
    default: true
  },

  steps: [String],

  ingredients: [{

    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient"
    },

    quantity: String,

    substituteSuggestions: [String]

  }],

  /* Nutrition calculation */
  nutrition: {
  calories: { type: Number, min: 0 },
  protein: { type: Number, min: 0 },
  carbs: { type: Number, min: 0 },
  fat: { type: Number, min: 0 }
}

});



/* ================= REVIEW ================= */
const ReviewSchema = new Schema({

  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: String

}, { timestamps: true });



/* ================= SOCIAL COOKING FEED ================= */
const SocialCookingFeedSchema = new Schema({

  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  photoUrl: String,

  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],

  comments: [{

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    text: String

  }],

  shareCount: {
    type: Number,
    default: 0
  }

});



/* ================= SHOPPING LIST ================= */
const ShoppingListSchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ingredients: [{

    name: String,

    quantity: String,

    isPurchased: {
      type: Boolean,
      default: false
    },

    externalLink: String

  }]

});



/* ================= SHOPPING CART ================= */
const ShoppingCartSchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [{

    name: String,

    price: {
    type: Number,
    min: 0
    },

   quantity: {
    type: Number,
    min: 1
    }

  }]

});



/* ================= CHECKOUT ================= */
const CheckoutSchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  cartId: {
    type: Schema.Types.ObjectId,
    ref: "ShoppingCart"
  },

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  totalAmount: Number

});



/* ================= HISTORY ================= */
const HistorySchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  },

  cookedDate: {
    type: Date,
    default: Date.now
  },

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