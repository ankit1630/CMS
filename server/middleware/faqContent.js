const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * Faq content schema
 */
const faqContentSchema = {
  type: "object",
  properties: {
    title: {type: "string", minLength: 1},
    description: {type: "string", minLength: 1}
  },
  required: ["title", "description"],
  additionalProperties: false
};

/**
 * Faq content middleware - to massage the response and request
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next method/middleware to call
 */
const faqContentMiddleware = (req, res, next) => {
  const validateFaqContentSchema = ajv.compile(faqContentSchema);

  if (validateFaqContentSchema(req.body)) {
    req.message = "Hellow from express Server";
    next();
  } else {
    res.status(500).send(validateFaqContentSchema.errors);
  }
}

module.exports = faqContentMiddleware;
