const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.submitApplication);
router.get('/', applicationController.getAllApplications);
router.get('/my-applications', applicationController.getMyApplications);
router.put('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;