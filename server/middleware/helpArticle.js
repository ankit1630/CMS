const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * Article schema
 */
const articleSchema = {
  type: "object",
  properties: {
    title: {type: "string", minLength: 1},
    subtitle: {type: "string", minLength: 1},
    image: {
      type: "object",
      properties: {
        url: {type: "string", minLength: 1},
        alt_text: {type: "string", minLength: 1}
      },
      required: ["url"]
    },
    paragraph: {type: "string", minLength: 1}
  },
  required: ["title", "subtitle", "image", "paragraph"],
  additionalProperties: false
};

/**
 * Article middleware - to massage the response and request
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next method/middleware to call
 */
const helpArticleMiddleware = (req, res, next) => {
  const validateArticleSchema = ajv.compile(articleSchema);

  if (validateArticleSchema(req.body)) {
    req.message = "The article is correct";
    next();
  } else {
    res.status(500).send(validateArticleSchema.errors);
  }
}

module.exports = helpArticleMiddleware;
