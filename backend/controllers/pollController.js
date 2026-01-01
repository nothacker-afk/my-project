const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  try {
    const { title, description, options } = req.body;
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Title and at least two options required' });
    }
    const poll = await Poll.create({
      title,
      description,
      options: options.map(o => ({ text: o })),
      createdBy: req.user ? req.user._id : undefined,
    });
    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.vote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (optionIndex == null || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option' });
    }
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
