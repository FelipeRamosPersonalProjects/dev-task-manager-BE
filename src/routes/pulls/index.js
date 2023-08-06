const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');

router.post('/begin', ctrl.pulls.begin);
router.post('/prepare', ctrl.pulls.prepare);
router.post('/commit', ctrl.pulls.commit);
router.post('/publish', ctrl.pulls.publish);
router.post('/changes-description', ctrl.pulls.changesDescription);
router.post('/create', ctrl.pulls.createPR);

module.exports = router;
