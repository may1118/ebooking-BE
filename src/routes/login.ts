var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req: any, res: any, next: any) {
  res.send('login');
});

module.exports = router;
