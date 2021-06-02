// 导入WebSocket模块:
import * as WebSocket from 'ws'
const express = require('express');
const expressWs = require('express-ws');

import { Request } from 'express'

const app = new express();
expressWs(app);

// 保存所有用户连接信息
const wsClients: any = {}

app.ws('/ws/:wid',  (ws: WebSocket, req: Request) => {
  const uid = Number(req.params.wid)
console.log(uid)
  wsClients[uid] = {}
  if(!wsClients && uid !== -1) {
    wsClients[uid] = {
      ws: ws
    }
  }
  ws.onclose = () => {
    console.log('>>> exit')
  }
})

app.listen(8888, () => {
  console.log('success.');
});


export const isConnect = (uid: any) => {
  Object.keys(wsClients).find((item: any) => {
    const { ws } = item
    return Number(ws) === Number(uid)
  })
}
