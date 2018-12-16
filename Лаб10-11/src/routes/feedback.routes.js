const Router = require('express').Router;
const router = Router();
const feedbackController = require('../controllers/feedbacks.controller');

router.get('/feedbacks', feedbackController.getFeedbacks);
router.post('/feedbacks', feedbackController.createFeedback);
router.put('/feedbacks', feedbackController.updateFeedback);
router.delete('/feedbacks', feedbackController.deleteFeedback);

module.exports = router;