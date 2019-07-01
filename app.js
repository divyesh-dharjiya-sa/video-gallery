var express = require("express");
var multer = require("multer");
var path = require("path");
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
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    fName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fName);
  }
});
//Check File Type
function checkFileType(file, cb) {
  //Allowed extensions
  const fileTypes = /mp4/;
  //check extensions
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check MIME
  const mimeType = fileTypes.test(file.mimetype);
  if (!mimeType && extName) {
    cb("Error: Videos Only!");

  } else {
    return cb(null, true);

  }
}
//Init upload

var upload = multer({
  fileFilter: function (req, file, cb) {
    if (path.extension(file.originalname) !== '.pdf') {
      return cb(null, false)
    }

    cb(null, true)
  }
})


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
// app.post("/upload", function(req, res) {

//   upload(req, res, err => {
//     var name = req.body.name;
//     var path = req.body.path;

//     var newVideoGallery = {
//       name: name,
//       path: path
//     };
//     if (err) {
//       res.render("upload", { msg: err });
//     } else {
//       if (req.file == undefined) {
//         res.render("upload", { msg: "Error: No File Selected!" });
//       } else {
//         //Create a new image and save to db
//         Videogallary.create(newVideoGallery, function(err, video) {
//               if (err) {
//                 console.log(error);
//               } else {
//                 console.log(video);
//                 res.redirect("/upload");
//               }
//             });
//       }
//     }
//   });
// });

app.get("/video/:id", function(req, res) {
  var id = req.params.id;
  res.render("playvideo", { id: id });
});

app.listen(process.env.PORT, function(req, res) {
  console.log("Video Gallery Start....");
});
