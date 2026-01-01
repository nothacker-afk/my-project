const Poll = require('../models/Poll');
const User = require('../models/User');
const { google } = require('googleapis');
const { getAuthenticatedClientForUser } = require('./googleController');

// Create a poll. If endDate provided and user has Google OAuth, create a calendar event.
exports.createPoll = async (req, res) => {
  try {
    const { question, options, endDate } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Invalid poll data' });
    }

    const poll = await Poll.create({
      question,
      options: options.map((o) => ({ text: o })),
      creator: req.user.id,
      endDate: endDate ? new Date(endDate) : null,
    });

    // If endDate and user has Google, create calendar event for poll end
    if (poll.endDate) {
      const user = await User.findById(req.user.id);
      const oauth2Client = await getAuthenticatedClientForUser(user);
      if (oauth2Client) {
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const event = {
          summary: `Poll ends: ${poll.question}`,
          description: `Poll ID: ${poll._id}`,
          start: { dateTime: new Date(poll.endDate.getTime() - 5 * 60 * 1000).toISOString() },
          end: { dateTime: poll.endDate.toISOString() },
        };
        try {
          const created = await calendar.events.insert({ calendarId: 'primary', requestBody: event });
          poll.calendarEventId = created.data.id;
          await poll.save();
        } catch (err) {
          console.warn('Failed to create calendar event:', err.message);
        }
      }
    }

    res.status(201).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('creator', 'firstName lastName email');
    res.json({ success: true, polls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.vote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option' });
    }
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
