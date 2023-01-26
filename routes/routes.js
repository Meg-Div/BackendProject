const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Users, Positions, Districts } = require("../models");

//use postman:
//localhost:3007/auth/get_clinic

//custom middleware

let expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 30);

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

//authenticate

//home:
router.get("/home", (req, res) => {
  res.render("pages/home", {});
});

//login:

router.get("/login", (req, res) => {
  res.render("pages/login");
});

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

router.get("/hub", async (req, res) => {
  const findAllData = async () => {
    const user = Users.findOne({
      where: {
        username: req.session.user.username,
      },
    });
    const district = Districts.findOne({
      where: {
        id: req.session.user.districtid,
      },
    });

    const position = Positions.findAll({
      where: {
        districtid: req.session.user.districtid,
      },
    });
    return await Promise.all([user, district, position]);
  };
  const userData = await findAllData();
  res.render("pages/hub", {
    user: userData[0].dataValues,
    district: userData[1].dataValues,
    position: userData[2],
  });
});

router.get("/create", async (req, res) => {
  res.render("pages/create", {});
});

//create
router.post("/create", (req, res) => {
  const { firstname, lastname, username, password, zip } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    max = 12;
    min = 11;
    const dist = Math.floor(Math.random() * (max - min + 1)) + min;
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
    req.session.user = user.dataValues;
    res.redirect("/hub");
  });
});

//admin:
router.get("/admin", (req, res) => {
  res.render("pages/admin", {});
});

router.post("/adminupdates", async (req, res) => {
  const {
    positiontitle,
    positiondescription,
    districtid,
    candidate1,
    candidate2,
    candidate3,
  } = req.body;
  arr = [];
  candidate1 != null ? arr.push(candidate1) : candidate1;
  candidate2 != null ? arr.push(candidate2) : candidate2;
  candidate2 != null ? arr.push(candidate2) : candidate3;

  const user = await Users.create({
    positiontitle: positiontitle,
    positiondescription: positiondescription,
    votingcutoff: expirationDate,
    candidates: arr,
    districtid: districtid,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.redirect("/admin");
});

//delete
router.delete("/deleteposition", async (req, res) => {
  const { positiontitle, districtid } = req.body;
  const positions = await Positions.destroy({
    where: {
      districtid: districtid,
      positiontitle: positiontitle,
    },
  });
  res.send(`Deleted ${positiontitle} from district ${districtid}.`);
});

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  }
});

//you voted
router.get("/youvoted", (req, res) => {
  res.render("pages/youvoted", {});
});

//review
router.get("/review", (req, res) => {
  res.render("pages/review", {});
});

module.exports = router;
