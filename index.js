const express = require("express");
const app = express();
const PORT = 3009;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const models = require("./models");
const routes = require("./routes/routes");
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

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
  })
);
store.sync();

//route to the files in Routes folder
app.use("/", routes);

//localhost:3006/clinic/get_clinic

app.listen(PORT, console.log(`listening on port ${PORT}`));
