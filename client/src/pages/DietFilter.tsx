import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Clock, Flame, Loader2, Filter } from 'lucide-react';
import api from '../services/api';

const DIET_OPTIONS = [
    { label: 'All',         value: ''            },
    { label: 'Vegan',       value: 'vegan'       },
    { label: 'Diabetic',    value: 'diabetic'    },
    { label: 'Halal',       value: 'halal'       },
    { label: 'Weight Loss', value: 'weight-loss' },
  ];

export default function DietFilter() {
  const [recipes, setRecipes]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchFiltered = async (diet: string) => {
    setLoading(true);
    try {
      const url = diet ? `/recipes/public?diet=${diet}` : `/recipes/public`;
      const res = await api.get(url);
      setRecipes(res.data);
    } catch (err) {
      console.error("Failed to fetch filtered recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltered('');
  }, []);

  const handleFilter = (value: string) => {
    if (value === '') {
      setActiveTags([]);
      fetchFiltered('');
      return;
    }
    setActiveTags(prev => {
      const isSelected = prev.includes(value);
      const newTags = isSelected
        ? prev.filter(t => t !== value)
        : [...prev, value];
      fetchFiltered(newTags.join(','));
      return newTags;
    });
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md text-left">
        <div className="flex items-center gap-3 mb-2">
          <Filter className="text-orange-500 w-6 h-6" />
          <h1 className="text-3xl font-black text-white tracking-tight">Diet Filter</h1>
        </div>
        <p className="text-gray-400 font-medium">Browse recipes that match your dietary needs</p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {DIET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilter(option.value)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                (option.value === '' ? activeTags.length === 0 : activeTags.includes(option.value))
                  ? 'bg-white text-orange-500 border-white scale-105 shadow-lg shadow-white/20'
                  : 'bg-white/5 text-white border-white/30 hover:bg-white/10 hover:border-white/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20 gap-4 text-orange-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="font-black uppercase tracking-widest text-xs">Filtering Recipes...</span>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-orange-500/40 transition-all duration-500 flex flex-col shadow-xl"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  recipe.difficulty?.toLowerCase() === 'easy'   ? 'bg-green-500 text-white' :
                  recipe.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500 text-black' :
                  recipe.difficulty?.toLowerCase() === 'hard'   ? 'bg-red-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {recipe.difficulty || 'N/A'}
                </div>

                {/* Diet Tags */}
                {recipe.recipeTag && recipe.recipeTag.length > 0 && (
                  <div className="absolute top-4 right-4 flex flex-col gap-1">
                    {recipe.recipeTag.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="bg-black/60 text-orange-400 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border border-orange-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow text-left space-y-4">
                <h3 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors leading-tight">
                  {recipe.title}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-[11px] font-black">{recipe.cookingTime || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-300 text-[11px] font-black">{recipe.nutrition?.calories || 0} kcal</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/user-dashboard/recipe/${recipe._id}`)}
                  className="w-full py-3 bg-white/5 hover:bg-white text-white hover:text-black font-black rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group/btn cursor-pointer text-xs uppercase tracking-widest"
                >
                  <Utensils className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-gray-500 font-black text-xl uppercase tracking-widest">No recipes found</p>
          <p className="text-gray-600 text-xs mt-2">Try a different diet filter</p>
        </div>
      )}
    </div>
  );
}