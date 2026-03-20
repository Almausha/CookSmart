const schemas = require("./schema");

const getYoutubeLogic = async (id) => {
    const recipe = await schemas.Recipe.findById(id);
    

    if (!recipe || !recipe.videourl) return null;

    const url = recipe.videourl;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return null;

    return {
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
};

module.exports = { getYoutubeLogic };