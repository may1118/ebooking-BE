var express = require('express');
var router = express.Router();

var setCookie = require('../servers/cookie.serve')

/* GET users listing. */
router.get('/', function(req: any, res: any, next: any) {
  setCookie(res, 'name', 'mzy');
  setCookie(res, 'age', '21');
  setCookie(res, 'login', true);
  res.send('respond with a resource');
});

module.exports = router;
