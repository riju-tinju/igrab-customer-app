const express = require('express');
const router = express.Router();
const siteContentController = require('../controllers/siteContentController');

router.get('/', siteContentController.getSiteContent);

module.exports = router;
