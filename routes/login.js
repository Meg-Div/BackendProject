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
  })
);

store.sync();
router.set("view engine", "ejs");

//login
//authentication
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    if (!result) {
      res.status(401).send("Your password does not match.");
      res.redirect("/login");
      return;
    }
  });
});

module.exports = router;
