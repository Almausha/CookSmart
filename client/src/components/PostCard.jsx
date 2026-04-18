import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import { toggleLike, addComment, sharePost, deletePost } from "../services/postService";

const PostCard = ({ post, currentUser, onRefresh }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localLikes, setLocalLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(currentUser?._id));
  const [shares, setShares] = useState(post.sharesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      const res = await toggleLike(post._id, currentUser._id);
      setLocalLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await addComment(post._id, currentUser._id, currentUser.name, commentText);
      setCommentText("");
      onRefresh();
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(shareUrl);
      await sharePost(post._id);
      setShares(prev => prev + 1);
      alert("Post link copied to clipboard!");
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id, currentUser._id);
      onRefresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
      
      {/* Image */}
      {post.imageUrl && (
        <div className="w-full h-52 overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      <div className="p-5 space-y-3 text-left"> {/* Added text-left for safety */}
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* Profile Icon with Link */}
              <Link to={`/user-dashboard/profile/${post.userId}`} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-black group-hover:bg-orange-400 group-hover:text-white transition-all">
                  {post.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-white/70 text-sm font-medium group-hover:text-orange-400 transition-colors">{post.username}</span>
              </Link>
              <span className="text-white/30 text-xs">· {timeAgo(post.createdAt)}</span>
            </div>
            <h3 className="text-white font-bold text-lg leading-tight">{post.title}</h3>
          </div>
          {currentUser?._id === post.userId && (
            <button onClick={handleDelete} className="text-white/20 hover:text-red-400 transition text-lg bg-transparent border-none cursor-pointer">🗑</button>
          )}
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed">{post.description}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-5 pt-2 border-t border-white/5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 bg-transparent border-none cursor-pointer ${liked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
          >
            {liked ? '❤️' : '🤍'} {localLikes}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-blue-400 font-medium transition bg-transparent border-none cursor-pointer"
          >
            💬 {post.comments.length}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-green-400 font-medium transition bg-transparent border-none cursor-pointer"
          >
            🔗 {shares}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            {post.comments.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {post.comments.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {c.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="bg-white/5 rounded-xl px-3 py-2 flex-1 text-left">
                      <span className="text-white/70 text-xs font-semibold">{c.username} </span>
                      <span className="text-white/50 text-xs">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50 transition"
              />
              <button
                onClick={handleComment}
                disabled={loading}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-300 rounded-xl text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;