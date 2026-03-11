import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Utensils, Loader2 } from 'lucide-react';
import axios from 'axios';

interface RecommendedRecipe {
  _id: string;
  title: string;
  imageUrl?: string;
  ingredients: Array<{
    ingredientId: { name: string };
    quantity: string;
  }>;
}

export default function PantryRecommendation() {
  const [recommendations, setRecommendations] = useState<RecommendedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = "000000000000000000000002"; 
        // ✅ সঠিক URL
        const response = await axios.get(`http://localhost:5000/api/recommend/${userId}`);
        console.log("API response:", response.data); // debug
        setRecommendations(response.data);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center gap-4">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      <p className="text-orange-500 font-black animate-pulse">Checking your pantry...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-10 rounded-[3rem] shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
              <h1 className="text-4xl font-black">Pantry Magic</h1>
            </div>
            <p className="text-white/90 text-lg font-medium">We found recipes matching your current stock!</p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Recommendation List */}
        <div className="grid gap-8">
          {recommendations.length > 0 ? recommendations.map((recipe) => (
            <div key={recipe._id} className="group bg-white/5 border border-white/10 p-8 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center hover:bg-white/[0.08] transition-all duration-500 hover:border-orange-500/30">
              
              {/* Recipe Image */}
              <div className="relative shrink-0">
                <img 
                  src={recipe.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZSc47cO2qqqkNwurkdFjJXANYBMq-g2z2fXkCwWbyZ5EWOXZkk66ByoIL1EkKLarQ1iFMGYN4xxIOYaaQ8GYfWL1fCH01ltX_UoDYfCys&s=10"} 
                  className="w-56 h-56 rounded-[2.5rem] object-cover border-4 border-white/5 group-hover:scale-105 transition-transform duration-500 shadow-xl" 
                  alt={recipe.title} 
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-grow space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-3xl font-black text-white group-hover:text-orange-500 transition-colors">
                    {recipe.title}
                  </h2>
                  <div className="px-5 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">
                    Ready to Cook
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest">Ingredients You Have:</p>
                  <div className="flex flex-wrap gap-3">
                    {recipe.ingredients.map((ing, idx) => (
                      <span key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm text-gray-300 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> {ing.ingredientId.name}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-orange-500/40">
                  <Utensils className="w-5 h-5" />
                  Start Cooking
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 text-xl font-bold">No recipes match your ingredients yet.</p>
              <p className="text-gray-600">Try adding "Chicken Breast" to your pantry!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
