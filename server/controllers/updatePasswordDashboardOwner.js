// utils/authHelpers.js
const bcrypt = require('bcryptjs');
const User = require('../modules/pgProvider');

const updatePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  try {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('owner not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Password update error:', error);
    throw error; // Re-throw the error for the route handler to catch
  }
};

module.exports = updatePassword;
