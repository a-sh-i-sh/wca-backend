const express = require('express')
const cors = require('cors')
const pool = require('./src/connection/db')
// const routes = require('./src/routes')

const PORT = 5000;
const app = express();



// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Load Routing
app.get("/", (req, res) => {
    res.send("Welcome to WCA Application!!!");
  });
  

// Create server
  app.listen(PORT, () => {
    console.log("Server up and listening on port " + PORT);
  });