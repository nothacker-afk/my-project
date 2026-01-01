const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/', pollController.createPoll);
router.get('/', pollController.listPolls);
router.get('/:id', pollController.getPoll);
router.post('/:id/vote', pollController.vote);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createPoll, listPolls, getPoll, vote } = require('../controllers/pollsController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPoll);
router.get('/', listPolls);
router.get('/:id', getPoll);
router.post('/:id/vote', vote);

module.exports = router;
