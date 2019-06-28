var express = require("express");
var multer = require("multer");
var path = require("path");

var app = express();
app.set("view engine", "ejs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/videoGallery", {
  useNewUrlParser: true
});

var bodyParser = require("body-parser");

var Videogallary = require("./models/videoupload");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public"));

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 11500000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myImage");

//Check File Type
function checkFileType(file, cb) {
  //Allowed extensions
  const fileTypes = /mp4/;
  //check extensions
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check MIME
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) return cb(null, true);
  else cb("Error: Images Only!");
}

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/upload", function(req, res) {
  res.render("upload");
});

app.get("/videogallery", function(req, res) {
  Videogallary.find({}, function(err, allVideoGallery) {
    if (err) {
      console.log(err);
    } else {
      res.render("videogallery", { gallery: allVideoGallery });
    }
  });
});

app.post("/upload", function(req, res) {
  var name = req.body.name;
  var path = req.body.path;

  var newVideoGallery = {
    name: name,
    path: path
  };
  Videogallary.create(newVideoGallery, function(err, newVideoGallery) {
    if (err) {
      console.log(error);
    } else {
      console.log(newVideoGallery);
      res.redirect("/videogallery");
    }
  });
});

app.get("/video/:id", function(req, res) {
  var id = req.params.id;
  res.render("playvideo", { id: id });
});

app.listen(5000, function(req, res) {
  console.log("Video Gallery Start....");
});
