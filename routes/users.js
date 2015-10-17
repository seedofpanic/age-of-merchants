var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  DB.query('SELECT * from users', function (err, rows, fields) {
    res.send(rows);
  });
});

module.exports = router;
