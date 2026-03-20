import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Sparkles, CheckCircle2, Utensils, Loader2, AlertCircle } from "lucide-react";
import api from "../services/api"; 

interface Ingredient {
  ingredientId: { _id: string; name: string; };
  quantity: string;
}

interface RecommendedRecipe {
  _id: string;
  title: string;
  imageUrl?: string;
  matchPercentage: number;
  isReady: boolean;
  ingredients: Ingredient[];
}

export default function PantryRecommendation() {
  const [recommendations, setRecommendations] = useState<RecommendedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = localStorage.getItem("userId");
    
        const response = await api.get(`/recommend/${userId}`);
        setRecommendations(response.data || []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-orange-500 font-black animate-pulse uppercase tracking-widest text-xs">Scanning your pantry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-12 rounded-[3.5rem] shadow-2xl shadow-orange-500/20 relative overflow-hidden text-left">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-12 h-12 text-white animate-bounce" />
            <h1 className="text-5xl font-extrabold tracking-tighter italic text-white">Pantry Magic</h1>
          </div>
          <p className="text-white/90 text-xl font-medium max-w-md">
            We found {recommendations.length} recipes you can cook right now!
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Recommendations Grid */}
      <div className="grid gap-10">
        {recommendations.length > 0 ? (
          recommendations.map((recipe) => (
            <div key={recipe._id} className="group bg-white/5 border border-white/10 p-8 rounded-[3.5rem] flex flex-col md:flex-row gap-10 items-center hover:bg-white/[0.07] transition-all duration-500 hover:border-orange-500/40 shadow-lg text-left w-full">
              
              <div className="relative shrink-0">
                <img
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  className="w-64 h-64 rounded-[3rem] object-cover border-8 border-white/5 group-hover:rotate-2 transition-all duration-500 shadow-2xl"
                  alt={recipe.title}
                />
                {recipe.isReady && (
                  <div className="absolute -top-4 -right-4 bg-green-500 p-3 rounded-full shadow-xl border-4 border-black animate-pulse">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-4xl font-black text-white tracking-tight">{recipe.title}</h2>
                  <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${recipe.isReady ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                    {recipe.matchPercentage}% Match
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Required Ingredients</p>
                  <div className="flex flex-wrap gap-3">
                    {recipe.ingredients.map((ing, idx) => (
                      <span key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-sm text-gray-200 font-bold">
                        <CheckCircle2 className={`w-4 h-4 ${recipe.isReady ? "text-green-500" : "text-gray-500"}`} />
                        {ing.ingredientId?.name || "Secret Ingredient"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Let's Cook Button  */}
                <button 
                  onClick={() => navigate(`/user-dashboard/recipe/${recipe._id}`)}
                  className="group/btn flex items-center gap-4 bg-white text-black px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5 border-none cursor-pointer"
                >
                  <Utensils className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                  Let's Cook
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white/5 border-4 border-dashed border-white/10 rounded-[4rem] space-y-6">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto" />
            <div className="space-y-2">
              <p className="text-gray-400 text-2xl font-black text-center">Your pantry is lonely!</p>
              <p className="text-gray-600 font-medium text-center">Add some ingredients to see the magic happen.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}