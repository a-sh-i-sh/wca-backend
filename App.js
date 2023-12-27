const express = require("express");
const cors = require("cors");
const pool = require("./src/connection/db");
const web = require("./src/routes");
const bodyParser = require('body-parser')
const helmet = require("helmet");

const PORT = 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json())
app.use(helmet());

// Load Routing ...
// for accessing only admin use middlware here and on that page define/Load routes of
// that api which are only accessible for admin like app.use("/admin/api",AdminRoutes)
app.use("/api", web);



app.get("/", (req, res) => {
  res.send("Welcome to WCA Application!!!");
});

// Create server
app.listen(PORT, () => {
  console.log("Server up and listening on port " + PORT);
});
