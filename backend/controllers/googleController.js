const { google } = require('googleapis');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT || 'http://localhost:5000/api/auth/google/callback'
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'profile', 'email'];

exports.getAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.json({ url });
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Get user info
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
    // find or create user
    let user = await User.findOne({ email: data.email });
    if (!user) {
      user = await User.create({
        firstName: data.given_name || data.name || 'Google',
        lastName: data.family_name || '',
        email: data.email,
        password: Math.random().toString(36).slice(2, 10),
        google: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        },
      });
    } else {
      user.google = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || user.google.refreshToken,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      };
      await user.save();
    }
    // Simple session set
    req.session.userId = user._id;
    res.redirect(process.env.CLIENT_SUCCESS_REDIRECT || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication failed');
  }
};

exports.createCalendarEvent = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findById(userId);
    if (!user || !user.google || !user.google.accessToken) return res.status(400).json({ message: 'Google not linked' });
    oauth2Client.setCredentials({
      access_token: user.google.accessToken,
      refresh_token: user.google.refreshToken,
    });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { summary, description, start, end } = req.body;
    const event = {
      summary,
      description,
      start: { dateTime: start },
      end: { dateTime: end },
    };
    const created = await calendar.events.insert({ calendarId: 'primary', requestBody: event });
    res.json(created.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create calendar event' });
  }
};
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const oauth2ClientFromEnv = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

// Return an authentication URL (protected route should call this)
exports.getAuthUrl = async (req, res) => {
  try {
    const oauth2Client = oauth2ClientFromEnv();
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const state = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state,
    });

    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Callback to receive code and exchange tokens
exports.oauthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const oauth2Client = oauth2ClientFromEnv();
    const { tokens } = await oauth2Client.getToken(code);

    // Decode state to find user id (state is expected to be the JWT)
    let userId = null;
    if (state) {
      try {
        const decoded = jwt.verify(state, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');
        userId = decoded.id || decoded;
      } catch (err) {
        // ignore state decode errors
      }
    }

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.google = user.google || {};
        user.google.accessToken = tokens.access_token;
        if (tokens.refresh_token) user.google.refreshToken = tokens.refresh_token;
        if (tokens.expiry_date) user.google.tokenExpiry = new Date(tokens.expiry_date);
        await user.save();
      }
    }

    // Redirect to frontend with success message
    const redirectUrl = process.env.GOOGLE_OAUTH_SUCCESS_REDIRECT || '/';
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper to get an authenticated OAuth2 client for a user
exports.getAuthenticatedClientForUser = async (user) => {
  const oauth2Client = oauth2ClientFromEnv();
  if (!user.google || !user.google.refreshToken) return null;
  oauth2Client.setCredentials({
    refresh_token: user.google.refreshToken,
  });
  return oauth2Client;
};
