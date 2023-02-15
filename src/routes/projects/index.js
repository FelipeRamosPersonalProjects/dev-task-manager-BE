const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers');

router.get('/', ctrl.projects.rootPath);
router.get('/get-project', ctrl.projects.getProject);
router.post('/create-project', ctrl.projects.createProject);
router.put('/update-project', ctrl.projects.updateProject);
router.delete('/delete-project', ctrl.projects.deleteProject);

module.exports = router;
