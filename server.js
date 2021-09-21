const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Get Notes
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// Post Notes
app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  var newID = uniqid();

  newNote.id = newID;

  fs.readFile("./db/db.json", (err, data) => {
    console.log("data", data);
    if (err) throw err;

    let dbFile = JSON.parse(data);
    dbFile.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(dbFile), "utf-8", (err) => {
      if (err) throw err;
      console.log("data saved!");
    });
  });
  res.redirect("/notes");
});

// Bonus - DELETE request
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    /* Create a new Array  */
    var finalArray = [];

    let dbFile = JSON.parse(data);
    deleteId = req.params.id;

    dbFile.filter((note) => {
      if (note.id !== deleteId) {
        finalArray.push(note);
      }
    });
    fs.writeFile("./db/db.json", JSON.stringify(finalArray), "utf-8", (err) => {
      if (err) throw err;
      console.log("data saved!");
    });
  });
  res.redirect("/notes");
});

//Default Generic route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function (req, res) {
  console.log("App listening on PORT:" + " " + PORT);
});
