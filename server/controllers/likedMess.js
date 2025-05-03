const User = require("../modules/user");
const pgProvider = require("../modules/pgProvider");

const likedMess = async (req, res) => {
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

module.exports = likedMess;

const cartMess = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate("likedMesses");
    if (!user) {
      req.status(400, { message: "couldn't find user" });
    }
    const likedMesses = user.likedMesses;
    if (!likedMesses || likedMesses.length === 0) {
      res.status(401, { message: "no liked messes" });
    }
    //res.status(200).json(likedMesses);
    const messOwners = await pgProvider.find({ _id: { $in: likedMesses } });

    return res.status(200).json(messOwners);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" }); // Handle server errors
  }
};

module.exports = cartMess;