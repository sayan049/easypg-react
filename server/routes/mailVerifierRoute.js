const express = require('express');
const router = express.Router();
const User = require('../modules/user'); // Ensure you have the correct path to your User model

// Email verification route
router.get('/verify-email', async (req, res) => {
    try {
        const userId = req.query.id;

        if (!userId) {
            console.error('User ID is missing in the query parameters.');
            return res.status(400).json({ verified: 'error' });
        }

        const user = await User.findById(userId);
        console.log("Initial fetch user:", user);

        if (!user) {
            console.log(`User ID ${userId} not found.`);
            return res.status(404).json({ verified: 'false' });
        }

        if (user.is_verified) {
            console.log(`User ID ${userId} is already verified.`);
            return res.status(200).json({ verified: 'false' });
        }

        // Update the is_verified field to true
        user.is_verified = true;
        await user.save();
        console.log("User after verification update:", user);

        res.status(200).json({ verified: 'true' });
    } catch (error) {
        console.error("Error during email verification:", error.message);
        res.status(500).json({ verified: 'error' });
    }
});

module.exports = router;
