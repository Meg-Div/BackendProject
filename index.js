const express = require("express");
const app = express();
const PORT = 3009;

const session = require("express-session");
const routes = require("./routes/routes");
app.set("view engine", "ejs");

//route to the files in Routes folder
app.use("/", routes);

//localhost:3006/clinic/get_clinic

app.listen(PORT, console.log(`listening on port ${PORT}`));
