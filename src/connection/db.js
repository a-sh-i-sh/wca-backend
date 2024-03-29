const { createPool, createConnection } = require("mysql");

const dbConnectionInfo = {
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "",
  connectionLimit: 10, //mysql connection pool length
  database: "wca",
};

// const dbConnectionInfo = {
//   host: "localhost",
//   user: "b4orient_wca",
//   password: "2B?NV8L.pSHC",
//   connectionLimit: 10, //mysql connection pool length
//   database: "b4orient_wca",
// };

//create mysql connection pool
var dbconnection = createPool(dbConnectionInfo);

// Attempt to catch disconnects
dbconnection.on("connection", (connection) => {
  console.log("DB Connection established");

  connection.on("error",  (err) => {
    console.error(new Date(), "MySQL error", err.code);
  });
  connection.on("close", (err) => {
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
