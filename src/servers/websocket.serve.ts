// 导入WebSocket模块:
import * as WebSocket from 'ws'
const express = require('express');
const expressWs = require('express-ws');

import { Request } from 'express'

const app = new express();
expressWs(app);


// 保存所有用户连接信息
const wsClients: any = {}
// 保存需要告知的信息
export let needTellHotel: any = []

app.ws('/ws/:wid', (ws: WebSocket, req: Request) => {
  const uid = Number(req.params.wid)
  wsClients[uid] = {}
  if (!wsClients && uid !== -1) {
    wsClients[uid] = {
      ws: ws
    }
  }
  ws.onclose = () => {
    console.log('>>> exit')
  }
  setInterval(() => {
    console.log('================================================================>')
    console.log('判断告知商家', needTellHotel)
    if (needTellHotel.length) {
      for (const item of needTellHotel) {
        const { hotel_id, data, isTell } = item
        if (!isTell && uid === hotel_id && ws.readyState === 1) {
          ws.send(JSON.stringify(data))
          item.isTell = true
        }
      }
    }
  }, 3 * 1000)
})

app.listen(8888, () => {
  console.log('success.');
});


export const isConnect = (uid: any): boolean => {
  const isConnect = Object.keys(wsClients).filter((item: any) => {
    const { ws } = item
    return Number(ws) === Number(uid)
  })
  return Boolean(isConnect.length)
}
export const newOrderTellHotel = (hotel_id: any) => {
  needTellHotel.push({
    hotel_id,
    data: {
      type: 'NEW-ORDER',
      voice: 'http://localhost:3000/voice/newOrder.m4a'
    },
    isTell: false
  })
}

setInterval(() => {
  console.log("==========")
  console.log("websocket clean finish start.")
  needTellHotel = needTellHotel.filter((item: any) => !item.isTell)
  console.log("websocket clean finish end.")
  console.log("==========")
}, 30 * 60 * 1000)