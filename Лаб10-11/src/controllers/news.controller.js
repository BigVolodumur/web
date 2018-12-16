const News = require('../models/news.model');

const getNews = async (req, res) => {
  try {
    const news = await News.find().lean();
    res.json(news);
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.json(news);
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const updateNews = async (req, res) => {
  try {
	const id = req.params.id;
    const news = await News.updateOne({"_id": ObjectID(req.body.id)}, req.body, {new: true});
    res.json(news).save();
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

const deleteNews = async (req, res) => {
  try {
	const id = req.params.id;
    const news = await News.findOneAndDelete({"_id": ObjectID(req.body.id)});
    
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
}

module.exports = {
  getNews,
  createNews,
  updateNews,
  deleteNews,
}