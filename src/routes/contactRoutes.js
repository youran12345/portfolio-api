const router = require('express').Router();
const { submitMessage } = require('../controllers/contactController');

router.post('/', submitMessage);

module.exports = router;
