const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');
const middlewares = require('@middlewares');

// Child Routes
router.get('/create', middlewares.authVerify, ctrl.pages.projects.createProject);

module.exports = router;
