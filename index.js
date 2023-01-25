const express = require("express");
const app = express();
const PORT = 3009;

const session = require("express-session");
const routes = require("./routes/routes");
app.set("view engine", "ejs");

//route to the files in Routes folder
app.use("/admin", routes);
app.use("/create", routes);
app.use("/home", routes);
app.use("/hub", routes);
app.use("login", routes);
app.use("/review", routes);
app.use("/youvoted", routes);

//localhost:3006/clinic/get_clinic

app.listen(PORT, console.log(`listening on port ${PORT}`));
