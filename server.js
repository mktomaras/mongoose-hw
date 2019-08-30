var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//In server.js, you need to have port point to process.env.PORT:
var PORT = process.env.PORT || 3000;
// you need to connect mongo from heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrapedb";
// you need to store it in a variable
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res){
    axios.get("https://www.vox.com/the-highlight").then(function(response){
        var $ = cheerio.load(response.data);

        $("h2.c-entry-box--compact__title").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });

        res.send("Scrape Complete");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
  });

