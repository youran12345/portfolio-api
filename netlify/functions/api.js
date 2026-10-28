// =============================================================
//  Netlify Functions entry point for the Express REST API.
//  Netlify calls this handler for every /api/* request; it lazily
//  connects to MongoDB once and then delegates to the Express app.
//  `server.js` remains the entry point for local development.
// =============================================================
require('dotenv').config();
const serverless = require('serverless-http');
const connectDB = require('../../src/config/db');
const app = require('../../app');

let connected = false;

exports.handler = async (event, context) => {
  if (!connected) {
    try {
      await connectDB();
      connected = true;
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Database connection failed',
        }),
      };
    }
  }
  return serverless(app)(event, context);
};
