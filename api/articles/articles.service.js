const Article = require("./article.model");

class ArticlesService {
  async createArticle(data) {
    try {
      const newArticle = new Article(data);
      await newArticle.save();
      return newArticle;
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(articleId, data) {
    try {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        data,
        { new: true }
      );
      if (!updatedArticle) {
        throw new Error("Article not found");
      }
      return updatedArticle;
    } catch (error) {
      throw error;
    }
  }

  async deleteArticle(articleId) {
    try {
      const deletedArticle = await Article.findByIdAndDelete(articleId);
      if (!deletedArticle) {
        throw new Error("Article not found");
      }
      return deletedArticle;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ArticlesService();