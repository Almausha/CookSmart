import { useState, useEffect } from "react";
import { Plus, Loader2, Image as ImageIcon, X, Package, CheckCircle2 } from "lucide-react";
import api from "../services/api";

interface RecipeIngredient {
  ingredientId: string;
  name: string;
  value: string; 
  unit: string;  
  substituteSuggestions: string[];
}

export default function UserAddRecipe() {
  const [loading, setLoading] = useState(false);
  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  
  const [recipeData, setRecipeData] = useState({
    title: "",
    difficulty: "easy",
    cookingTime: "",
    videourl: "",
    imageUrl: "", 
    steps: [""],
    ingredients: [] as RecipeIngredient[],
    isPublic: true,
    recipeTag: [] as string[],
  });

  useEffect(() => {
    const fetchPantry = async () => {
      setIsPantryLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) { setIsPantryLoading(false); return; }
        const res = await api.get(`/user-recipe/user-ingredients/${userId}`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setPantryItems(data);
      } catch (err) {
        console.error("Pantry Fetch Error:", err);
      } finally {
        setIsPantryLoading(false);
      }
    };
    fetchPantry();
  }, []);

  const addFromPantry = (item: any) => {
    const exists = recipeData.ingredients.find(i => i.ingredientId === item._id);
    if (!exists) {
      setRecipeData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { 
          ingredientId: item._id, 
          name: item.name, 
          value: "", 
          unit: "g", 
          substituteSuggestions: [] 
        }]
      }));
    }
  };

  const removeIngredient = (id: string) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i.ingredientId !== id)
    }));
  };

  const handleStepChange = (idx: number, value: string) => {
    const newSteps = [...recipeData.steps];
    newSteps[idx] = value;
    setRecipeData({ ...recipeData, steps: newSteps });
  };

  const addStep = () => setRecipeData({ 
    ...recipeData, steps: [...recipeData.steps, ""] 
  });

  const toggleTag = (tag: string) => {
    setRecipeData(prev => ({
      ...prev,
      recipeTag: prev.recipeTag.includes(tag)
        ? prev.recipeTag.filter(t => t !== tag)
        : [...prev.recipeTag, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeData.ingredients.length === 0) {
      alert("Please select at least one ingredient!");
      return;
    }
    setLoading(true);
    try {
      const ownerId = localStorage.getItem("userId");
      const formattedIngredients = recipeData.ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        quantityValue: Number(ing.value) || 0,
        unit: ing.unit,
        substituteSuggestions: ing.substituteSuggestions
      }));
      const finalPayload = {
        title: recipeData.title,
        difficulty: recipeData.difficulty,
        cookingTime: recipeData.cookingTime,
        videourl: recipeData.videourl,
        imageUrl: recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        ownerId,
        ingredients: formattedIngredients,
        steps: recipeData.steps.filter(s => s.trim() !== ""),
        isPublic: recipeData.isPublic,
        recipeTag: recipeData.recipeTag,
        // nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } 
      };
      await api.post("/user-recipe/recipes", finalPayload);
      setShowSuccess(true);
      setTimeout(() => { window.location.reload(); }, 2500);
    } catch (err: any) {
      console.error("Submit error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 text-white space-y-8 relative font-sans">
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="text-white w-12 h-12" />
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
              Recipe <span className="text-orange-500">Forged!</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest">Successfully deployed to feed.</p>
          </div>
        </div>
      )}

      {/* PANTRY SECTION */}
      <div className="bg-gradient-to-r from-orange-600/20 to-transparent p-6 rounded-[2.5rem] border border-orange-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-orange-500" />
          <h2 className="text-xl font-bold italic uppercase tracking-tighter text-white">Quick-Add From Pantry</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {isPantryLoading ? (
            <div className="flex items-center gap-2 text-orange-500 text-xs animate-pulse font-bold">
              <Loader2 className="animate-spin" size={16} /> Syncing...
            </div>
          ) : pantryItems.length > 0 ? (
            pantryItems.map((item: any) => (
              <button
                key={item._id}
                type="button"
                onClick={() => addFromPantry(item)}
                className="bg-white/5 hover:bg-orange-500 border border-white/10 px-4 py-2 rounded-full text-xs transition-all flex items-center gap-2 group text-white"
              >
                <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                {item.name}
              </button>
            ))
          ) : (
            <p className="text-slate-500 text-xs italic">No items found in pantry.</p>
          )}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Forge <span className="text-orange-500">New Recipe</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="h-72 bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
              {recipeData.imageUrl ? (
                <img src={recipeData.imageUrl} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <ImageIcon size={60} className="opacity-20 text-white" />
              )}
              <input 
                type="url" placeholder="Image URL..."
                className="absolute bottom-6 left-6 right-6 bg-slate-900/90 p-4 rounded-2xl border border-white/10 text-xs outline-none focus:border-orange-500 transition-all text-white"
                value={recipeData.imageUrl}
                onChange={(e) => setRecipeData({...recipeData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <input 
              type="text" required placeholder="Recipe Title..."
              className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none text-xl font-bold focus:border-orange-500 transition-all text-white"
              value={recipeData.title}
              onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="bg-slate-800 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 text-white"
                value={recipeData.difficulty}
                onChange={(e) => setRecipeData({...recipeData, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input 
                placeholder="Time (e.g. 30m)"
                className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 text-white"
                value={recipeData.cookingTime}
                onChange={(e) => setRecipeData({...recipeData, cookingTime: e.target.value})}
              />
            </div>

            {/* FR-20: Diet Tags */}
            <div className="space-y-3 px-9">
              <label className="text-white/120 font-bold text-sm italic pl-5">
                Add Diet Tags — Select all that apply
              </label>
              <div className="flex flex-wrap gap-2 mt-4">
                {['vegan', 'diabetic', 'halal', 'weight-loss'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                      recipeData.recipeTag.includes(tag)
                        ? 'bg-white text-orange-500 border-white scale-105 shadow-md'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Mapping */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase border-l-4 border-orange-500 pl-4 text-white">
            Ingredients Mapping
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {recipeData.ingredients.map((ing, idx) => (
              <div key={ing.ingredientId} className="flex flex-col gap-3 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:border-orange-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="flex-grow text-xs font-black uppercase text-orange-400">{ing.name}</span>
                  <div className="flex gap-1 items-center bg-black/40 p-1 rounded-xl border border-white/10">
                    <input 
                      type="number" placeholder="0" required min="0"
                      className="w-12 bg-transparent text-center text-xs outline-none text-white"
                      value={ing.value}
                      onChange={(e) => {
                        const newIngs = [...recipeData.ingredients];
                        newIngs[idx].value = e.target.value;
                        setRecipeData({...recipeData, ingredients: newIngs});
                      }}
                    />
                    <select 
                      className="bg-transparent text-[10px] outline-none text-orange-500 font-bold cursor-pointer"
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
                  <button 
                    type="button" 
                    onClick={() => removeIngredient(ing.ingredientId)} 
                    className="text-red-500 hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
                <input 
                  placeholder="Substitutes (e.g. Honey, Sugar)" 
                  className="w-full bg-black/20 border border-white/5 p-3 rounded-xl text-[10px] outline-none italic text-white"
                  value={ing.substituteSuggestions.join(", ")}
                  onChange={(e) => {
                    const newIngs = [...recipeData.ingredients];
                    newIngs[idx].substituteSuggestions = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                    setRecipeData({...recipeData, ingredients: newIngs});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase border-l-4 border-green-500 pl-4 text-white">
            Cooking Steps
          </h3>
          <div className="space-y-4">
            {recipeData.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 font-black border border-green-500/20">
                  {idx+1}
                </div>
                <textarea 
                  className="flex-grow bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-green-500 min-h-[80px] resize-none text-white"
                  placeholder="Describe step..."
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={addStep} 
              className="ml-14 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
            >
              + Add Step
            </button>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 p-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] transition-all shadow-xl disabled:opacity-50 text-white cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Deploy Recipe to Feed"}
        </button>
      </form>
    </div>
  );
}