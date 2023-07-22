const express = require('express');
const router = express.Router();
const ctrl = require('@controllers/components');

router.post('/', ctrl.getHTML);

module.exports = router;
