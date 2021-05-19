// 导入WebSocket模块:
import * as WebSocket from 'ws'
const express = require('express');
const expressWs = require('express-ws');

import { Request } from 'express'

const app = new express();
expressWs(app);

interface clientInterface {
  ws: WebSocket
}
interface wsClientInterface {
  [uid: string]: any;
}

// 保存所有用户连接信息
const wsClients: wsClientInterface = {}

app.ws('/ws/:wid',  (ws: WebSocket, req: Request) => {
  const uid = req.params.wid
console.log(uid)
  wsClients[uid] = {}
  if(!wsClients) {
    // wsClients[uid] = {
    //   ws: ws
    // }
  }
  ws.onclose = () => {

  }
  ws.send('hello')
})

app.listen(8888, () => {
  console.log('success.');
});
