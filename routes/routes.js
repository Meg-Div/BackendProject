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

const authenticateAdmin = (req, res, next) => {
  if (req.session.user.admin == true) {
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // getting the user from the database
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });
  // create error messages:
  if (!user) {
    res.render("pages/login");
    return;
  }
  if (user) {
    // comparing passwords
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log(10);
        res.render("pages/login");
        return;
      }
      if (!result) {
        console.log(12);
        res.render("pages/login");
        return;
      }
      req.session.user = user.dataValues;
      user.admin == true ? res.redirect("/admin") : res.redirect("/hub");
    });
  }
});

router.get("/hub", authenticate, async (req, res) => {
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
router.get("/admin", authenticate, authenticateAdmin, (req, res) => {
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
    admin: true,
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
  console.log(12);
  console.log(req.session);
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  }
});

//you voted
router.get("/youvoted", authenticate, (req, res) => {
  res.render("pages/youvoted", {});
});

//review
router.get("/review", (req, res) => {
  res.render("pages/review", {});
});

module.exports = router;
