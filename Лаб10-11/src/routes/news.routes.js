const Router = require('express').Router;
const router = Router();
const newsController = require('../controllers/news.controller');

router.get('/news', newsController.getNews);
router.post('/news', newsController.createNews);
router.put('/news', newsController.updateNews);
router.delete('/news', newsController.deleteNews);

module.exports = router;