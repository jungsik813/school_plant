
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sumae0927',
  database : 'school_plant',
  port     : 3308
})
db.connect();


module.exports = db;