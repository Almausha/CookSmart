import { useState, useEffect } from 'react';
import { Search, Clock, Flame, ChefHat, ExternalLink, Utensils } from 'lucide-react';
import axios from 'axios';

interface Recipe {
  _id: string;
  title: string;
  difficulty: string;
  cookingTime: string;
  imageUrl?: string; // এটি যোগ করা হয়েছে
  nutrition: {
    calories: number;
    protein: number;
  };
  ownerId?: {
    name: string;
  };
  ingredients: Array<{
    ingredientId: { name: string };
    quantity: string;
  }>;
}

export default function PublicRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes/public');
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
    <div className="flex justify-center items-center h-64 text-orange-500 font-bold animate-pulse">
      Loading Recipes...
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Public Recipes</h1>
          <p className="text-gray-400 font-medium">Discover culinary masterpieces from our community</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500/50 w-full md:w-80 transition-all"
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10">
            
            {/* --- ছবির অংশটি এখানে শুরু --- */}
            <div className="relative h-52 w-full overflow-hidden">
              <img 
                src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            {/* --- ছবির অংশটি এখানে শেষ --- */}

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-500/20">
                  {recipe.difficulty}
                </div>
                <button className="text-white/40 hover:text-orange-500 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors mb-2">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                  <ChefHat className="w-4 h-4" />
                  <span>By {recipe.ownerId?.name || 'Community Chef'}</span>
                </div>
              </div>

              {/* Nutrition & Time Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm font-bold">{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-300 text-sm font-bold">{recipe.nutrition?.calories || 0} kcal</span>
                </div>
              </div>

              {/* Ingredients Preview */}
              <div className="space-y-3">
                <p className="text-xs font-black text-white/40 uppercase tracking-widest">Main Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 font-medium border border-white/5">
                      {ing.ingredientId.name}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <span className="text-xs text-orange-500 font-black">+{recipe.ingredients.length - 3} more</span>
                  )}
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-orange-500 text-white font-black rounded-2xl border border-white/10 hover:border-orange-500 transition-all flex items-center justify-center gap-3 group/btn">
                <Utensils className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                View Full Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-gray-500 font-bold text-xl">No recipes found matching your search.</p>
        </div>
      )}
    </div>
  );
}