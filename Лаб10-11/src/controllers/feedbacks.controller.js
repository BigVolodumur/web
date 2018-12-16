const Feedback = require('../models/feedback.model');
var ObjectID = require('mongodb').ObjectID;

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().lean();
    res.json(feedbacks);
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.json(feedback);
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const updateFeedback = async (req, res) => {
  try {
	const id = req.params.id;
    const feedback = await Feedback.updateOne({"_id": ObjectID(req.body.id)}, req.body, {new: true});
    res.json(feedback).save();
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const deleteFeedback = async (req, res) => {
  try {
	const id = req.params.id;
    const feedback = await Feedback.findOneAndDelete({"_id": ObjectID(req.body.id)});
    
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

module.exports = {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
}