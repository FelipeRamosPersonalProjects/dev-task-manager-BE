const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');

router.post('/begin', ctrl.pulls.begin);

module.exports = router;
