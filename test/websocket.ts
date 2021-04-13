import * as WebSocket from 'ws'

let ws = new WebSocket('ws://localhost:8080/ws/1');

// 打开WebSocket连接后立刻发送一条消息:
ws.on('open', function () {
  console.log(`[CLIENT] open()`);
  setInterval(() => {
    ws.send('Hello!');
  }, 5000)
});

// 响应收到的消息:
ws.on('message', function (message) {
  console.log(`[CLIENT] Received: ${message}`);
})
