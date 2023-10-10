const articlesService = require("api/articles/articles.service.js");
const NotFoundError = require(".errors/not-found.js");

class ArticlesController {
  async createArticle(req, res, next) {
    try {
      const { title, content } = req.body;
      const newArticle = await articlesService.createArticle({ title, content });
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req, res, next) {
    try {
      const articleId = req.params.id;
      const { title, content } = req.body;
      const updatedArticle = await articlesService.updateArticle(articleId, { title, content });
      if (!updatedArticle) {
        throw new NotFoundError("Article not found");
      }
      res.json(updatedArticle);
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req, res, next) {
    try {
      const articleId = req.params.id;
      const deletedArticle = await articlesService.deleteArticle(articleId);
      if (!deletedArticle) {
        throw new NotFoundError("Article not found");
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArticlesController();
