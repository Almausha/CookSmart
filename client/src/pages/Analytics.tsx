import { useEffect, useState } from "react";
import { Users, BookOpen, Star, Clock, TrendingUp, Award } from "lucide-react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: "Total Users", value: data?.totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Recipes", value: data?.totalRecipes || 0, icon: BookOpen, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Total Reviews", value: data?.totalReviews || 0, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { label: "Total Cooks", value: data?.totalHistory || 0, icon: Clock, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Live <span className="text-purple-400">Analytics</span>
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1">
          Real-time statistics across the CookSmart platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-6 text-center`}>
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <p className="text-white font-black text-3xl">{stat.value}</p>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Most Cooked Recipes */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-white font-black text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" /> Most Cooked
          </h3>
          {data?.mostCooked?.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data?.mostCooked?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-orange-400 font-black text-lg w-6">#{idx + 1}</span>
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                    alt={item.title}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{item.title}</p>
                    <p className="text-white/40 text-xs">{item.count} times cooked</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Rated Recipes */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-white font-black text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Top Rated
          </h3>
          {data?.topRated?.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data?.topRated?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-yellow-400 font-black text-lg w-6">#{idx + 1}</span>
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                    alt={item.title}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{item.title}</p>
                    <p className="text-white/40 text-xs">⭐ {Number(item.avgRating).toFixed(1)} avg ({item.count} reviews)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
