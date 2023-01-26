const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Users, Positions, Districts } = require("../models");

//use postman:
//localhost:3007/auth/get_clinic

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

// Log in post route -- actually checks to see if that user exists in the database.
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // getting the user from the database
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });
  // checking username
  if (!user) {
    res.render("pages/login", { modal: "Username not found." });
    return;
  }
  if (user.password == password) {
    req.session.user = user.dataValues;
    console.log(req.session);
    res.redirect("/hub");
  }
  /* bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.render("pages/login", { modal: "Server error. Please try again." });
      return;
    }
    if (!result) {
      // result will be true if the passwords match
      res.render("pages/login", { modal: "Incorrect password. Try again." });
      return;
    }
    // If we're here, the passwords match. Add a session that stores user data and send them to the account page.
    req.session.user = user.dataValues;
    console.log(req.session);
    res.redirect("/account");
  });
  */
});

router.get("/create", async (req, res) => {
  res.render("pages/create", {});
});

//create
router.post("/create", (req, res) => {
  const { firstname, lastname, username, password, zip } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    const dist = Math.floor(Math.random() * 13) + 10;
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
  req.session.user = user;
  res.redirect("/hub");
});

//hub
router.get("/hub", async (req, res) => {
  console.log("hub");
  console.log(req.session);
  //need to parse out session object to get username
  const user = await Users.findOne({
    where: {
      username: req.session.username,
    },
  });
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
