import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import { queryNoParams } from '../servers/mysql.server'
import { getHotelStudyVideo } from '../middlewares/sql'

import { protocol, IP, port } from '../config/serve'

var router = express.Router();
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const data = await queryNoParams(getHotelStudyVideo)
  const formatData = data.map((item: any) => {
    const url = item.study_url
    return {
      ...item,
      study_url: `${ protocol }://${ IP }:${ port }/${ url }`
    }
  })
  res.send({
    code: 0,
    data: formatData
  })
});
module.exports = router;