var mongoose = require("mongoose");

var VideoGallerySchema = new mongoose.Schema({
        name: String,
        path: String
}) ;

module.exports = mongoose.model("videogallery" , VideoGallerySchema);