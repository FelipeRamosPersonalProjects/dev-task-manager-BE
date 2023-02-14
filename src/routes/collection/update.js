const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers');

router.post('/document', ctrl.collection.update.document);

module.exports = router;
