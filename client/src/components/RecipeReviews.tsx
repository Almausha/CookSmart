import { useEffect, useState } from "react";
import { fetchReviews, addReview, deleteReview } from "../services/reviewService";

interface Review {
  _id: string;
  userId: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  recipeId: string;
}

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-2xl transition-transform ${onChange ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          <span className={(hovered || value) >= star ? 'text-yellow-400' : 'text-white/20'}>★</span>
        </button>
      ))}
    </div>
  );
};

export default function RecipeReviews({ recipeId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId") || "";

  const loadReviews = async () => {
    try {
      const res = await fetchReviews(recipeId);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    if (recipeId) loadReviews();
  }, [recipeId]);

  const handleSubmit = async () => {
    if (!rating) return setError("Please select a star rating!");
    if (!comment.trim()) return setError("Please write a review!");
    setError("");
    setLoading(true);
    try {
      await addReview(recipeId, userId, rating, comment);
      setRating(0);
      setComment("");
      loadReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await deleteReview(reviewId, userId);
      loadReviews();
    } catch (err) {
      console.error("Failed to delete review", err);
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
    <div className="space-y-8 mt-10">
      <div className="border-t border-white/10 pt-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
            Reviews & Ratings
          </h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
              <span className="text-yellow-400 text-2xl font-black">{averageRating}</span>
              <div>
                <StarRating value={Math.round(Number(averageRating))} />
                <p className="text-white/30 text-xs font-bold">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Write a Review */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 mb-8">
          <h4 className="text-white font-bold">Write a Review</h4>

          <div>
            <p className="text-white/40 text-sm mb-2">Your Rating</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this recipe..."
            rows={3}
            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400/50 transition resize-none"
          />

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review ⭐"}
          </button>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-white/20 uppercase tracking-widest text-xs font-black">
            No reviews yet — be the first to review!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-black">
                      {(review.userId?.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{review.userId?.name || "User"}</p>
                      <p className="text-white/30 text-xs">{timeAgo(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={review.rating} />
                    {review.userId?._id === userId && (
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-white/20 hover:text-red-400 transition text-lg"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-12">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}