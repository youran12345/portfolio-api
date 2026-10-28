// =============================================================
//  Local development entry point.
//  Connects to MongoDB, then starts the Express server.
//  (For Vercel deployment see `api/index.js` + `vercel.json`.)
// =============================================================
require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `[server] running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  })
  .catch((err) => {
    console.error(`[server] failed to start: ${err.message}`);
    process.exit(1);
  });
