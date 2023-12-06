const articlesService = require("./articles.service.js");
const NotFoundError = require("../../errors/not-found.js");

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
  // ...

  async updateArticle(req, res, next) {
    try {
      // Vérifiez si l'utilisateur est un admin
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError("Unauthorized: Only admins can update articles.");
      }

      const articleId = req.params.id;
      const { title, content } = req.body;
      const updatedArticle = await Article.findByIdAndUpdate(articleId, { title, content }, { new: true });
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
      // Vérifiez si l'utilisateur est un admin
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError("Unauthorized: Only admins can delete articles.");
      }

      const articleId = req.params.id;
      const deletedArticle = await Article.findByIdAndDelete(articleId);
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
