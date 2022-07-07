const express = require('express');
const router = express.Router();

// DAO
const DAO = require('./../db/sqlite');
const dao = new DAO();

const FaqContentRepository = require("./../repository/faqContent");
const faqContentMiddleware = require("./../middleware/faqContent");
const faqContentRepo = new FaqContentRepository(dao);

/**
 * Fetch all the faq content
 */
router.get("/", (req, res) => {
  faqContentRepo.get().then((result) => res.json(result));
});

/**
 * Add a new faq content
 */
router.post("/add", faqContentMiddleware, (req, res) => {
  faqContentRepo.create(req.body.title, req.body.description).then((result) => {
    res.json({...result, success: true});
  });
});

/**
 * Fetch the schema of faq content
 */
router.get("/schema", (req, res) => {
  faqContentRepo.getSchema().then((result) => {
    result = result.length ? JSON.parse(result[result.length - 1].schema) : {};
    res.json({...result, success: true})});
});

/**
 * Upload new schema for faq content
 */
router.post("/upload-schema", (req, res) => {
  faqContentRepo.createSchema(req.body).then((result) => {
    res.json({...result, success: true});
  });
});

module.exports = router;
