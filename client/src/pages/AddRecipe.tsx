import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Plus, Youtube, Save, Loader2, ListChecks, ShoppingBasket, Image as ImageIcon, X, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);
  
  const [recipeData, setRecipeData] = useState({
    title: "",
    difficulty: "easy",
    cookingTime: "",
    videourl: "",
    imageUrl: "", 
    steps: [""],
    ingredients: [{ ingredientId: "", value: "", unit: "g" }],
    isPublic: true,
  });

  // ১. ইনগ্রেডিয়েন্ট লিস্ট ফেচ করা এবং ড্রাফট ডাটা রিকভার করা
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get("/master-ingredients");
        setIngredientsList(res.data.data || res.data || []);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
      }
    };

    fetchIngredients();

    // মাস্টার পেজ থেকে ফিরে আসলে ডাটা রিকভারি
    const savedDraft = localStorage.getItem("recipe_draft");
    if (savedDraft) {
      setRecipeData(JSON.parse(savedDraft));
      localStorage.removeItem("recipe_draft"); 
    }
  }, []);

  // ২. মাস্টার ইনগ্রেডিয়েন্ট অ্যাড করতে যাওয়ার আগে ডাটা সেভ করা
  const handleQuickAddIngredient = () => {
    localStorage.setItem("recipe_draft", JSON.stringify(recipeData));
    navigate("/admin-dashboard/master-ingredients");
  };

  const addStep = () => setRecipeData({ ...recipeData, steps: [...recipeData.steps, ""] });
  
  const addIngredientField = () => setRecipeData({
    ...recipeData, 
    ingredients: [...recipeData.ingredients, { ingredientId: "", value: "", unit: "g" }]
  });

  const removeIngredientField = (index: number) => {
    const newIngs = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, ingredients: newIngs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ownerId = localStorage.getItem("userId");
      
      // ব্যাকএন্ড স্কিমা (RecipeSchema) অনুযায়ী ডাটা ফরম্যাট করা
      const formattedIngredients = recipeData.ingredients
        .filter(ing => ing.ingredientId !== "" && ing.value !== "") 
        .map(ing => ({
          ingredientId: ing.ingredientId,
          quantityValue: Number(ing.value), // backend expects Number
          unit: ing.unit                   // backend expects unit string
        }));

      const finalData = {
        ownerId,
        title: recipeData.title,
        difficulty: recipeData.difficulty,
        cookingTime: recipeData.cookingTime,
        videourl: recipeData.videourl,
        imageUrl: recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        steps: recipeData.steps.filter(s => s.trim() !== ""),
        ingredients: formattedIngredients,
        isPublic: recipeData.isPublic
      };
      
      const response = await api.post("/recipes", finalData);
      
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload(); 
        }, 2000);
      }

    } catch (err: any) {
      console.error("Submission Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create recipe. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 md:p-10 bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl animate-in fade-in duration-700 text-white">
      
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-[3.5rem] animate-in zoom-in duration-300">
          <div className="bg-orange-500 p-4 rounded-full mb-4 shadow-lg shadow-orange-500/50">
            <CheckCircle2 size={50} className="text-white animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic">Recipe Deployed!</h2>
          <p className="text-orange-400 font-bold mt-2">Successfully added to system 🚀</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6 text-white">
          <ChefHat size={40} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">
          Forge Master <span className="text-orange-500">Recipe</span>
        </h2>
        <p className="text-gray-500 font-medium mt-2 tracking-widest text-[10px] uppercase italic">Admin Terminal: V1.0.5</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* IMAGE SECTION */}
        <div className="space-y-4">
          <label className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Recipe Visual URL
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <input 
              type="url"
              placeholder="https://..." 
              className="flex-grow bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all font-medium w-full"
              value={recipeData.imageUrl}
              onChange={(e) => setRecipeData({...recipeData, imageUrl: e.target.value})}
            />
            <div className="w-full md:w-48 h-32 rounded-2xl border border-white/5 overflow-hidden bg-black/40 flex items-center justify-center relative shrink-0">
              {recipeData.imageUrl ? (
                <img src={recipeData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">No Preview</span>
              )}
            </div>
          </div>
        </div>

        {/* Basic Metadata */}
        <div className="grid md:grid-cols-2 gap-4">
          <input 
            type="text"
            placeholder="Recipe Title" 
            className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all font-medium"
            value={recipeData.title}
            onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
            required
          />
          <div className="flex gap-4">
            <select 
              className="bg-slate-800 border border-white/10 p-5 rounded-2xl text-white/70 outline-none focus:border-orange-500/50 w-full font-medium"
              value={recipeData.difficulty}
              onChange={(e) => setRecipeData({...recipeData, difficulty: e.target.value})}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input 
              type="text"
              placeholder="30 Mins" 
              className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 w-full font-medium"
              value={recipeData.cookingTime}
              onChange={(e) => setRecipeData({...recipeData, cookingTime: e.target.value})}
            />
          </div>
        </div>

        {/* YouTube */}
        <div className="space-y-4">
          <label className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <Youtube className="w-3 h-3" /> YouTube Video Source
          </label>
          <input 
            type="url"
            placeholder="Paste YouTube Link..." 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-500/50 transition-all font-medium"
            value={recipeData.videourl}
            onChange={(e) => setRecipeData({...recipeData, videourl: e.target.value})}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-green-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <ListChecks className="w-3 h-3" /> Cooking Algorithm (Steps)
            </label>
            <button type="button" onClick={addStep} className="text-[10px] font-black text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-transparent p-0 border-none cursor-pointer uppercase tracking-tighter">
              <Plus size={12} /> Add Phase
            </button>
          </div>
          {recipeData.steps.map((step, idx) => (
            <div key={idx} className="relative group">
               <textarea 
                placeholder={`Step ${idx + 1} details...`}
                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-gray-300 outline-none resize-none font-medium focus:border-green-500/30 transition-all"
                rows={2}
                value={step}
                onChange={(e) => {
                  const newSteps = [...recipeData.steps];
                  newSteps[idx] = e.target.value;
                  setRecipeData({...recipeData, steps: newSteps});
                }}
              />
              {recipeData.steps.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => setRecipeData({...recipeData, steps: recipeData.steps.filter((_, i) => i !== idx)})}
                  className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Ingredient Mapping Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <ShoppingBasket className="w-3 h-3" /> Ingredient Matrix
            </label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleQuickAddIngredient} 
                className="text-[10px] font-black text-green-400 hover:text-green-300 flex items-center gap-1 bg-transparent p-0 border-none cursor-pointer uppercase tracking-tighter border-b border-green-400/20"
              >
                <Plus size={12} /> Master Item
              </button>
              <button 
                type="button" 
                onClick={addIngredientField} 
                className="text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-transparent p-0 border-none cursor-pointer uppercase tracking-tighter border-b border-blue-400/20"
              >
                <Plus size={12} /> Component
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {recipeData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 bg-white/5 p-4 rounded-[2.5rem] border border-white/5 group animate-in slide-in-from-left-2 duration-300 relative">
                {/* Ingredient Select */}
                <select 
                  className="flex-grow bg-slate-800 border border-white/10 p-4 rounded-2xl text-white/80 outline-none focus:border-blue-500/30 font-medium"
                  value={ing.ingredientId}
                  onChange={(e) => {
                    const newIngs = [...recipeData.ingredients];
                    newIngs[idx].ingredientId = e.target.value;
                    setRecipeData({...recipeData, ingredients: newIngs});
                  }}
                  required
                >
                  <option value="">Select Ingredient</option>
                  {ingredientsList.map(item => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>

                {/* Quantity & Unit */}
                <div className="flex gap-2">
                  <input 
                    type="number"
                    min="1"
                    placeholder="Qty" 
                    className="w-24 bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500/30 font-medium"
                    value={ing.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      const finalVal = parseFloat(val) < 0 ? "0" : val; 
                      const newIngs = [...recipeData.ingredients];
                      newIngs[idx].value = finalVal;
                      setRecipeData({...recipeData, ingredients: newIngs});
                    }}
                    required
                  />
                  <select 
                    className="w-28 bg-slate-800 border border-white/10 p-4 rounded-2xl text-white/70 outline-none focus:border-blue-500/30 font-medium"
                    value={ing.unit}
                    onChange={(e) => {
                      const newIngs = [...recipeData.ingredients];
                      newIngs[idx].unit = e.target.value;
                      setRecipeData({...recipeData, ingredients: newIngs});
                    }}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                    <option value="tsp">tsp</option>
                    <option value="tbsp">tbsp</option>
                  </select>
                </div>

                {/* Remove Ing Button */}
                {recipeData.ingredients.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeIngredientField(idx)}
                    className="md:ml-2 text-red-500/40 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-7 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save />
              <span className="tracking-[0.3em] uppercase text-sm">Deploy Master Recipe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}