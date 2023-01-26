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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });
  if (password == user.password) {
    console.log(user.username);
    console.log(username);
    console.log(user.password);
    console.log(password);
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    if (!result) {
      console.log(user);
      console.log(user.password);
      console.log(user.username);
      res.status(401).send("Your password does not match.");
      return;
    }
    res.status(200).res.render("pages/hub", { user: user });
  });
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
  console.log(req.session);
  //need to parse out session object to get username
  const user = await Users.findOne({
    where: {
      username: req.session.user,
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
