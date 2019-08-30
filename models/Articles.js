var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SaveArticles = new Schema({
    title: {
        type: String, 
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }
});

var Article = mongoose.model("Article", SaveArticles);

module.exports = Article;