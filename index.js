const express = require("express");
const app = express();
const PORT = 3009;

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Users } = require("./sequelize/models");
const models = require("./sequelize/models");

const bcrypt = require("bcrypt");
const router = express.Router();

//middleware
app.use(express.json());

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cookieParser());

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const store = new SequelizeStore({ db: models.sequelize });

app.use(
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
app.set("view engine", "ejs");

//custom middleware

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

//routes

//about us

app.get("/home", authenticate, (req, res) => {
  res.render("pages/home", {});
});

//create
app.get("/create", authenticate, (req, res) => {
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

router.post("/create_user", (req, res) => {
  const { firstName, lastName, userName, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    const user = await Users.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(200).render("pages/login");
  });
});

app.get("/admin", authenticate, (req, res) => {
  res.render("pages/admin", {});
});

app.get("/hub", authenticate, (req, res) => {
  res.render("pages/hub", {});
});

app.get("/review", authenticate, (req, res) => {
  res.render("pages/review", {});
});

app.get("/youvoted", authenticate, (req, res) => {
  res.render("pages/youvoted", {});
});

//logout
app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user = await Customers.findOne({
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

app.listen(3006, console.log(`logged into port 3006`));
