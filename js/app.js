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

sock.on('connection',function(){
    console.log("connection open");
});

sock.on('say', function(message){
    console.log(message);
});

sock.on('disconnect', function(){
    console.log('connection close');
});


sock.on('online', function(message){
    console.log(message);
});


document.getElementById('say').onclick = function(){

    sock.emit('say', "hello");

};

document.getElementById('yell').onclick = function(){

    sock.emit('yell',"good");

};