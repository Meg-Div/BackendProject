const express = require("express");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const models = require("./sequelize/models");

const router = express.Router();

//middleware
router.use(express.json());

// configure the app to use bodyParser()
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.use(cookieParser());

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const store = new SequelizeStore({ db: models.sequelize });

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

store.sync();
router.set("view engine", "ejs");

//logout
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  }
});

module.exports = router;
