const User = require("../modules/user");

const likedMesses = async (req, res) => {
    const userId = req.user.id;
  const { messId, liked } = req.body;
  console.log(userId, messId, liked, "likedMesses");

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