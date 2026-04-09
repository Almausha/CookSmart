import { useState, useEffect } from "react";
import { Loader2, Trash2, Activity, ShieldAlert, Scale } from "lucide-react";
import api from "../services/api";

export default function AdminMasterIngredients() {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    protein: 0,
    carbs: 0,
    fat: 0,
    unit: "g",
    isAllergen: false,
    qualityType: "fresh",
    risks: [] as string[],
    healthBenefits: [] as string[],
  });

  const fetchIngredients = async () => {
    try {
      const res = await api.get("/master-ingredients");
      setIngredients(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/master-ingredients", formData);
      setFormData({
        name: "",
        protein: 0,
        carbs: 0,
        fat: 0,
        unit: "g",
        isAllergen: false,
        qualityType: "fresh",
        risks: [],
        healthBenefits: [],
      });
      fetchIngredients();
    } catch (err) {
      alert("Error adding ingredient");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/master-ingredients/${id}`);
      fetchIngredients();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-white space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Master <span className="text-blue-500">Database</span>
        </h1>
        <p className="text-slate-500 text-[10px] tracking-[0.5em] font-bold italic">
          INGREDIENT_AUTHORITY_ROOT
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/10 shadow-2xl h-fit">
          <h2 className="text-xl font-bold mb-6 text-blue-400 italic">Register New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-blue-500 ml-2">Ingredient Name</label>
              <input
                type="text"
                required
                value={formData.name}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-blue-500 ml-2">Base Unit (Per 100)</label>
              <div className="relative">
                <select
                  value={formData.unit}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="g" className="bg-slate-900">Grams (g)</option>
                  <option value="ml" className="bg-slate-900">Milliliters (ml)</option>
                  <option value="tsp" className="bg-slate-900">Teaspoon (tsp)</option>
                  <option value="tbsp" className="bg-slate-900">Tablespoon (tbsp)</option>
                  <option value="pcs" className="bg-slate-900">Pieces (pcs)</option>
                  <option value="kg" className="bg-slate-900">Kilograms (kg)</option>
                </select>
                <Scale className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["protein", "carbs", "fat"].map((nutri) => (
                <div key={nutri} className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 ml-1">
                    {nutri} (100{formData.unit})
                  </label>
                  <input
                    type="number"
                    value={(formData as any)[nutri]}
                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({ ...formData, [nutri]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className={formData.isAllergen ? "text-red-500" : "text-slate-500"} />
                <label className="text-xs font-bold uppercase text-slate-400">Allergen Risk</label>
              </div>
              <input
                type="checkbox"
                checked={formData.isAllergen}
                onChange={(e) => setFormData({ ...formData, isAllergen: e.target.checked })}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Deploy to Database"}
            </button>
          </form>
        </div>

        {/* Display List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {ingredients.map((ing) => (
              <div key={ing._id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all group relative overflow-hidden flex flex-col">
                
                {/* SAFE HEADER: Flexbox ensures Name, Badge, and Trash Button stay in their lanes */}
                <div className="flex items-start justify-between gap-3 w-full border-b border-white/5 pb-4">
                  {/* Name: flex-1 allows it to take space and wrap, min-w-0 prevents it from pushing content out */}
                  <h3 className="text-lg font-black italic uppercase text-blue-400 break-words leading-tight flex-1 min-w-0">
                    {ing.name}
                  </h3>
                  
                  {/* Actions Group: shrink-0 ensures badge and button never get squished */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] bg-white/10 px-2 py-1 rounded-lg text-slate-400 font-bold uppercase tracking-tighter whitespace-nowrap">
                      Base: 100{ing.unit || 'g'}
                    </span>
                    <button 
                      onClick={() => deleteItem(ing._id)}
                      className="text-slate-500 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Nutrition Content */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-[9px] font-bold uppercase text-slate-400 text-center">
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">P: {ing.protein}</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">C: {ing.carbs}</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">F: {ing.fat}</div>
                </div>

                {/* Meta Tags */}
                <div className="mt-4 flex flex-wrap gap-4">
                  {ing.calories > 0 && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-blue-500 uppercase">
                      <Activity size={10} /> {ing.calories} kcal
                    </div>
                  )}

                  {ing.isAllergen && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-red-500 uppercase">
                      <ShieldAlert size={10} /> Allergen
                      {ing.risks?.length > 0 && (
                        <span className="text-red-400/60 lowercase font-medium">
                          ({ing.risks.join(', ')})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}