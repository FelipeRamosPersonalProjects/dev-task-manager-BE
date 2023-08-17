const express = require('express');
const router = express.Router();
const ctrl = require('@controllers');

router.post('/open-editor', ctrl.repositories.openEditor);

module.exports = router;
