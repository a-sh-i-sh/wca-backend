const { createPool, createConnection } = require("mysql");

const dbConnectionInfo = {
  host: "127.0.0.1",
  port: "3307",
  user: "root",
  password: "",
  connectionLimit: 10, //mysql connection pool length
  database: "wca",
};

// const dbConnectionInfo = {
//     host: "localhost",
//     user: "b4orient_wca",
//     password: "2B?NV8L.pSHC",
//     connectionLimit: 10, //mysql connection pool length
//     database: "b4orient_wca",
//   };


//create mysql connection pool
var dbconnection = createPool(dbConnectionInfo);

// Attempt to catch disconnects
dbconnection.on("connection", function (connection) {
  console.log("DB Connection established");

  connection.on("error", function (err) {
    console.error(new Date(), "MySQL error", err.code);
  });
  connection.on("close", function (err) {
    console.error(new Date(), "MySQL close", err);
  });
});

module.exports = dbconnection;


//   For mysql single connection
//    var dbconnection = createConnection(
//           dbConnectionInfo
//   );

//    dbconnection.connect(function (err) {
//       if (!err) {
//           console.log("Database is connected ... ");
//       } else {
//           console.log("Error connecting database ... ");
//       }
//   });