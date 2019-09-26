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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrapedb";
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res){
    axios.get("https://www.vox.com/the-highlight").then(function(response){
        var $ = cheerio.load(response.data);

        $(".c-compact-river__entry").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .find("div.c-entry-box--compact")
            .find("div.c-entry-box--compact__body")
            .find("h2.c-entry-box--compact__title")
            .children("a")
            .text();

            result.link = $(this)
            .find("div.c-entry-box--compact")
            .find("div.c-entry-box--compact__body")
            .find("h2.c-entry-box--compact__title")
            .children("a")
            .attr("href");

            result.image = $(this)
            .find("div.c-entry-box--compact")
            .find("a.c-entry-box--compact__image-wrapper")
            .find("div.c-entry-box--compact__image")
            .find("noscript")
            .text();           

            result.articleDate = $(this)
            .find("div.c-entry-box--compact")
            .find("div.c-entry-box--compact__body")
            .find("div.c-byline")
            .find("span.c-byline__item")
            .find("time.c-byline__item")
            .text();

            result.author = $(this)
            .find("div.c-entry-box--compact")
            .find("div.c-entry-box--compact__body")
            .find("div.c-byline")
            .find("span.c-byline__item")
            .find("span.c-byline__author-name")
            .text();

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

app.get("/notes/:id", function(req, res) {
  db.Note.find({ articleId: req.params.id})
  .then(function(dbNote) {
    res.json(dbNote)
  })
  .catch(function(err){
    res.json(err);
  });
});

app.delete("/delete/:id", function(req, res) {
  console.log("path hit");
  db.Note.remove({ _id: req.params.id })
  .then(function(){
    console.log("note removed from db");
    res.sendStatus(200);
  })
})

app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
  });

