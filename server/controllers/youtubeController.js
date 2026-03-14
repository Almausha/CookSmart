const YoutubeModel = require("../models/YoutubeVideo");

exports.getVideoData = async (req, res) => {
    try {
        const data = await YoutubeModel.getYoutubeLogic(req.params.id);
        if (!data) return res.status(404).json({ message: "Video not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};