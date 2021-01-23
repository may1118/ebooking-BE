import * as express from 'express'
var router = express.Router();

import { Request, Response,NextFunction } from 'express'

var setCookie = require('../servers/cookie.serve')

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  setCookie(res, 'name', 'mzy');
  setCookie(res, 'age', '21');
  setCookie(res, 'login', true);
  res.send('respond with a resource');
});

module.exports = router;
