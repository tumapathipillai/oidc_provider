require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const { urlencoded } = require("express");
const { I18n } = require("i18n");
const interactionRouter = require("./routes/interaction");
const oidc = require("./utils/provider");

const i18n = new I18n({
  locales: ["fr"],
  directory: path.join(__dirname, "locales"),
});

const app = express();

app.use(i18n.init);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(urlencoded({ extended: false }));

app.use("/oidc", oidc.callback());
app.use("/interaction/:uid", interactionRouter);

app.listen(3000);
