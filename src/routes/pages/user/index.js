const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');

// Child Routes
router.get('/signup', ctrl.pages.user.signup);
router.get('/signin', ctrl.pages.user.signin);

module.exports = router;
