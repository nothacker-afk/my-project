const express = require('express');
const router = express.Router();
const { createPoll, listPolls, getPoll, vote } = require('../controllers/pollController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPoll);
router.get('/', listPolls);
router.get('/:id', getPoll);
router.post('/:id/vote', vote);

module.exports = router;
