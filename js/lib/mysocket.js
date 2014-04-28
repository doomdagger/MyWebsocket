/**
 * Created by Li He on 2014/4/28.
 */

/**
 *
 * options can be like this:
 *
 * options = {devel: false, debug: false, protocols_whitelist: [],
 *                   info: undefined, rtt: undefined};
 *
 * @param {string} url the url of the websocket end point
 * @param {object} [configs] configs for the MySocket Object
 * @param {object} [options] options for the connection
 */
var MySocket = function (url, configs, options){

    //cache event bindings
    this._event_cache = {};
    //configs for MySocket
    this.configs = configs||{};
    this._configs = {
        'reconnect' : true,   //automatically reconnect when it detects a dropped connection or timeout
        'reconnection delay' : 500, //The initial timeout to start a reconnect, this is increased using an exponential back off algorithm each time a new reconnection attempt has been made.
        'reconnection limit' : 'Infinity', //The maximum reconnection delay in milliseconds, or Infinity
        'max reconnection attempts' : 5 //How many times should Socket.IO attempt to reconnect with the server after a a dropped connection. After this we will emit the reconnect_failed event.
    };

    for(var name in this.configs){
        if(this.configs.hasOwnProperty(name)){
            this._configs[name] = this.configs[name];
        }
    }

    this._url = url;
    //options for SockJS
    this._options = options;


    //indicate whether the current connect is reconnect or not
    this._in_reconnection = false;
    this._current_reconnection_count = 0;
    this._current_reconnection_cycle = null;
};


/**
 * get the next round delay
 * @returns {number} next delay time
 * @private
 */
MySocket.prototype._next_polling_delay = function(){
    var me = this,
        count = me._current_reconnection_count++;

    var delay =  Math.pow(2, count)*me.get('reconnection delay');

    var limit = me.get('reconnection limit');

    if(typeof limit == 'Number'){
        return delay<limit?delay:limit;
    }else{
        return delay;
    }

};

/**
 * set config for the socket object
 * @param name{string} name of the config item
 * @param value{boolean|object} value of the config item
 */
MySocket.prototype.set = function(name, value){
    this._configs[name] = value;
};

/**
 * Get config for the socket object
 * @param name name of the config item
 * @returns {*} config value
 */
MySocket.prototype.get = function(name){
    return this._configs[name];
};

/**
 * reconnect to server, this method is for the framework to invoke implicitly
 * @private
 */
MySocket.prototype._reconnect = function(){

    var me = this;

    var reconnect = me.get('reconnect'),
        count = me._current_reconnection_count,
        maxCount = me.get('max reconnection attempts');

    if(reconnect==true&&count<maxCount){
        delete me._socket;
        me._in_reconnection = true;

        me._current_reconnection_cycle = setTimeout(function(){
            me.connect();
        }, me._next_polling_delay());

    }
};

/**
 * reconnect to server, refresh the status of the object, start a new round of connect
 *
 * be careful to use it, it may add additional socket connection on your page without close the old one.
 */
MySocket.prototype.reconnect = function(){
    var me = this;

    if(me._current_reconnection_cycle){
        clearTimeout(me._current_reconnection_cycle);
    }

    //var maxCount = me.get('max reconnection attempts');

    //indicate whether the current connect is reconnect or not
    me._in_reconnection = false;
    me._current_reconnection_count = 0;

    if(me._socket){
        me._socket.close();

        delete me._socket;
    }

    me.connect();

};


/**
 * connect to the server
 */
MySocket.prototype.connect = function(){
    var me = this;

    me._current_reconnection_cycle = null;

    //point for connecting event to pop in
    if(me._in_reconnection){
        me._perform_bare_event('reconnecting');
    }else{
        me._perform_bare_event('connecting');
    }

    me._socket = new SockJS(me._url, null, me._options);


    me._socket.onopen = function(){

        if(me._in_reconnection){
            me._perform_bare_event('reconnect');
        }else{
            me._perform_bare_event('connect');
        }
    };

    me._socket.onclose = function(){

        me._perform_bare_event('disconnect');

        me._reconnect();

    };

    me._socket.onmessage = function(e){

        me._perform_event(e.data);

    };

};


/**
 * listen on the event with the given name
 * @param event given event name
 * @param fn callback
 */
MySocket.prototype.on = function(event, fn){
    var me = this;

    (me._event_cache[event]=me._event_cache[event]||[]).push(fn);

};




/**
 * emit remote event with the given name and message
 * @param event given event name
 * @param message String or JSON
 */
MySocket.prototype.emit = function(event, message){

    var wrap = {
        'eventName' : event,
        'payload' : JSON.stringify(message)
    };


    this._socket.send(JSON.stringify(wrap));
};

/**
 * the raw message object of sockjs pass in here,
 * and interpret it to socket message warp, grab the event name and the payload
 * of the message
 * @param rawMessage sockjs
 * @private
 */
MySocket.prototype._perform_event = function(rawMessage){
    console.log("In Coming Message:");
    console.log(rawMessage);

    var wrap = JSON.parse(rawMessage),
        event = wrap.eventName,
        message = JSON.parse(wrap.payload);

    console.log(wrap);

    if(event){

        console.log('event name: '+event);

        var listeners = this._event_cache[event];

        if(listeners && listeners.length!=0){

            console.log('has event listeners, run them now~');

            for(var index in listeners){
                listeners[index](message);
            }
        }
    }

};

/**
 * parse the event name to invoke the specific event,
 * this often invoke some local event assigned by the framework.
 * @param event event name
 * @private
 */
MySocket.prototype._perform_bare_event = function(event){

    if(event){
        var listeners = this._event_cache[event];

        if(listeners && listeners.length!=0){
            for(var index in listeners){
                listeners[index]();
            }
        }
    }

};