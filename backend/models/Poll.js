const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [optionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', pollSchema);
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endDate: Date,
  calendarEventId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', pollSchema);
