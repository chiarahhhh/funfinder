import { createApp } from "./config.js";

const app = createApp({
  user: "holy_forest_9875",
  host: "bbz.cloud",
  database: "holy_forest_9875",
  password: "efb7b89ae77afb70c2366975afda7954",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("home", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/new_post", async function (req, res) {
  res.render("new_post", {});
});

app.get("/log-in", async function (req, res) {
  res.render("log-in", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
