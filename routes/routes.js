const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Users, Positions, Districts } = require("../models");
const models = require("../models");

//use postman:
//localhost:3007/auth/get_clinic

const session = require("express-session");
const bodyParser = require("body-parser");

//middleware
router.use(express.json());

// configure the app to use bodyParser()
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

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

//custom middleware

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

//authenticate

//admin:
router.get("/admin", (req, res) => {
  res.render("pages/admin", {});
});

//home:
router.get("/home", (req, res) => {
  res.render("pages/home", {});
});

//review
router.get("/review", (req, res) => {
  res.render("pages/review", {});
});

//you voted
router.get("/youvoted", (req, res) => {
  res.render("pages/youvoted", {});
});

router.get("/login", (req, res) => {
  res.render("pages/login");
});

//login:
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.session.user);
  const user = await Users.findOne({
    where: {
      username: req.session.username,
    },
  });
  const match = bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    if (!result) {
      res.status(401).send("Your password is incorrect.");
      res.redirect("/login");
      return;
    }
  });
  if (match) {
    req.session.user = user;
    res.redirect("/hub");
  }
});

router.get("/create", (req, res) => {
  res.render("pages/create");
});

//create
router.post("/create", (req, res) => {
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
      districtid: dist,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(200).render("pages/login");
  });
  res.render("pages/create", {});
});

//hub
router.get("/hub", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: {
      username: req.session.username,
    },
  });
  console.log("username:", user.username);
  const district = await Districts.findOne({
    where: {
      districtid: req.session.user.districtid,
    },
  });
  const position = await Positions.findOne({
    where: {
      districtid: req.session.user.districtid,
    },
  });
  res.render("pages/hub", {
    user: user,
    district: district,
    position: position,
  });
});

module.exports = router;
