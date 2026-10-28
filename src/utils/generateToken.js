const jwt = require('jsonwebtoken');

// Generate a signed JWT containing the user's id.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
