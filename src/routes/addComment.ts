import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { query } from '../servers/mysql.server'
import { addComment } from '../middlewares/sql'

var router = express.Router();
router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  const commentData = req.body

  res.send({
    code: 0,
    data: commentData
  })
});
module.exports = router;