import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

var router = express.Router();

import { query } from '../servers/mysql.server'

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const val = await query('select * from user', [''])
  console.log(val)
  
  res.send('respond with a resource');
});

module.exports = router;
