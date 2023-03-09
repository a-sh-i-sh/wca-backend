const { createPool,createConnection } = require("mysql")

const dbConnectionInfo = {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "",
    connectionLimit: 10, //mysql connection pool length
    database: "wca"
  };
  
  //For mysql single connection
   var dbconnection = createConnection(
          dbConnectionInfo
  ); 

// created database once using below commented code and comment dbconnectionInfo 'database' key
//   dbconnection.query(`CREATE DATABASE wca`, function (error, results, fields) {
//     if(error){
//         console.log("Errors: ",error)
//     }else
//     console.log("Results: ",results);
// });

   dbconnection.connect(function (err) {
      if (!err) {
          console.log("Database is connected ... ");
      } else {
          console.log("Error connecting database ... ");
      }
  }); 
  
  
  
  //create mysql connection pool
  // var dbconnection = createPool(
  //   dbConnectionInfo
  // );


  
  // Attempt to catch disconnects 
  // dbconnection.on('connection', function (connection) {
  //   console.log('DB Connection established');
  
  //   connection.on('error', function (err) {
  //     console.error(new Date(), 'MySQL error', err.code);
  //   });
  //   connection.on('close', function (err) {
  //     console.error(new Date(), 'MySQL close', err);
  //   });
  
  // });

  
  module.exports = dbconnection;