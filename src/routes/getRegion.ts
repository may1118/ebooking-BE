import * as express from 'express'
import * as URL from 'url'
var router = express.Router();

import { Request, Response, NextFunction } from 'express'

import sendFormat from '../config/requestSendBack'

import { query } from '../servers/mysql.server'
import { positionByParent_id, positionByName } from '../middlewares/sql'

import { isVertify, vertifyType } from '../controllers/vertify'

const chinaId = '100000'

interface Position {
  region_id: string
  code: string
  name: string
  level: string
  parent_id: number
}
interface Params {
  parent_id?: string
  name?:string
}

async function getPositionFromDB(sql: string, pos: string) {
  return await query(sql, [pos])
}

router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    // const { parent_id, name } = req.query
    const params: Params = URL.parse(req.url, true).query;
    const parent_id: string | undefined = params.parent_id?.toString();
    const name: string | undefined = params.name?.toString();

    let position: Array<Position> = []
    if (parent_id && isVertify({
      type: vertifyType.REGIN,
      val: parent_id
    })) {
      position = await getPositionFromDB(positionByParent_id, parent_id)
    }
    if (name) {
      position = await getPositionFromDB(positionByName, name)
    }
    if (!parent_id && !name) {
      position = await getPositionFromDB(positionByParent_id, chinaId)
    }
    res.send(sendFormat({
      code: 0,
      data: position
    }));
  } catch (error) {
    res.send(sendFormat({
      code: 0,
      data: error
    }));
  }
});

module.exports = router;
