import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, User } from "lucide-react"; // Kichu icon add korlam
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const currentUser = {
    _id: localStorage.getItem("userId") || "",
    name: localStorage.getItem("userName") || "User",
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await fetchPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen w-full text-white px-4 py-12 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="text-orange-400 w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400/60">Community</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none text-left">
              Recipe <span className="text-orange-400">Feed</span>
            </h1>
            <p className="text-white/40 text-sm font-medium text-left">
              Explore culinary secrets from the community 🍳
            </p>
          </div>

          <Link 
            to={`/user-dashboard/profile/${currentUser._id}`}
            className="relative group"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl rotate-3 group-hover:rotate-0 group-hover:bg-orange-400 group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-orange-500 p-1.5 rounded-lg border-2 border-[#0a0a0a]">
              <User size={10} className="text-white" />
            </div>
          </Link>
        </div>

        {/* Improved Search Bar */}
        <div className="relative mb-10 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search recipes, tags, or chefs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400/40 transition-all shadow-inner"
          />
        </div>

        {/* Create Post Section */}
        <div className="mb-12">
           <CreatePost currentUser={currentUser} onPostCreated={loadPosts} />
        </div>

        {/* Posts Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Latest Updates</span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-4">
              <div className="w-12 h-12 border-t-2 border-r-2 border-orange-400 rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400/60">Fetching Recipes</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <p className="text-white/20 uppercase tracking-[0.2em] text-sm font-black">
                {search ? "No matches found for your search" : "The feed is quiet... start the fire!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredPosts.map(post => (
                <div key={post._id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <PostCard
                    post={post}
                    currentUser={currentUser}
                    onRefresh={loadPosts}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;