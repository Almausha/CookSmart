import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trash2, ChefHat } from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../services/historyService";

export default function CookingHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetchHistory(userId);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadHistory();
  }, []);

  const handleDelete = async (historyId: string) => {
    if (!window.confirm("Remove this from your history?")) return;
    try {
      await deleteHistoryItem(historyId);
      setHistory(prev => prev.filter(h => h._id !== historyId));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">

      {/* Back Button */}
      <button
        onClick={() => navigate('/user-dashboard/public-recipes')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Kitchen
      </button>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Cooking <span className="text-orange-400">History</span>
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1">
          Recipes you've explored — {history.length} total
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <ChefHat className="w-16 h-16 text-white/10 mx-auto" />
          <p className="text-white/20 uppercase tracking-widest text-xs font-black">
            No cooking history yet — start exploring recipes!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.08] transition group"
            >
              {/* Recipe Image */}
              <img
                src={item.recipeId?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                alt={item.recipeId?.title}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-lg">{item.recipeId?.title || "Unknown Recipe"}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-white/40 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    {item.recipeId?.cookingTime || "N/A"}
                  </span>
                  {item.recipeId?.difficulty && (
                    <span className={`text-xs font-bold capitalize ${
                      item.recipeId.difficulty === 'easy' ? 'text-green-400' :
                      item.recipeId.difficulty === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {item.recipeId.difficulty}
                    </span>
                  )}
                  <span className="text-white/30 text-xs">
                    Visited {timeAgo(item.lastVisited)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/user-dashboard/recipe/${item.recipeId?._id}`)}
                  className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 rounded-xl text-xs font-bold transition"
                >
                  Cook Again
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
