var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SaveArticles = new Schema({
    title: {
        type: String, 
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    articleDate: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", SaveArticles);

module.exports = Article;