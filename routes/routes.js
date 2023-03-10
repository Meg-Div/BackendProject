const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Users, Positions, Districts } = require("../models");

let expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 30);

//custom middleware
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

  // comparing passwords
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.render("pages/login");
      return;
    }
    if (!result) {
      res.render("pages/login");
      return;
    }
    req.session.user = user.dataValues;
    user.admin == true ? res.redirect("/admin") : res.redirect("/hub");
  });
});

//hub:
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

//create
router.get("/create", async (req, res) => {
  res.render("pages/create", {});
});

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

router.post("/adminadd", async (req, res) => {
  const {
    positiontitle,
    positiondescription,
    districtid,
    candidate1,
    candidate2,
    candidate3,
  } = req.body;
  arr = [];
  candidate1 != "" ? arr.push(candidate1) : candidate1;
  candidate2 != "" ? arr.push(candidate2) : candidate2;
  candidate3 != "" ? arr.push(candidate3) : candidate3;

  const position = await Positions.create({
    positiontitle: positiontitle,
    positiondescription: positiondescription,
    votingcutoff: JSON.stringify(expirationDate),
    candidates: arr,
    districtid: districtid,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.redirect("/admin");
});

router.post("/adminupdate", async (req, res) => {
  const {
    positiontitle,
    positiondescription,
    districtid,
    candidate1,
    candidate2,
    candidate3,
  } = req.body;
  arr = [];
  candidate1 != "" ? arr.push(candidate1) : candidate1;
  candidate2 != "" ? arr.push(candidate2) : candidate2;
  candidate3 != "" ? arr.push(candidate3) : candidate3;
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  const position = await Positions.update(
    {
      positiontitle: positiontitle,
      positiondescription: positiondescription,
      votingcutoff: JSON.stringify(expirationDate),
      candidates: arr,
      districtid: districtid,
      updatedAt: new Date(),
    },
    {
      where: {
        districtid: districtid,
        positiontitle: positiontitle,
      },
    }
  );
  res.redirect("/admin");
});

//delete:
router.post("/deleteposition", async (req, res) => {
  const { positiontitle, districtid } = req.body;
  const positions = await Positions.destroy({
    where: {
      districtid: districtid,
      positiontitle: positiontitle,
    },
  });
  res.redirect("/admin");
});

//logout:
router.post("/logout", (req, res) => {
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
