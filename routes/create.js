const express = require("express");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Users } = require("./sequelize/models");
const models = require("./sequelize/models");

const bcrypt = require("bcrypt");
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
    /*
    cookie: {
      secure: false,
      //milliseconds
      maxAge: 1592000000,
    },
    */
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

//route
//create
router.get("/create", authenticate, (req, res) => {
  const { firstname, lastname, username, password, zip } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    const dist = 1;
    zip[0] < 5 ? dist == 1 : dist == 2;
    const user = await Users.create({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hash,
      zip: zip,
      district: dist,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(200).render("pages/login");
  });
  res.render("pages/create", {});
});

module.exports = router;
