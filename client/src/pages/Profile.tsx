import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = {
    _id: localStorage.getItem("userId") || "",
    name: localStorage.getItem("userName") || "",
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        // Backend function that filters posts by userId
        const res = await axios.get(`http://localhost:5000/api/posts/user/${userId}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading profile posts", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserPosts();
  }, [userId]);

  return (
    <div className="min-h-screen w-full text-white px-4 py-8 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
          <div className="w-20 h-20 bg-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black text-black">
            {posts[0]?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold">{posts[0]?.username || "Social Profile"}</h1>
          <p className="text-white/40 text-sm">Community Member</p>
        </div>

        <div className="space-y-5">
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div></div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={currentUser} onRefresh={() => {}} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;