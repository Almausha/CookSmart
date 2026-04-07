import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, ArrowLeft, Loader2, Clock, Flame, AlertTriangle, ChefHat, Zap, BarChart2, Droplet,ShieldAlert } from "lucide-react";
import api from "../services/api";
import RecipeReviews from "../components/RecipeReviews"; // ✅ Feature 2

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [missingData, setMissingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");

        const [recipeRes, videoRes, missingRes] = await Promise.allSettled([
          api.get(`/recipes/${id}`),
          api.get(`/video/${id}`),
          api.get(`/check-missing/${id}/${userId}`)
        ]);

        if (recipeRes.status === "fulfilled") setRecipe(recipeRes.value.data);
        if (videoRes.status === "fulfilled") setVideoData(videoRes.value.data);
        if (missingRes.status === "fulfilled") {
          setMissingData(missingRes.value.data);
        }

      } catch (err) {
        console.error("Critical Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllDetails();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-orange-500">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-black uppercase tracking-widest text-xs">Unlocking Secrets...</p>
    </div>
  );

  if (!recipe) return (
    <div className="text-white text-center py-20 space-y-4">
      <p className="text-2xl font-bold text-red-500">Recipe not found!</p>
      <button onClick={() => navigate(-1)} className="text-orange-500 underline">Go Back</button>
    </div>
  );

  // FR-17: difficulty color logic
  const difficultyColor =
    recipe.difficulty === "easy" ? "text-green-400" :
    recipe.difficulty === "medium" ? "text-yellow-400" :
    recipe.difficulty === "hard" ? "text-red-400" :
    "text-gray-400";

  // FR-18/19: nutrition values with fallback to 0
  const nutrition = recipe.nutrition || {};
  const calories = nutrition.calories || 0;
  const protein  = nutrition.protein  || 0;
  const carbs    = nutrition.carbs    || 0;
  const fat      = nutrition.fat      || 0;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Kitchen
      </button>

      {/* Video/Image Section */}
      <div className="relative group">
        {videoData?.embedUrl ? (
          <div className="aspect-video rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl bg-black">
            <iframe
              width="100%" height="100%"
              src={videoData.embedUrl}
              title={recipe.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img src={recipe.imageUrl} className="w-full h-96 object-cover rounded-[3rem] border-8 border-white/5 shadow-2xl" alt={recipe.title} />
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 text-left">
          <h1 className="text-5xl font-black text-white tracking-tighter italic">{recipe.title}</h1>

          {/* FR-16 + FR-17: Cooking Time + Difficulty Badges */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold">{recipe.cookingTime || "N/A"}</span>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white font-bold">{calories} kcal</span>
            </div>

            {/* FR-17: Difficulty Badge */}
            {recipe.difficulty && (
              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-yellow-400" />
                <span className={`font-bold capitalize ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              </div>
            )}

            {missingData?.isReady && (
              <div className="bg-green-500/20 px-6 py-3 rounded-2xl border border-green-500/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-bold uppercase text-xs tracking-widest">Ready to Cook</span>
              </div>
            )}
          </div>

          {/* FR-18/19: Nutrition Card */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <Zap className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-white font-black text-lg">{protein}g</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Protein</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <BarChart2 className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-black text-lg">{carbs}g</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Carbs</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <Droplet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-black text-lg">{fat}g</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Fat</p>
              </div>
            </div>
          </div>

          {/* Cooking Steps */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Cooking Steps</h3>
            <div className="space-y-4">
              {recipe.steps?.map((step: string, idx: number) => (
                <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-5 hover:bg-white/[0.08] transition-all">
                  <span className="text-orange-500 font-black text-2xl">{idx + 1}</span>
                  <p className="text-gray-300 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Feature 2: Reviews & Ratings Section */}
          {id && <RecipeReviews recipeId={id} />}

        </div>

        {/* Sidebar: Ingredients with Substitute Logic */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/10 to-transparent p-8 rounded-[3rem] border border-white/10 shadow-xl backdrop-blur-md">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="text-orange-500" /> Ingredients
            </h3>
            <div className="space-y-6 text-left">
              {recipe.ingredients?.map((ing: any, idx: number) => {
                const recipeIngId = (ing.ingredientId?._id || ing.ingredientId || "").toString();

                const isMissing = missingData?.missing?.some((m: any) => {
                  const mId = (m.ingredientId?._id || m.ingredientId || m._id || m).toString();
                  return mId === recipeIngId;
                });

                return (
                  <div key={idx} className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-center justify-between group">
                      <div className="flex flex-col">
                        <span className={`font-bold transition-all ${!isMissing ? "text-white" : "text-gray-500 line-through decoration-red-500/40"}`}>
                          {ing.ingredientId?.name || "Ingredient"}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{ing.quantity}</span>
                        {/* FR-21: Allergen warning per ingredient */}
                        {ing.ingredientId?.isAllergen && (
                          <div className="flex items-center gap-1 mt-1">
                            <ShieldAlert className="w-3 h-3 text-red-400" />
                            <span className="text-[9px] text-red-400 font-black uppercase tracking-wider">Allergen</span>
                            {ing.ingredientId?.risks?.length > 0 && (
                              <span className="text-[9px] text-red-300/60 font-medium">
                                — {ing.ingredientId.risks.join(', ')}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Substitute suggestion for allergen */}
                        {ing.ingredientId?.isAllergen && ing.substituteSuggestions?.length > 0 && (
                          <p className="text-[9px] text-orange-400 font-bold uppercase italic tracking-wider mt-1">
                            Alt: {ing.substituteSuggestions.join(', ')}
                          </p>
                        )}
                      </div>
                      {!isMissing ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded-md font-black uppercase border border-red-500/20">Missing</span>
                        </div>
                      )}
                    </div>

                    {/* Substitute Logic Section */}
                    {isMissing && (
                      <div className="pl-3 border-l-2 border-orange-500/30 py-1">
                        {ing.substituteSuggestions && ing.substituteSuggestions.length > 0 ? (
                          <p className="text-[10px] text-orange-400 font-bold uppercase italic tracking-wider">
                            Try: {ing.substituteSuggestions.join(", ")}
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-600 italic uppercase font-bold tracking-tighter">
                            No substitute to show
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {missingData && !missingData.isReady && (
              <button className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-500 transition-all transform hover:scale-105 shadow-lg shadow-orange-900/20 uppercase tracking-widest text-xs">
                Add Missing to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
