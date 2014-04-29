MyWebsocket
===========

Websocket client -- JavaScript library for s_framework's Websocket Module

To Use MyWebsocket, the learning process is simple enough. MyWebSocket depends on SockJS 0.3.4. Therefore, you should at least add two JavaScript files into your front-end project.

* [SockJS 0.3.4 source file](http://cdn.sockjs.org/sockjs-0.3.4.js)
* [MyWebSocket source file](https://raw.githubusercontent.com/doomdagger/MyWebsocket/master/js/lib/mysocket.js)

The Order is important, because MyWebSocket is build upon SockJS.

### Quick Start

##### To make a connection on websocket protocol
```javascript
var sock = new MySocket('http://127.0.0.1:8080/ecommerce/websocket/chat/');

sock.connect(); 
```

> Util you invoke connect() method on sock, the actual connect operation will not be executed.

##### To listen on or emit some events
```javascript
sock.on('say', function(message){
    console.log(message);
});


sock.on('ready', function(message){
    console.log(message);
    sock.emit('signin', {"id":"04012", "username":"lihe", "password":"123456"});
});
```
> Those codes must be written before the invocation of connect() method.

### Config the sock

* **reconnect** defaults to `true`
 * Should MyWebsocket automatically reconnect when it detects a dropped
 connection or timeout.

* **reconnection delay** defaults to `500` ms
  * The initial timeout to start a reconnect, this is increased using an
  exponential back off algorithm each time a new reconnection attempt has been
  made.

* **reconnection limit** defaults to `Infinity`
  * The maximum reconnection delay in milliseconds, or Infinity.

* **max reconnection attempts** defaults to `3`
  * How many times should MyWebsocket attempt to reconnect with the server after a
  a dropped connection.

#### How to alter the default configuration
```javascript

//via constructor
var sock = new MySocket('http://127.0.0.1:8080/ecommerce/websocket/chat/',{
  "reconnect" : false,
  "reconnection limit" : 10000,
  "max reconnection attempts" : 8
});

//via set method
sock.set("max reconnection attempts", 6);


```

### Exposed Events By Framework

MyWebsocket exponses some events on a system level. You can listen on these events and make some reaction.

 - `socket.on('connect', function () {})` - "connect" is emitted when the socket connected successfully 
 - `socket.on('connecting', function () {})` - "connecting" is emitted when the socket is attempting to connect with the server. 
 - `socket.on('disconnect', function () {})` - "disconnect" is emitted when the socket disconnected
 - `socket.on('error', function (message) {})` - "error" is emitted when an error occurs and it cannot be handled by the other event types.
 - `socket.on('reconnect', function () {})` - "reconnect" is emitted when socket.io successfully reconnected to the server.
 - `socket.on('reconnecting', function () {})` - "reconnecting" is emitted when the socket is attempting to reconnect with the server.


