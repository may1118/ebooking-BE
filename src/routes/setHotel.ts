import * as express from 'express'
var router = express.Router();

import { Request, Response,NextFunction } from 'express'

/* GET users listing. */
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

module.exports = router;
