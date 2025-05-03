const User = require("../modules/user");

const getLikedMess = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const user = await User.findById(userId).populate('likedMesses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const likedMesses = user.likedMesses;
        if (!likedMesses || likedMesses.length === 0) {
            return res.status(404).json({ message: 'No liked messes found' });
        }
        res.status(200).json(likedMesses);}
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });  // Handle server errors
        }
}

module.exports = getLikedMess;