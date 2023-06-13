const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');
const middlewares = require('@middlewares');

router.get('/dashboard', middlewares.authVerify, ctrl.pages.dashboard);

module.exports = router;
