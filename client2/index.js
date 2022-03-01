require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const session = require("express-session");

const routes = require("./routes");

(async () => {
  const app = express();

  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use("/", routes);

  app.listen(8081);
})();
