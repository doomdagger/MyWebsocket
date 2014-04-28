/**
 * Created by Li He on 2014/4/28.
 */


function MySocket(url, options){

    var me = this;

    function init(){
        me._socket = new SockJS(url, null, options);

        me._socket.onopen = function(){

            me._perform_bare_event('connection');

        };

        me._socket.onclose = function(){

            me._perform_bare_event('disconnect');

        };

        me._socket.onmessage = function(e){

            me._perform_event(e);

        };
    }


    this._event_cache = {};

    /**
     * listen on the event with the given name
     * @param event given event name
     * @param fn callback
     */
    this.on = function(event, fn){
        var me = this;

        (me._event_cache[event]=me._event_cache[event]||[]).push(fn);

    };

    /**
     * emit remote event with the given name and message
     * @param event given event name
     * @param message String or JSON
     */
    this.emit = function(event, message){

        var wrap = {
            'eventName' : event,
            'payload' : message
        };


        this._socket.send(JSON.stringify(wrap));
    };

    this._perform_event = function(rawMessage){
        console.log("In Coming Message:");
        console.log(rawMessage);

        var wrap = JSON.parse(rawMessage.data),
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

    this._perform_bare_event = function(event){

        if(event){
            var listeners = this._event_cache[event];

            if(listeners && listeners.length!=0){
                for(var index in listeners){
                    listeners[index]();
                }
            }
        }

    };

    init();
}