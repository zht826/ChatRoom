/**
 * Created by zhanghaitao on 17/3/13.
 */
socket = io.connect('ws://127.0.0.1:3030');
    //socket = io.connect('ws://tapi.zht87.com');
//收到消息
socket.on("message", function(data) {
    addMsgList(data);
    console.log(app.zone.msgList);
});
//登录成功
socket.on('login',function(obj) {
    console.log("连接状态", obj);
    app.isLogin = true;
    var data = {};
    data.name = "系统消息";
    data.msg = obj.user.username + " 进入聊天室" ;
    addMsgList(data);
    app.zone.onlineCount = obj.onlineCount;

    var userList = [];
    for(var o in obj.onlineUsers){
        userList.push({name: o});
    }
    app.onlineUser.userList = userList;
        console.log(userList);
});
//退出
socket.on('logout',function(obj) {
    console.log("连接状态", obj);
    var data = {};
    data.name = "系统消息";
    data.msg = obj.user.username + " 退出聊天室" ;
    addMsgList(data);
    app.zone.onlineCount = obj.onlineCount;

    var userList = [];
    for(var o in obj.onlineUsers){
        userList.push({name: o});
    }
    app.onlineUser.userList = userList;
    console.log(userList);
});
//需要弹出错误
socket.on('alertError',function(str) {
    alertComfirm.customAlert(str);
});
//添加信息
function addMsgList(data){
    app.zone.msgList = app.zone.msgList.concat(data);
    if(app.isLogin){
        Vue.nextTick(function () {
            // DOM 现在更新了
            var showBox = document.getElementById('show');
            showBox.scrollTop = showBox.scrollHeight;
        })
    }
}
var mySocket = {
    send:function(name,msg){//发送消息
        var data = {};
        data.name = name;
        data.msg = msg;
        socket.emit("message", data);
    },
    start: function(){
        socket = io.connect('ws://127.0.0.1:3030');
        //socket = io.connect('ws://tapi.zht87.com');
        socket.emit("login", {"username" : app.zone.username});//发送登录请求
    },
    quit:function(){
        socket.disconnect();//退出
        app.isLogin = false;
    }
};
