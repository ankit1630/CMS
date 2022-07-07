const uuid = require("./../util/uuid");

class FaqContentRepository {
  constructor(dao) {
    this.dao = dao;
    this.dao.createTable("CREATE TABLE if not exists FAQ_CONTENT (id VARCHAR(100), title TEXT, description TEXT)");
    this.dao.createTable("CREATE TABLE IF NOT EXISTS FAQ_SCHEMA (id VARCHAR(100), schema TEXT)");
  }

  create(faqQuestion, faqAnswer) {
    return this.dao.run(
      `INSERT INTO FAQ_CONTENT (id, title, description) VALUES (?, ?, ?);`,
      [uuid("faq-content"), faqQuestion, faqAnswer]);
  }

  get() {
    return this.dao.get(`SELECT * FROM FAQ_CONTENT`);
  }

  createSchema(schema) {
    return this.dao.run(
      `INSERT INTO FAQ_SCHEMA (id, schema) VALUES (?, ?);`,[uuid("faq-schema"), JSON.stringify(schema)]);
  }

  getSchema() {
    return this.dao.get(`SELECT * FROM FAQ_SCHEMA`)
  }
}

module.exports = FaqContentRepository;;
