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

//custom middleware

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/home", authenticate, (req, res) => {
  res.render("pages/home", {});
});

module.exports = router;
