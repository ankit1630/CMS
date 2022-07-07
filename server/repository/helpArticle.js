const uuid = require("./../util/uuid");

class HelpArticleRepository {
  constructor(dao) {
    this.dao = dao;
    this.dao.createTable(
        `CREATE TABLE if not exists HELP_ARTICLE (
          id VARCHAR(100),
          title TEXT,
          subtitle TEXT,
          image_url VARCHAR(100),
          image_alt_text TEXT,
          paragraph TEXT)`
    );
    this.dao.createTable("CREATE TABLE IF NOT EXISTS HELP_ARTICLE_SCHEMA (id VARCHAR(100), schema TEXT)");
  }

  create(helpArticleConfig) {
    const {title, subtitle, image, paragraph} = helpArticleConfig;
    return this.dao.run(
      `INSERT INTO HELP_ARTICLE (id, title, subtitle, image_url, image_alt_text, paragraph) VALUES (?, ?, ?, ?, ?, ?);`,
      [uuid("help-article"), title, subtitle, image.url, image.alt_text, paragraph])
  }

  get() {
    return this.dao.get(`SELECT * FROM HELP_ARTICLE`);
  }

  createSchema(schema) {
    return this.dao.run(
      `INSERT INTO HELP_ARTICLE_SCHEMA (id, schema) VALUES (?, ?);`,[uuid("help-article-schema"), JSON.stringify(schema)]);
  }

  getSchema() {
    return this.dao.get(`SELECT * FROM HELP_ARTICLE_SCHEMA`)
  }
}

module.exports = HelpArticleRepository;;
