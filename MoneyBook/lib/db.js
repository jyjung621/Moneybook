// MySql reference
var mysql = require('mysql');

// connection info
var db = mysql.createConnection({
    host      : 'localhost',
    user      : 'ruin',
    password  : '1234',
    database  : 'opentutorials',
    dateStrings: 'date'
});

// Real connection
db.connect(function(err) {
    if (err) {
        console.error('mysql connection error :' + err);
      } else {
        console.info('mysql is connected successfully.');
      }
});

// 외부에서 실행가능하게 함
module.exports = db;
