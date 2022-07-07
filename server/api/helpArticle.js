const express = require('express');
const router = express.Router();

// DAO
const DAO = require('./../db/sqlite');
const dao = new DAO();

const HelpArticleRepository = require("./../repository/helpArticle");
const helpArticleMiddleware = require("./../middleware/helpArticle");
const helpArticleRepo = new HelpArticleRepository(dao);

/**
 * Fetch all help articles
 */
router.get("/", (req, res) => {
  helpArticleRepo.get().then((result) => res.json(result));
});

/**
 * Add new help articles
 */
router.post("/add", helpArticleMiddleware, (req, res) => {
  helpArticleRepo.create(req.body).then((result) => {
    res.json({...result, success: true});
  });
});

/**
 * Fetch help article schema
 */
router.get("/schema", (req, res) => {
  helpArticleRepo.getSchema().then((result) => {
    result = result.length ? JSON.parse(result[result.length - 1].schema) : {};
    res.json({...result, success: true})});
});

/**
 * Upload new help article schema
 */
router.post("/upload-schema", (req, res) => {
  helpArticleRepo.createSchema(req.body).then((result) => {
    res.json({...result, success: true});
  });
});

module.exports = router;
