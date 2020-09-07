const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require("cookie-parser");
const db = require("better-sqlite3")("forestheights/database.db");

exports.app = app
exports.config = {
  "dir": __filename,
  "subdomain": "forestheights."
}

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors())


app.post("/getComic", async (req, res, next) => {
  console.log(exports.config.subdomain, req.body)
  let id = req.body.id;

  let data = {};

  data["config"] = { "logo": db.prepare("SELECT `VALUE` from `config` WHERE `KEY` = ?").get("logo").VALUE, "count":  db.prepare("SELECT COUNT(ID) from `comics`").get()["COUNT(ID)"]}

  data["comic"] = id === -1 ? db.prepare("SELECT * from `comics` ORDER BY `ID` DESC LIMIT 1").get() : db.prepare("SELECT * from `comics` WHERE `ID` = ?").get(db.prepare("SELECT ID from `comics` ORDER BY `ID` ASC").all()[id-1].ID);

  res.json(data)
});

app.post("/getTag", async (req, res, next) => {
  console.log(exports.config.subdomain, req.body)

  let data = db.prepare(`SELECT comics.ID, comics.TITLE, comics.DESCRIPTION, comics.TAGS from comics, json_each(comics.TAGS) WHERE value = ?`).all(req.body.tag);
  
  res.json(data)
});

app.post("/getCharacters", async (req, res, next) => {
  console.log(exports.config.subdomain, req.body)

  let data = db.prepare(`SELECT * from characters`).all();
  
  res.json(data)
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000/")
});

