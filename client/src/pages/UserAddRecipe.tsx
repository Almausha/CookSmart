import { useState, useEffect } from "react";
import { Plus, Loader2, Image as ImageIcon, X, Package, CheckCircle2 } from "lucide-react";
import api from "../services/api";

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
    ingredients: [] as { ingredientId: string, name: string, quantity: string }[],
    isPublic: true,
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  });

  useEffect(() => {
    const fetchPantry = async () => {
      setIsPantryLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || userId === "undefined") {
          console.warn("User ID not found. Please log in.");
          setIsPantryLoading(false);
          return;
        }

        const res = await api.get(`/user-recipe/user-ingredients/${userId}`);
        // ব্যাকএন্ড যদি সরাসরি অ্যারে পাঠায় তবে res.data, আর যদি অবজেক্ট পাঠায় তবে res.data.data
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setPantryItems(data || []);
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
        ingredients: [...prev.ingredients, { ingredientId: item._id, name: item.name, quantity: "" }]
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

  const addStep = () => setRecipeData({ ...recipeData, steps: [...recipeData.steps, ""] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeData.ingredients.length === 0) {
      alert("Please select at least one ingredient from your pantry!");
      return;
    }
    
    setLoading(true);
    try {
      const ownerId = localStorage.getItem("userId");
      await api.post("/user-recipe/recipes", { ...recipeData, ownerId });
      setShowSuccess(true);
      setTimeout(() => { window.location.reload(); }, 2500);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to save recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 text-white space-y-8 relative">
      
      {/* SUCCESS MESSAGE OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-6 p-10">
            <div className="relative mx-auto w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] animate-bounce">
              <CheckCircle2 className="text-white w-12 h-12" />
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Recipe <span className="text-orange-500">Forged!</span></h2>
            <p className="text-slate-400 font-medium tracking-widest text-[10px] uppercase">Reloading feed...</p>
          </div>
        </div>
      )}

      {/* PANTRY SECTION */}
      <div className="bg-gradient-to-r from-orange-600/20 to-transparent p-6 rounded-[2rem] border border-orange-500/20 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-orange-500" />
          <h2 className="text-xl font-bold italic uppercase tracking-tighter">Your Pantry Stock</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {isPantryLoading ? (
            <div className="flex items-center gap-2 text-orange-500 text-xs animate-pulse font-bold">
              <Loader2 className="animate-spin" size={16} /> Syncing Pantry...
            </div>
          ) : pantryItems.length > 0 ? (
            pantryItems.map((item: any) => (
              <button
                key={item._id}
                type="button"
                onClick={() => addFromPantry(item)}
                className="bg-white/5 hover:bg-orange-500 hover:scale-105 border border-white/10 px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 group"
              >
                <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                {item.name} <span className="text-white/40 group-hover:text-white/80">({item.currentQuantity})</span>
              </button>
            ))
          ) : (
            <p className="text-slate-500 text-xs italic">Your pantry is empty or not found.</p>
          )}
        </div>
      </div>

      {/* RECIPE FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter"><span className="text-orange-500">Forge</span> New Recipe</h1>
          <p className="text-slate-500 text-[10px] tracking-[0.5em] mt-2 font-bold italic">CRAFTING_STATION_ACTIVE</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="h-72 bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
              {recipeData.imageUrl ? (
                <img src={recipeData.imageUrl} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <div className="text-center space-y-2 opacity-20">
                  <ImageIcon size={60} className="mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Image Preview Area</p>
                </div>
              )}
              <input 
                type="url" placeholder="Paste High-Res Image URL"
                className="absolute bottom-6 left-6 right-6 bg-slate-900/90 p-4 rounded-2xl border border-white/10 text-xs outline-none focus:border-orange-500 transition-all"
                onChange={(e) => setRecipeData({...recipeData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-orange-500 ml-2 tracking-widest">Recipe Title</label>
              <input 
                type="text" required placeholder="Name of your creation..."
                className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none text-xl font-bold focus:border-orange-500 transition-all"
                onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black text-orange-500 ml-2 tracking-widest">Difficulty</label>
                 <select 
                   className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none appearance-none cursor-pointer focus:border-orange-500"
                   onChange={(e)=>setRecipeData({...recipeData, difficulty: e.target.value})}
                 >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black text-orange-500 ml-2 tracking-widest">Time</label>
                 <input 
                  placeholder="e.g. 45m" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500"
                  onChange={(e)=>setRecipeData({...recipeData, cookingTime: e.target.value})}
                 />
               </div>
            </div>
          </div>
        </div>

        {/* Selected Ingredients List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Selected Ingredients</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipeData.ingredients.map((ing, idx) => (
              <div key={ing.ingredientId} className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/5 hover:border-orange-500/40 transition-all group">
                <span className="flex-grow text-xs font-black uppercase tracking-tight">{ing.name}</span>
                <input 
                  placeholder="Qty" 
                  className="w-20 bg-black/40 border border-white/10 p-2 rounded-xl text-center text-xs outline-none focus:border-orange-500"
                  value={ing.quantity}
                  onChange={(e) => {
                    const newIngs = [...recipeData.ingredients];
                    newIngs[idx].quantity = e.target.value;
                    setRecipeData({...recipeData, ingredients: newIngs});
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => removeIngredient(ing.ingredientId)} 
                  className="bg-red-500/10 p-2 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Steps Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Cooking Steps</h3>
          </div>
          <div className="space-y-4">
            {recipeData.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-black border border-green-500/20">{idx+1}</div>
                <textarea 
                  className="flex-grow bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-green-500 transition-all resize-none min-h-[80px]"
                  placeholder="What's the process?..."
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={addStep} 
              className="ml-14 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] uppercase font-black tracking-widest transition-all"
            >
              + Add Next Step
            </button>
          </div>
        </div>

        {/* Final Button */}
        <button 
          type="submit" disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 p-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-orange-900/40 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="animate-spin" /> <span>Forging...</span>
            </div>
          ) : (
            "Deploy Recipe to Feed"
          )}
        </button>
      </form>
    </div>
  );
}