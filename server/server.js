const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const faqContentRoutes = require("./api/faqContent");
const helpArticleRoutes = require("./api/helpArticle");

const PORT = process.env.PORT || 3001;
const allowedOrigins = ["http://localhost:3000", "https://dapper-meringue-ff27da.netlify.app"];
const app = express();

// global middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({ extended: true}));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If you're using cookies or authentication
  })
);
// routes
app.use("/api/faq-content", faqContentRoutes);
app.use("/api/help-article", helpArticleRoutes);

// not matched with any routes, send 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

// server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
