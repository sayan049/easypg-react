const User = require("../models/User");

const likedMesses = async (req, res) => {
    const userId = req.userId;
  const { messId, liked } = req.body;

  try {
    if (liked) {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedMesses: messId } }
      );
    } else {
      await User.updateOne({ _id: userId }, { $pull: { likedMesses: messId } });
    }
    res.sendStatus(200, { message: "success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update like" });
  }
};

module.exports = likedMesses;