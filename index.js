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
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const posts = await app.locals.pool.query("select * from posts");
  res.render("home", { posts: posts.rows });
});

app.get("/activity/:id", async function (req, res) {
  const posts = await app.locals.pool.query(
    `SELECT * FROM posts WHERE id = ${req.params.id}`
  );
  res.render("details", { posts: posts.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/new_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});

app.post("/create_post", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (title, image,place, price, numberofpeople, activitycategory, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      req.body.title,
      req.body.image,
      req.body.place,
      req.body.price,
      req.body.numberofpeople,
      req.body.activitycategory,
      req.body.description,
    ]
  );
  res.redirect("/");
});
