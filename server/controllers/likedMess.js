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

// const cartMess = async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const user = await User.findById(userId).populate("likedMesses");
//     if (!user) return res.status(400).json({ message: "Couldn't find user" });
//     const likedMesses = user.likedMesses;

//     if (!user.likedMesses || user.likedMesses.length === 0)
//       return res.status(404).json({ message: "No liked messes" });
//     const messes = await pgProvider.find({ _id: { $in: likedMesses } });

//     return res.status(200).json(messes);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const cartMess = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("likedMesses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedMesses = user.likedMesses || [];

    if (likedMesses.length === 0) {
      // Still return 200 with empty array to avoid frontend 404
      return res.status(200).json([]);
    }

    const messes = await pgProvider.find({ _id: { $in: likedMesses } });

    return res.status(200).json(messes);
  } catch (error) {
    console.error("Error in cartMess:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  likedMess,
  cartMess,
};
