import { createApp, upload } from "./config.js";

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
  let posts = await app.locals.pool.query(
    "select * from posts ORDER BY id DESC"
  );
  if (req.query.suche) {
    posts = await app.locals.pool.query(
      "SELECT * FROM posts WHERE title LIKE '%' || $1 || '%'",
      [req.query.suche]
    );
  }
  res.render("home", { posts: posts.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Neuer Post */
app.get("/new_post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

/* Login */
app.get("/login", async function (req, res) {
  res.render("login", {});
});

/* Registrieren */
app.get("/register", async function (req, res) {
  res.render("register", {});
});

/* Post erstellen mit Bild hochladen */
app.post("/create_post", upload.single("image"), async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (title, image ,place, price, numberofpeople, activitycategory, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      req.body.title,
      req.file.filename,
      req.body.place,
      req.body.price,
      req.body.numberofpeople,
      req.body.activitycategory,
      req.body.description,
    ]
  );
  res.redirect("/");
});

/* Liken  */
app.post("/like/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
    [req.params.id, req.session.userid]
  );
  res.redirect(`/activity/${req.params.id}`);
});

/* kommentieren */

app.post("/comment/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const commentText = req.body.comment;
  await app.locals.pool.query(
    "INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3)",
    [req.params.id, req.session.userid, commentText]
  );

  // Zurück zur Aktivitätsseite oder woanders hinleiten
  res.redirect(`/activity/${req.params.id}`);
});

/* Likes Anzahl anzeigen und Kommentare anzeigen */
app.get("/activity/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const posts = await app.locals.pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [req.params.id]
  );

  const likes = await app.locals.pool.query(
    "SELECT COUNT(user_id) FROM likes WHERE post_id = $1",
    [req.params.id]
  );

  /* User Tabelle joinen um den Username zu erhalten */
  const comments = await app.locals.pool.query(
    "SELECT c.text, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1",
    [req.params.id]
  );

  console.log(likes);
  res.render("details", {
    posts: posts.rows[0],
    likes: likes.rows[0],
    comments: comments.rows,
  });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
