import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, CheckCircle, ArrowLeft, Loader2, Clock, Flame, 
  AlertTriangle, ChefHat, Zap, BarChart2, Droplet 
} from "lucide-react";
import api from "../services/api";
import RecipeReviews from "../components/RecipeReviews"; 
import { addToShoppingList } from "../services/shoppingListService"; 

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [missingData, setMissingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

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
        if (missingRes.status === "fulfilled") setMissingData(missingRes.value.data);

      } catch (err) {
        console.error("Critical Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId") || "";
    if (!missingData?.missing?.length) return;

    const ingredients = missingData.missing.map((m: any) => ({
      name: m.ingredientId?.name || m.name || "Unknown",
      quantity: m.quantity || "1",
    }));

    try {
      await addToShoppingList(userId, ingredients);
      setAddedToCart(true);
    } catch (err) {
      console.error("Failed to add to shopping list", err);
    }
  };

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

  const nutrition = recipe.nutrition || {};

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

          {/* Highlights */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold">{recipe.cookingTime || "N/A"}</span>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white font-bold">{nutrition.calories || 0} kcal</span>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <ChefHat className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold capitalize">{recipe.difficulty || "medium"}</span>
            </div>
          </div>

          {/* Nutrition Stats */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 grid grid-cols-3 gap-4">
             <div className="text-center">
                <Zap className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-white font-black">{nutrition.protein || 0}g</p>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Protein</p>
             </div>
             <div className="text-center">
                <BarChart2 className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-black">{nutrition.carbs || 0}g</p>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Carbs</p>
             </div>
             <div className="text-center">
                <Droplet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-black">{nutrition.fat || 0}g</p>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Fat</p>
             </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Cooking Steps</h3>
            {recipe.steps?.map((step: string, idx: number) => (
              <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-5">
                <span className="text-orange-500 font-black text-2xl">{idx + 1}</span>
                <p className="text-gray-300 font-medium">{step}</p>
              </div>
            ))}
          </div>

          {id && <RecipeReviews recipeId={id} />}
        </div>

        {/* Sidebar: Ingredients (COMPLETELY FIXED QUANTITY LOGIC) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/10 to-transparent p-8 rounded-[3rem] border border-white/10 shadow-xl backdrop-blur-md">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="text-orange-500" /> Ingredients
            </h3>
            
            <div className="space-y-6 text-left">
              {recipe.ingredients?.map((ing: any, idx: number) => {
                const recipeIngId = (ing.ingredientId?._id || ing.ingredientId || "").toString();
                const isMissing = missingData?.missing?.some((m: any) => 
                  (m.ingredientId?._id || m.ingredientId || m._id || m).toString() === recipeIngId
                );

                // ✅ Improved logic to find quantity from all possible fields
                const displayQuantity = ing.quantity 
                  ? ing.quantity 
                  : (ing.quantityValue ? `${ing.quantityValue} ${ing.unit || ""}` : "As needed");

                return (
                  <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className={`font-bold ${!isMissing ? "text-white" : "text-gray-500 line-through decoration-red-500/50"}`}>
                          {ing.ingredientId?.name || ing.name || "Ingredient"}
                        </span>
                        
                        {/* Displaying fixed quantity here */}
                        <span className="text-xs text-orange-400 font-black uppercase tracking-wider mt-0.5">
                          {displayQuantity}
                        </span>
                        
                        {ing.ingredientId?.isAllergen && (
                          <span className="text-[9px] text-red-400 font-black mt-1 flex items-center gap-1 uppercase">
                            <AlertTriangle size={10} /> Allergen
                          </span>
                        )}
                      </div>
                      
                      {!isMissing ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={18} className="text-red-500" />
                      )}
                    </div>

                    {isMissing && ing.substituteSuggestions?.length > 0 && (
                      <p className="text-[10px] text-orange-300 italic font-medium mt-1 pl-2 border-l border-orange-500/50">
                        Try: {ing.substituteSuggestions.join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Shopping List Section */}
            {missingData && !missingData.isReady && (
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                    addedToCart ? 'bg-green-600 text-white shadow-lg' : 'bg-orange-600 hover:bg-orange-500 text-white'
                  }`}
                >
                  {addedToCart ? '✅ Added to List' : '🛒 Add Missing to List'}
                </button>
                {addedToCart && (
                  <button onClick={() => navigate('/user-dashboard/shopping-list')} className="w-full py-3 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 rounded-xl hover:bg-white/5 transition">
                    View List →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}