const schemas = require("./schema");

const getYoutubeLogic = async (id) => {
    const recipe = await schemas.Recipe.findById(id);
    
    // ভিডিও ইউআরএল না থাকলে বা রেসিপি না থাকলে নাল রিটার্ন করবে
    if (!recipe || !recipe.videourl) return null;

    const url = recipe.videourl;
    
    // ইউটিউব ইউআরএল থেকে আইডি বের করার জন্য প্রোফেশনাল রেগুলার এক্সপ্রেশন
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    // যদি আইডি পাওয়া যায় এবং আইডির দৈর্ঘ্য ১১ হয় (ইউটিউব আইডি ১১ অক্ষরের হয়)
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return null;

    return {
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
};

module.exports = { getYoutubeLogic };