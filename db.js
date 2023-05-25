var mysql = require("mysql2");

config = {
  host: "",
  user: "",
  password: "",
  database: "",
};
var con = mysql.createConnection(config);
con.connect(function (err) {
  if (err) {
    console.log("error connecting:" + err.stack);
  }
  console.log("connected successfully to DB.");
});

module.exports = {
  con: mysql.createConnection(config),
};
