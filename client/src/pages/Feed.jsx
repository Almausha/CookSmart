import { useEffect, useState } from "react";
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Get current user from localStorage (matches your existing auth setup)
  const currentUser = {
  _id: localStorage.getItem("userId"),
  name: localStorage.getItem("userName"),
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
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen w-full text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-1">
            Recipe <span className="text-orange-400">Feed</span>
          </h1>
          <p className="text-white/40 text-sm font-medium">
            See what the community is cooking 🍳
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition"
          />
        </div>

        {/* Create Post */}
        <CreatePost currentUser={currentUser} onPostCreated={loadPosts} />

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-white/20 uppercase tracking-widest text-sm font-black">
            No posts found — be the first to share!
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onRefresh={loadPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
