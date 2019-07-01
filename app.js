var express = require("express");
var multer = require("multer");
var path = require("path");
const ejs = require("ejs");
require("dotenv").config();
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
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, file.path + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("path");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /mp4/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Upload Videos Only!");
  }
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

app.post('/videogallery', (req, res) => {
  upload(req, res, (err) => {
    console.log(req);
      if (err) {
          res.render('upload', { msg: err });
      } else {
          if (req.file == undefined) {
              res.render('upload', { msg: 'Error: No File Selected!' });
          } else {

            var name = req.file.originalname;
      var path = req.file.originalname;
      var newVideoGallery = {
        name: name,
        path: path
      };
              //Create a new image and save to db
              Videogallary.create(newVideoGallery, function(err, newlyCreated) {
                  if (err) {
                      console.log(err);
                  } else {
                      Videogallary.find({}, function(err, allVideoGallery) {
                          res.render('upload', { gallery: allVideoGallery });
                      });
                  }
              });
          }
      }
  });
});

app.get("/video/:id", function(req, res) {
  var id = req.params.id;
  res.render("playvideo", { id: id });
});

app.listen(process.env.PORT, function(req, res) {
  console.log("Video Gallery Start....");
});
