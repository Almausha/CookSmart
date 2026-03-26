import { useState } from "react";
import { createPost } from "../services/postService";

const CreatePost = ({ currentUser, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      await createPost({
        userId: currentUser._id,
        username: currentUser.name,
        title,
        description,
        imageUrl,
        tags: tagArray,
      });
      setTitle(""); setDescription(""); setImageUrl(""); setTags("");
      setOpen(false);
      onPostCreated();
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-left hover:bg-white/10 hover:text-white/70 transition-all duration-300 font-medium tracking-wide"
        >
          ✍️ Share a recipe or cooking moment...
        </button>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
          <h3 className="text-white font-bold text-lg">Create a Post</h3>

          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition"
          />

          <textarea
            placeholder="What did you cook? Share your experience..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition resize-none"
          />

          <input
            type="text"
            placeholder="Image URL (optional)..."
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition"
          />

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. pasta, vegan, quick)..."
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition"
          />

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-xl text-white/50 hover:text-white/80 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post 🚀"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
