const express = require('express');
const router = express.Router();
const { getAuthUrl, oauthCallback } = require('../controllers/googleController');
const { protect } = require('../middleware/auth');

// Protected endpoint to get Google auth URL (frontend should open it)
router.get('/url', protect, getAuthUrl);

// OAuth2 callback endpoint configured in Google Cloud Console
router.get('/callback', oauthCallback);

module.exports = router;
