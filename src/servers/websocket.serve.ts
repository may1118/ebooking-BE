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
  wsClients[uid] = {}
  if(!wsClients) {
    wsClients[uid] = {
      ws: ws
    }
  }

  console.log(req)
  ws.onclose = () => {

  }
})

app.listen(8888, () => {
  console.log('visit http://localhost:8888');
});
// // 引用Server类:
// const WebSocketServer = WebSocket.Server;

// // 实例化:
// const wss = new WebSocketServer({
//   port: 8080
// });

// wss.on('connection', (ws: WebSocket) => {
//   console.log(`[SERVER] connection()`);
//   ws.on('message', function (message) {
//     console.log(`[SERVER] Received: ${message}`);
//     ws.send(`ECHO: ${message} hello`, (err) => {
//       if (err) {
//         console.log(`[SERVER] error: ${err}`);
//       }
//     });
//   })
// })