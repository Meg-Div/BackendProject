const express = require("express");
const app = express();
const PORT = 3009;

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Customers } = require("./sequelize/models");
const models = require("./sequelize/models");

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

app.get("/aboutus", authenticate, (req, res) => {
  res.render("pages/aboutus", {});
});

//create
app.get("/create", authenticate, (req, res) => {
  const { firstname, lastname, username, password, admin, zip } = req.body;

  res.render("pages/create", {});
  console.log(req.body.zip);
  console.log(req.body.district);
  if (req.body.zip[0] <= 5) {
    req.body.district == 1;
  } else {
    req.body.district == 2;
  }
});

router.post("/create_user", (req, res) => {
  const { firstName, lastName, userName, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    const user = await Users.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: hash,
      createdAT: new Date(),
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

//login
//authentication
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user = await Customers.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    res.status(400).send("No user found");
    return;
  }
  //would normally use bcrypt instead of req.body
  if (user.password === req.body.password) {
    //where we start a session:
    console.log(user.dataValues);
    req.session.user = user.dataValues;
    res.redirect("/login");
    return;
  } else {
    res.status(400).send("Incorrect username or password");
  }
});

app.listen(3006, console.log(`logged into port 3006`));
