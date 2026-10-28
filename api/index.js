// =============================================================
//  Vercel serverless entry point.
//  Vercel calls this exported async handler for every request;
//  it lazily connects to MongoDB once and then delegates to the
//  Express app. `server.js` remains the entry point for local dev.
// =============================================================
require('dotenv').config();
const connectDB = require('../src/config/db');
const app = require('../app');

let connected = false;

module.exports = async (req, res) => {
  if (!connected) {
    try {
      await connectDB();
      connected = true;
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Database connection failed' });
      return;
    }
  }
  return app(req, res);
};
