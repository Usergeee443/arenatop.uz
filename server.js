const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const root = __dirname;

const legacyToHome = ["about", "contact", "faq", "features"];
legacyToHome.forEach((name) => {
  app.get(`/${name}`, (req, res) => {
    res.redirect(301, "/");
  });
  app.get(`/${name}.html`, (req, res) => {
    res.redirect(301, "/");
  });
});

app.get("/biznes", (req, res) => {
  res.redirect(301, "/arena/");
});
app.get("/biznes.html", (req, res) => {
  res.redirect(301, "/arena/");
});

app.get("/arena.html", (req, res) => {
  res.redirect(301, "/arena/");
});

app.get(/^\/arena\/?$/i, (req, res) => {
  res.sendFile(path.join(root, "arena", "index.html"));
});

const htmlPages = fs
  .readdirSync(root)
  .filter(
    (f) =>
      f.endsWith(".html") &&
      f !== "index.html" &&
      f !== "arena.html"
  )
  .map((f) => f.replace(/\.html$/, ""));

htmlPages.forEach((name) => {
  app.get(`/${name}.html`, (req, res) => {
    res.redirect(301, `/${name}`);
  });
  app.get(`/${name}`, (req, res) => {
    res.sendFile(path.join(root, `${name}.html`));
  });
});

app.use(express.static(root, { index: "index.html" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ArenaTop: http://localhost:${PORT}`);
});
