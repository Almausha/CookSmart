import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, CheckCircle, Circle, RefreshCw, ArrowLeft, ChevronDown } from "lucide-react";
import { fetchShoppingList, togglePurchased, removeItem, clearShoppingList } from "../services/shoppingListService";

const stores = [
  { name: "Chaldal", color: "text-green-400", bg: "hover:bg-green-500/10", getUrl: (item: string) => `https://chaldal.com/search/${encodeURIComponent(item)}` },
  { name: "Shawpno", color: "text-orange-400", bg: "hover:bg-orange-500/10", getUrl: (item: string) => `https://www.shwapno.com/search?q=${encodeURIComponent(item)}` },
];

export default function ShoppingList() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await fetchShoppingList(userId);
      setIngredients(res.data.ingredients || []);
    } catch (err) {
      console.error("Failed to load shopping list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadList();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleToggle = async (ingredientId: string) => {
    try {
      const res = await togglePurchased(userId, ingredientId);
      setIngredients(res.data.ingredients);
    } catch (err) {
      console.error("Failed to toggle", err);
    }
  };

  const handleRemove = async (ingredientId: string) => {
    try {
      const res = await removeItem(userId, ingredientId);
      setIngredients(res.data.ingredients);
    } catch (err) {
      console.error("Failed to remove", err);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear your entire shopping list?")) return;
    try {
      await clearShoppingList(userId);
      setIngredients([]);
    } catch (err) {
      console.error("Failed to clear", err);
    }
  };

  const remaining = ingredients.filter(i => !i.isPurchased).length;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Kitchen
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight m-0 p-0 text-left">
            Shopping <span className="text-orange-400">List</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1 m-0 p-0 text-left">
            {remaining > 0 
              ? `${remaining} item${remaining !== 1 ? 's' : ''} left to buy` 
              : ingredients.length > 0 
                ? '🎉 All items purchased!' 
                : 'Your list is empty'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadList}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {ingredients.length > 0 && (
            <button
              onClick={handleClear}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {ingredients.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex justify-between text-xs text-white/40 font-bold mb-2 uppercase tracking-widest">
            <span>{ingredients.length - remaining} purchased</span>
            <span>{ingredients.length} total</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: `${ingredients.length > 0 ? ((ingredients.length - remaining) / ingredients.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading & Empty States */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : ingredients.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <ShoppingCart className="w-16 h-16 text-white/5 mx-auto" />
          <p className="text-white/20 uppercase tracking-[0.2em] text-[10px] font-black">
            No items yet — add missing ingredients from recipes!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Unpurchased items */}
          {ingredients.filter(i => !i.isPurchased).map((item) => (
            <div key={item._id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/[0.08] transition group text-left">
              <button onClick={() => handleToggle(item._id)} className="flex-shrink-0">
                <Circle className="w-6 h-6 text-white/30 hover:text-orange-400 transition" />
              </button>
              <div className="flex-1">
                <p className="text-white font-bold">{item.name}</p>
                {item.quantity && <p className="text-white/40 text-xs font-medium">{item.quantity}</p>}
              </div>

              {/* Buy Online Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item._id ? null : item._id)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition text-xs font-bold"
                >
                  🛒 Buy Online <ChevronDown className="w-3 h-3" />
                </button>
                {openDropdown === item._id && (
                  <div className="absolute right-0 top-10 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-44">
                    {stores.map((store) => (
                      <a
                        key={store.name}
                        href={store.getUrl(item.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold ${store.color} ${store.bg} transition border-b border-white/5 last:border-0`}>
                        🛒 {store.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleRemove(item._id)} 
                className="text-white/10 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Purchased items */}
          {ingredients.filter(i => i.isPurchased).map((item) => (
            <div key={item._id} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 transition group opacity-50 text-left">
              <button onClick={() => handleToggle(item._id)} className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500/70" />
              </button>
              <div className="flex-1">
                <p className="text-white/30 font-bold line-through italic">{item.name}</p>
                {item.quantity && <p className="text-white/10 text-xs font-medium">{item.quantity}</p>}
              </div>
              <button onClick={() => handleRemove(item._id)} className="text-white/10 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}