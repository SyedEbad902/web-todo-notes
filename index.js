import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current file
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  fs.readdir("./files", function (err, files) {
    console.log(files);
    res.render("index", { files: files });
  });
});

app.get('/files/:filename', function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    console.log(filedata);
      res.render("showFile", { fileName: req.params.filename , fileData : filedata });
  });
});


app.get('/edit/:filename', function (req, res) {
    res.render('edit', {fileName: req.params.filename} )
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.taskDetails,
    function (err) {
      console.log(err);
      res.redirect("/");
    }
  );
});

app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previousName}`,
    `./files/${req.body.newName.split(" ").join("")}.txt`,
    function (err) {
      console.log(err);
      res.redirect("/");
    }
  );
});



app.listen(3000);
