const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile/:id', protect, async (req, res) => {
  try {
    // Make sure user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { firstName, lastName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
