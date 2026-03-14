import { useState, useEffect } from "react";
import { ChefHat, Plus, Youtube, Save, Loader2, ListChecks, ShoppingBasket, Image as ImageIcon, X, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function AddRecipe() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // সাকসেস মেসেজের জন্য স্টেট
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);
  
  const [recipeData, setRecipeData] = useState({
    title: "",
    difficulty: "easy",
    cookingTime: "",
    videourl: "",
    imageUrl: "", 
    steps: [""],
    ingredients: [{ ingredientId: "", quantity: "" }],
    isPublic: true,
  });

  const fetchIngredients = async () => {
    try {
      const res = await api.get("/ingredients");
      setIngredientsList(res.data);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleQuickAddIngredient = async () => {
    const name = prompt("Enter new ingredient name (e.g. Himalayan Salt):");
    if (!name || name.trim() === "") return;

    try {
      setLoading(true);
      await api.post("/ingredients", { name: name.trim() });
      alert(`'${name}' has been added to the master list! 🚀`);
      await fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Failed to add new ingredient.");
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => setRecipeData({ ...recipeData, steps: [...recipeData.steps, ""] });
  
  const addIngredientField = () => setRecipeData({
    ...recipeData, 
    ingredients: [...recipeData.ingredients, { ingredientId: "", quantity: "" }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ownerId = localStorage.getItem("userId");
      const finalData = {
        ...recipeData,
        ownerId,
        imageUrl: recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
      };
      await api.post("/recipes", finalData);
      
      // সাকসেস মেসেজ ট্রিগার করা
      setShowSuccess(true);
      
      // ২ সেকেন্ড পর পেজ রিলোড হবে যাতে ইউজার মেসেজটা দেখতে পায়
      setTimeout(() => {
        window.location.reload(); 
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Failed to create recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto p-10 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/20 shadow-2xl animate-in fade-in duration-700">
      
      {/* SUCCESS OVERLAY - সাকসেসফুলি অ্যাড হলে এটি দেখাবে */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-[3.5rem] animate-in zoom-in duration-300">
          <div className="bg-orange-500 p-4 rounded-full mb-4 shadow-lg shadow-orange-500/50">
            <CheckCircle2 size={50} className="text-white animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic">Recipe Deployed!</h2>
          <p className="text-orange-400 font-bold mt-2">Successfully added to system 🚀</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6 text-white">
          <ChefHat size={40} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Forge A New <span className="text-orange-500">Recipe</span>
        </h2>
        <p className="text-gray-400 font-medium mt-2 tracking-widest text-[10px] uppercase">
          System ID: RECIPE_CREATOR_V1
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-4">
          <label className="text-orange-400 font-black text-[10px] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Recipe Cover Image
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-grow w-full">
              <input 
                type="url"
                placeholder="Paste Image URL (e.g. Unsplash or Google Image Link)" 
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all font-medium placeholder:text-white/20"
                value={recipeData.imageUrl}
                onChange={(e) => setRecipeData({...recipeData, imageUrl: e.target.value})}
              />
              <p className="text-[10px] text-white/30 mt-2 ml-2 italic">* Use high quality URL for better public display</p>
            </div>
            
            <div className="w-full md:w-48 h-32 rounded-2xl border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center relative group">
              {recipeData.imageUrl ? (
                <>
                  <img src={recipeData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setRecipeData({...recipeData, imageUrl: ""})}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                   <ImageIcon className="w-8 h-8 text-white/10 mx-auto mb-1" />
                   <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">No Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info Group */}
        <div className="space-y-4">
           <label className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] ml-2">Basic Metadata</label>
           <div className="grid md:grid-cols-2 gap-4">
             <input 
                type="text"
                placeholder="Recipe Title (e.g. Spicy Ramen)" 
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all font-medium"
                onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
                required
              />
              <div className="flex gap-4">
                <select 
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white/70 outline-none focus:border-orange-500/50 w-full font-medium"
                  onChange={(e) => setRecipeData({...recipeData, difficulty: e.target.value})}
                >
                  <option value="easy" className="bg-gray-900">Easy</option>
                  <option value="medium" className="bg-gray-900">Medium</option>
                  <option value="hard" className="bg-gray-900">Hard</option>
                </select>
                <input 
                  type="text"
                  placeholder="30 Mins" 
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 w-full font-medium"
                  onChange={(e) => setRecipeData({...recipeData, cookingTime: e.target.value})}
                />
              </div>
           </div>
        </div>

        {/* YouTube Integration Field */}
        <div className="space-y-4">
          <label className="text-red-500/60 font-black text-[10px] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <Youtube className="w-3 h-3" /> YouTube Video Source
          </label>
          <input 
            type="url"
            placeholder="https://www.youtube.com/watch?v=..." 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-white/20"
            onChange={(e) => setRecipeData({...recipeData, videourl: e.target.value})}
          />
        </div>

        {/* Step-by-Step System */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <label className="text-primary font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <ListChecks className="w-3 h-3" /> Preparation Steps
            </label>
            <button type="button" onClick={addStep} className="text-[10px] font-black text-white/40 hover:text-orange-500 transition-colors uppercase tracking-tighter flex items-center gap-1 bg-transparent p-0 shadow-none border-none cursor-pointer">
              <Plus size={12} /> Add Phase
            </button>
          </div>
          <div className="space-y-3">
            {recipeData.steps.map((step, idx) => (
              <div key={idx} className="group flex gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-center w-10 text-orange-500 font-black italic text-xl">
                  {idx + 1}
                </div>
                <textarea 
                  placeholder="Describe this cooking stage..."
                  className="flex-grow bg-transparent p-3 text-gray-300 outline-none resize-none font-medium"
                  rows={2}
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...recipeData.steps];
                    newSteps[idx] = e.target.value;
                    setRecipeData({...recipeData, steps: newSteps});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients Mapping */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <label className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <ShoppingBasket className="w-3 h-3" /> Ingredient Mapping
            </label>
            <div className="flex gap-4">
                <button type="button" onClick={handleQuickAddIngredient} className="text-[10px] font-black text-green-400 hover:text-green-300 transition-colors uppercase tracking-tighter flex items-center gap-1 bg-transparent p-0 shadow-none border-none cursor-pointer">
                  <Plus size={12} /> New Master Item
                </button>
                <button type="button" onClick={addIngredientField} className="text-[10px] font-black text-white/40 hover:text-blue-400 transition-colors uppercase tracking-tighter flex items-center gap-1 bg-transparent p-0 shadow-none border-none cursor-pointer">
                  <Plus size={12} /> Add Component
                </button>
            </div>
          </div>
          <div className="grid gap-3">
            {recipeData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                <select 
                  className="flex-grow bg-white/5 border border-white/10 p-4 rounded-2xl text-white/60 outline-none focus:border-blue-500/30 font-medium"
                  value={ing.ingredientId}
                  onChange={(e) => {
                    const newIngs = [...recipeData.ingredients];
                    newIngs[idx].ingredientId = e.target.value;
                    setRecipeData({...recipeData, ingredients: newIngs});
                  }}
                >
                  <option value="" className="bg-gray-900">Select Ingredient</option>
                  {ingredientsList.map(item => (
                    <option key={item._id} value={item._id} className="bg-gray-900">{item.name}</option>
                  ))}
                </select>
                <input 
                  placeholder="Qty (e.g. 200g)" 
                  className="w-40 bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500/30 font-medium"
                  value={ing.quantity}
                  onChange={(e) => {
                    const newIngs = [...recipeData.ingredients];
                    newIngs[idx].quantity = e.target.value;
                    setRecipeData({...recipeData, ingredients: newIngs});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-3xl shadow-2xl shadow-orange-900/40 flex items-center justify-center gap-3 transition-all active:scale-95 group cursor-pointer"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save className="group-hover:rotate-12 transition-transform" />
              <span className="tracking-[0.2em] uppercase text-sm">Deploy Recipe to System</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}