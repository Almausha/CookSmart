import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Clock, Flame, ChefHat, Utensils, Loader2, AlertTriangle } from 'lucide-react';
import api from '../services/api'; 

interface Ingredient {
  name: string;
  isAllergen?: boolean;
  risks?: string[];
}

interface Recipe {
  _id: string;
  title: string;
  difficulty: string;
  cookingTime: string;
  imageUrl?: string;
  nutrition: { calories: number; protein: number; };
  ownerId?: { name: string; };
  ingredients: Array<{ ingredientId: Ingredient; quantity: string; }>;
}

export default function PublicRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipes/public');
        setRecipes(response.data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20 gap-4 text-orange-500 font-black animate-pulse uppercase tracking-[0.2em] text-xs">
      <Loader2 className="w-10 h-10 animate-spin" />
      Loading Recipes...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md text-left">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Public Recipes</h1>
          <p className="text-gray-400 font-medium">Discover culinary masterpieces from our community</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500/50 w-full md:w-80 transition-all font-medium"
          />
        </div>
      </div>

      {/* 2. Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => {

          const allergenIngredients = recipe.ingredients.filter(
            ing => ing.ingredientId?.isAllergen
          );
          const hasAllergen = allergenIngredients.length > 0;

          return (
            <div key={recipe._id} className={`group bg-white/5 border rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col shadow-xl ${
              hasAllergen 
                ? 'border-red-500/30 hover:border-red-500/60' 
                : 'border-white/10 hover:border-orange-500/40'
            }`}>
              
              {/* Image Section */}
              <div className="relative h-52 w-full overflow-hidden shrink-0">
                <img 
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Difficulty Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  recipe.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500 text-white' :
                  recipe.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500 text-black' :
                  recipe.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {recipe.difficulty || 'N/A'}
                </div>

                {/* Allergen Badge */}
                {hasAllergen && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500/90 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                    <AlertTriangle className="w-3 h-3" />
                    Allergen
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow text-left space-y-6">
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors mb-2 leading-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                    <ChefHat className="w-4 h-4" />
                    <span>By {recipe.ownerId?.name || 'Community Chef'}</span>
                  </div>
                </div>

                {/* Allergen Detail - FIXED TypeScript Error Here */}
                {hasAllergen && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Contains Allergens</p>
                    </div>
                    <p className="text-[10px] text-red-300/70 font-medium leading-relaxed">
                      {allergenIngredients.map(ing => ing.ingredientId?.name).join(', ')}
                      {/* Fixed logic using optional chaining and nullish coalescing */}
                      {allergenIngredients.some(ing => (ing.ingredientId?.risks?.length ?? 0) > 0) && (
                        <span> — {allergenIngredients.flatMap(ing => ing.ingredientId?.risks || []).join(', ')}</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-[11px] font-black">{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-300 text-[11px] font-black">{recipe.nutrition?.calories || 0} kcal</span>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Main Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                        ing.ingredientId?.isAllergen
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-white/5 text-gray-400 border-white/5'
                      }`}>
                        {ing.ingredientId?.isAllergen && '⚠️ '}
                        {ing.ingredientId?.name || 'Ingredient'}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-[10px] text-orange-500 font-black">+{recipe.ingredients.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => navigate(`/user-dashboard/recipe/${recipe._id}`)}
                  className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black font-black rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group/btn cursor-pointer active:scale-95"
                >
                  <Utensils className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                  View Full Recipe
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-gray-500 font-black text-xl uppercase tracking-widest">No recipes found</p>
        </div>
      )}
    </div>
  );
}