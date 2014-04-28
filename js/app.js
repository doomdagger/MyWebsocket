/**
 * Created by Li He on 2014/4/26.
 */

//var sock = new SockJS('http://127.0.0.1:8080/ecommerce/websocket/chat/');
//sock.onopen = function() {
//    console.log('open');
//};
//sock.onmessage = function(e) {
//    console.log('message', e.data);
//};
//sock.onclose = function() {
//    console.log('close');
//};


var sock = new MySocket('http://127.0.0.1:8080/ecommerce/websocket/chat/');

sock.on('connecting',function(){
    console.log("connecting");
});

sock.on('connect',function(){
    console.log("connect");
});


sock.on('disconnect', function(){
    console.log('disconnect');
});

sock.on('reconnecting', function(){
    console.log('reconnecting');
});

sock.on('reconnect', function(){
    console.log('reconnect');
});

sock.on('say', function(message){
    console.log(message);
});


sock.on('online', function(message){
    console.log(message);
});


sock.on('error', function(message){
    console.error(message);
});

sock.connect();

document.getElementById('say').onclick = function(){

    sock.emit('say', 1);

};

document.getElementById('yell').onclick = function(){

    sock.emit('yell',"good");

};

document.getElementById('syssetting').onclick = function(){

    sock.emit('area',{
        createperson: 0,
        createtime: null,
        editperson: 0,
        edittime: new Date(),
        propId: 1234,
        propKey: "嘿嘿",
        propValue: "good",
        remark: "This is the remark field"
    });

};


document.getElementById('reconnect').onclick = function(){

    sock.reconnect();

};