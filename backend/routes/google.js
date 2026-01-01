const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.get('/url', googleController.getAuthUrl);
router.get('/callback', googleController.callback);
router.post('/calendar/event', express.json(), googleController.createCalendarEvent);

module.exports = router;
