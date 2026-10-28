const Message = require('../models/Message');

/**
 * @desc    Submit a contact message from the portfolio contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Name, email and message are required');
    }

    const msg = await Message.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: msg,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitMessage };
