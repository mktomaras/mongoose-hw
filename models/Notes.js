var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SaveNotes = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", SaveNotes);

module.exports = Note;