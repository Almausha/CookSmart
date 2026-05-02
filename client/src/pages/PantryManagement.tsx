import { useState, useEffect } from "react";
import {
  Plus, Trash2, Pencil, Check, X, Loader2,
  ShieldAlert, Leaf, FlaskConical, AlertTriangle,
  HeartPulse, CalendarClock, Scale, Package2, ChevronDown, ChevronUp
} from "lucide-react";
import api from "../services/api";

const UNITS = ["g", "kg", "ml", "pcs", "tsp", "tbsp"];
const QUALITY_TYPES = ["fresh", "stale", "processed", "organic"];

const QUALITY_STYLES: Record<string, string> = {
  fresh: "text-green-400 bg-green-500/10 border-green-500/20",
  stale: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  processed: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  organic: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const QUALITY_ICONS: Record<string, React.ReactElement> = {
  fresh: <Leaf size={10} />,
  stale: <AlertTriangle size={10} />,
  processed: <FlaskConical size={10} />,
  organic: <Leaf size={10} />,
};

const isExpiringSoon = (expiryDate?: string) => {
  if (!expiryDate) return false;
  const diff = new Date(expiryDate).getTime() - Date.now();
  return diff < 1000 * 60 * 60 * 24 * 3 && diff > 0; // within 3 days
};

const isExpired = (expiryDate?: string) => {
  if (!expiryDate) return false;
  return new Date(expiryDate).getTime() < Date.now();
};

const defaultForm = {
  name: "",
  currentQuantity: "",
  unit: "g",
  expiryDate: "",
  qualityType: "fresh",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  isAllergen: false,
  healthBenefits: "",
  risks: "",
};

export default function PantryManagement() {
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ currentQuantity: string; unit: string; expiryDate: string }>({
    currentQuantity: "", unit: "g", expiryDate: ""
  });
  const [form, setForm] = useState({ ...defaultForm });
  const userId = localStorage.getItem("userId");

  const fetchPantry = async () => {
    try {
      const res = await api.get(`/pantry/${userId}`);
      setPantryItems(res.data.data?.ingredients || []);
    } catch (err) {
      console.error("Pantry fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPantry(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/pantry/${userId}/add`, {
        name: form.name,
        currentQuantity: Number(form.currentQuantity) || 0,
        unit: form.unit,
        expiryDate: form.expiryDate || null,
        qualityType: form.qualityType,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        isAllergen: form.isAllergen,
        healthBenefits: form.healthBenefits
          ? form.healthBenefits.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        risks: form.risks
          ? form.risks.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });
      setForm({ ...defaultForm });
      setShowForm(false);
      fetchPantry();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add ingredient");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.ingredientId._id);
    setEditValues({
      currentQuantity: item.currentQuantity?.toString() || "0",
      unit: item.unit || "g",
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
    });
  };

  const handleUpdate = async (ingredientId: string) => {
    try {
      await api.put(`/pantry/${userId}/update/${ingredientId}`, {
        currentQuantity: Number(editValues.currentQuantity),
        unit: editValues.unit,
        expiryDate: editValues.expiryDate || null,
      });
      setEditingId(null);
      fetchPantry();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (ingredientId: string) => {
    if (!confirm("Remove this ingredient from your pantry?")) return;
    try {
      await api.delete(`/pantry/${userId}/delete/${ingredientId}`);
      fetchPantry();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const expiredCount = pantryItems.filter((i) => isExpired(i.expiryDate)).length;
  const expiringSoonCount = pantryItems.filter((i) => isExpiringSoon(i.expiryDate)).length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 text-white space-y-8 text-left">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            My <span className="text-orange-500">Pantry</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
            {pantryItems.length} item{pantryItems.length !== 1 ? "s" : ""} stored
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {expiredCount > 0 && (
            <span className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
              <AlertTriangle size={10} /> {expiredCount} Expired
            </span>
          )}
          {expiringSoonCount > 0 && (
            <span className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
              <CalendarClock size={10} /> {expiringSoonCount} Expiring Soon
            </span>
          )}
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer border-none"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add Ingredient"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-slate-900/60 border border-orange-500/20 p-8 rounded-[3rem] space-y-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <h2 className="text-lg font-black italic uppercase text-orange-400 border-b border-white/5 pb-4">
            Register New Pantry Item
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] uppercase font-black text-orange-500 ml-1">Ingredient Name *</label>
              <input
                required type="text" value={form.name}
                placeholder="e.g. Chicken Breast"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-white placeholder-white/20"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Quantity + Unit */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-orange-500 ml-1">Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number" min="0" value={form.currentQuantity}
                  placeholder="0"
                  className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-white"
                  onChange={(e) => setForm({ ...form, currentQuantity: e.target.value })}
                />
                <select
                  value={form.unit}
                  className="bg-slate-800 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 text-white cursor-pointer"
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  {UNITS.map((u) => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                </select>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-orange-500 ml-1">Expiry Date</label>
              <input
                type="date" value={form.expiryDate}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-white/70"
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>

            {/* Quality Type */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-orange-500 ml-1">Quality Type</label>
              <div className="flex flex-wrap gap-2">
                {QUALITY_TYPES.map((q) => (
                  <button
                    key={q} type="button"
                    onClick={() => setForm({ ...form, qualityType: q })}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer active:scale-95 ${
                      form.qualityType === q
                        ? "bg-white text-orange-500 border-white scale-105"
                        : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergen */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className={form.isAllergen ? "text-red-500" : "text-slate-500"} />
                <label className="text-xs font-bold uppercase text-slate-400">Allergen Risk</label>
              </div>
              <input
                type="checkbox" checked={form.isAllergen}
                onChange={(e) => setForm({ ...form, isAllergen: e.target.checked })}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Nutrition */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Nutritional Info (per 100{form.unit})</p>
            <div className="grid grid-cols-4 gap-3">
              {["calories", "protein", "carbs", "fat"].map((n) => (
                <div key={n} className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 ml-1">{n}</label>
                  <input
                    type="number" min="0" value={(form as any)[n]}
                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-orange-500 text-white"
                    onChange={(e) => setForm({ ...form, [n]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Health Benefits & Risks */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-green-500 ml-1 flex items-center gap-1">
                <HeartPulse size={10} /> Health Benefits
              </label>
              <input
                type="text" value={form.healthBenefits}
                placeholder="e.g. Iron-rich, Vitamin C, Antioxidants..."
                className="w-full bg-green-500/5 border border-green-500/20 p-4 rounded-2xl outline-none focus:border-green-500/50 text-xs text-white placeholder-white/20"
                onChange={(e) => setForm({ ...form, healthBenefits: e.target.value })}
              />
              <p className="text-[9px] text-slate-600 ml-1 italic">Separate with commas</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-red-500 ml-1 flex items-center gap-1">
                <ShieldAlert size={10} /> Risks / Side Effects
              </label>
              <input
                type="text" value={form.risks}
                placeholder="e.g. Contains gluten, nut allergy..."
                className="w-full bg-red-500/5 border border-red-500/20 p-4 rounded-2xl outline-none focus:border-red-500/50 text-xs text-white placeholder-white/20"
                onChange={(e) => setForm({ ...form, risks: e.target.value })}
              />
              <p className="text-[9px] text-slate-600 ml-1 italic">Separate with commas</p>
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-500 p-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <><Plus size={16} /> Add to Pantry</>}
          </button>
        </form>
      )}

      {/* Pantry List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-orange-500 font-black text-xs uppercase tracking-widest animate-pulse">Loading pantry...</p>
        </div>
      ) : pantryItems.length === 0 ? (
        <div className="text-center py-24 bg-white/5 border-4 border-dashed border-white/5 rounded-[4rem] space-y-4">
          <Package2 className="w-12 h-12 text-white/10 mx-auto" />
          <p className="text-white/30 font-black text-xl uppercase tracking-tight">Pantry is empty</p>
          <p className="text-white/20 text-sm">Add your first ingredient above!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pantryItems.map((item) => {
            const ing = item.ingredientId;
            const expired = isExpired(item.expiryDate);
            const expiringSoon = isExpiringSoon(item.expiryDate);
            const isEditing = editingId === ing._id;
            const isExpanded = expandedId === ing._id;

            return (
              <div
                key={ing._id}
                className={`bg-white/5 border rounded-[2.5rem] p-6 transition-all duration-300 hover:bg-white/[0.07] ${
                  expired
                    ? "border-red-500/30 bg-red-500/5"
                    : expiringSoon
                    ? "border-yellow-500/30"
                    : "border-white/5 hover:border-orange-500/20"
                }`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-black italic uppercase text-white">{ing.name}</h3>

                      {/* Quality Badge */}
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${QUALITY_STYLES[ing.qualityType] || QUALITY_STYLES.fresh}`}>
                        {QUALITY_ICONS[ing.qualityType]} {ing.qualityType}
                      </span>

                      {ing.isAllergen && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-red-500/10 border border-red-500/20 text-red-400">
                          <ShieldAlert size={9} /> Allergen
                        </span>
                      )}

                      {expired && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-red-500/20 border border-red-500/30 text-red-300">
                          <AlertTriangle size={9} /> Expired
                        </span>
                      )}
                      {!expired && expiringSoon && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                          <CalendarClock size={9} /> Expiring Soon
                        </span>
                      )}
                    </div>

                    {/* Quantity + Expiry Display / Edit */}
                    {isEditing ? (
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <input
                          type="number" min="0"
                          value={editValues.currentQuantity}
                          className="w-24 bg-black/40 border border-orange-500/40 p-2 rounded-xl text-sm outline-none text-white text-center"
                          onChange={(e) => setEditValues({ ...editValues, currentQuantity: e.target.value })}
                        />
                        <select
                          value={editValues.unit}
                          className="bg-slate-800 border border-white/10 p-2 rounded-xl outline-none text-white text-sm cursor-pointer"
                          onChange={(e) => setEditValues({ ...editValues, unit: e.target.value })}
                        >
                          {UNITS.map((u) => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                        </select>
                        <input
                          type="date" value={editValues.expiryDate}
                          className="bg-black/40 border border-white/10 p-2 rounded-xl text-sm outline-none text-white/70"
                          onChange={(e) => setEditValues({ ...editValues, expiryDate: e.target.value })}
                        />
                        <button
                          onClick={() => handleUpdate(ing._id)}
                          className="p-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 rounded-xl transition-all cursor-pointer"
                        >
                          <Check size={14} className="text-green-400" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                        >
                          <X size={14} className="text-white/50" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4 text-sm text-white/60 font-bold mt-1">
                        <span className="flex items-center gap-1.5">
                          <Scale size={12} className="text-orange-500" />
                          {item.currentQuantity} {item.unit}
                        </span>
                        {item.expiryDate && (
                          <span className={`flex items-center gap-1.5 ${expired ? "text-red-400" : expiringSoon ? "text-yellow-400" : ""}`}>
                            <CalendarClock size={12} />
                            {new Date(item.expiryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isEditing && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2.5 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-2xl transition-all cursor-pointer"
                      >
                        <Pencil size={14} className="text-white-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(ing._id)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all cursor-pointer"
                      >
                        <Trash2 size={14} className="text-white-400" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ing._id)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-white/5 space-y-4 animate-in fade-in duration-200">
                    {/* Nutrition */}
                    {(ing.calories > 0 || ing.protein > 0 || ing.carbs > 0 || ing.fat > 0) && (
                      <div>
                        <p className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-2">Nutrition (per 100{ing.unit})</p>
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase text-slate-400">
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                            <div className="text-white font-black">{ing.calories}</div>kcal
                          </div>
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                            <div className="text-orange-400 font-black">{ing.protein}g</div>protein
                          </div>
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                            <div className="text-blue-400 font-black">{ing.carbs}g</div>carbs
                          </div>
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                            <div className="text-yellow-400 font-black">{ing.fat}g</div>fat
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Health Benefits */}
                    {ing.healthBenefits?.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase font-black text-green-500/70 tracking-widest mb-2 flex items-center gap-1">
                          <HeartPulse size={9} /> Health Benefits
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ing.healthBenefits.map((b: string, i: number) => (
                            <span key={i} className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks */}
                    {ing.risks?.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase font-black text-red-500/70 tracking-widest mb-2 flex items-center gap-1">
                          <ShieldAlert size={9} /> Risks / Side Effects
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ing.risks.map((r: string, i: number) => (
                            <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}