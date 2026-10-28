const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[db] Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
