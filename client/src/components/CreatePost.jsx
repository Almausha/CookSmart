import { useState } from "react";
import { createPost } from "../services/postService";
import { Image as ImageIcon, Loader2, X } from "lucide-react";

const CreatePost = ({ currentUser, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Image upload state
  const [open, setOpen] = useState(false);

  // ImgBB API Key (safely fetching from env)
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // 1. Local Image Upload Handler (ImgBB)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url); // ImgBB URL set kora holo
      } else {
        alert("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("ImgBB Error:", err);
      alert("Image upload error!");
    } finally {
      setUploading(false);
    }
  };

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
    <div className="mb-6 text-left">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-left hover:bg-white/10 hover:text-white/70 transition-all duration-300 font-medium tracking-wide"
        >
          ✍️ Share a recipe or cooking moment...
        </button>
      ) : (
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-300 shadow-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-black uppercase text-sm tracking-widest italic">Forge New Post</h3>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Post Title *</label>
            <input
              type="text"
              placeholder="e.g. My Homemade Pasta 🍝"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Description *</label>
            <textarea
              placeholder="e.g. I made this amazing pasta..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition resize-none"
            />
          </div>

          {/* 2. Image Upload Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Post Media</label>
            <div className="flex flex-col gap-3">
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-40">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImageUrl("")} 
                    className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-red-500"
                  >
                    <X size={14}/>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl h-32 hover:bg-white/5 cursor-pointer transition-all group">
                  {uploading ? (
                    <Loader2 className="animate-spin text-orange-500" />
                  ) : (
                    <>
                      <ImageIcon className="text-white/20 group-hover:text-orange-500 transition-colors" size={24} />
                      <span className="text-[10px] text-white/30 font-bold mt-2 uppercase">Upload Device Photo</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
              
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Tags</label>
            <input
              type="text"
              placeholder="e.g. pasta, vegan"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || uploading || !title.trim() || !description.trim()}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Deploy Post 🚀"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;