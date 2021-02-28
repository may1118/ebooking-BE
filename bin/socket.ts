var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

// 连接池
var clients: any[] = [];

wss.on('connection', function(ws: any) {
    // 将该连接加入连接池
    clients.push(ws);
    ws.on('message', function(message: string) {
        // 广播消息
        clients.forEach(function(ws1){
            if(ws1 !== ws) {
                ws1.send(message);
            }
          })
    });

    ws.on('close', function(message: string) {
        // 连接关闭时，将其移出连接池
        clients = clients.filter(function(ws1){
            return ws1 !== ws
        })
    });
});