var express = require('express');
var router = express.Router();

var setCookie = require('../servers/cookie.serve')
import { success, fail } from '../servers/http.server'

/* GET users listing. */
router.get('/', function(req: any, res: any, next: any) {
  console.log(req.cookies)
  setCookie(res, 'login', true);
  res.json(success({
    login: 'true'
  }, 'hello'))
});

module.exports = router;
