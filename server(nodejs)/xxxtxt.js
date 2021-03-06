//引入ws模块
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 8888});
//引入uuid模块
var uuid = require('uuid');
//定义一个空数组，存放客户端的信息
var clients = [];
//定义发送给客户端的消息方法wsSend
//参数为 type:类型
//client_uuid:随机生成的客户端id
//nickname:昵称
//message:消息
//clientcount:客户端个数
function wsSend(type, client_uuid, nickname, message,clientcount) {
    //遍历客户端
    for(var i=0; i<clients.length; i++) {
        //声明客户端
        var clientSocket = clients[i].ws;
        if(clientSocket.readyState === WebSocket.OPEN) {
            //客户端发送处理过的信息
            clientSocket.send(JSON.stringify({
                "type": type,
                "id": client_uuid,
                "nickname": nickname,
                "message": message,
                "clientcount":clientcount,
            }));
        }
    }
}

//声明客户端index默认为1
var clientIndex = 1;
//服务端连接
wss.on('connection', function(ws) {
//客户端client_uuid随机生成
    var client_uuid = uuid.v4();
    //昵称为游客+客户端index
    var nickname = "游客"+clientIndex;
    //client++
    clientIndex+=1;
    //将新连接的客户端push到clients数组中
    clients.push({"id": client_uuid, "ws": ws, "nickname": nickname});
    //控制台打印连接的client_uuid
    console.log('client [%s] connected', client_uuid);
    //声明连接信息为 昵称+来了
    // var connect_message = nickname + " 来了";
    var connect_message =  " 来了";

    //服务器广播信息 ***来了
    wsSend("notification", client_uuid, nickname, connect_message,clients.length);
    //当用户发送消息时
    ws.on('message', function(message) {
        // 用户输入"/nick"的话为重命名消息
        if(message.indexOf('/nick') === 0) {
            var nickname_array = message.split(' ');
            if(nickname_array.length >= 2) {
                var old_nickname = nickname;
                nickname = nickname_array[1];
                var nickname_message = "用户 " + old_nickname + " 改名为： " + nickname;
                wsSend("nick_update", client_uuid, nickname, nickname_message,clients.length);
            }
        }//发送消息
        else {
            wsSend("message", client_uuid, nickname, message,clients.length);
        }
    });
    //关闭socket连接时
    var closeSocket = function(customMessage) {
        //遍历客户端
        for(var i=0; i<clients.length; i++) {
            //如果客户端存在
            if(clients[i].id == client_uuid) {
                // 声明离开信息
                var disconnect_message;
                if(customMessage) {
                    disconnect_message = customMessage;
                } else {
                    disconnect_message = nickname + " 走了";
                }
                //客户端数组中删掉
                clients.splice(i, 1);
                //服务广播消息
                wsSend("notification", client_uuid, nickname, disconnect_message,clients.length);
            }
        }
    }
    ws.on('close', function() {
        closeSocket();
    });

    process.on('SIGINT', function() {
        console.log("Closing things");
        closeSocket('Server has disconnected');
        //process.exit();
    });
});