const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');

router.post('/begin', ctrl.pulls.begin);
router.post('/prepare', ctrl.pulls.prepare);
router.post('/commit', ctrl.pulls.commit);

module.exports = router;
