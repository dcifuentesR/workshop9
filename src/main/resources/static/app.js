var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var evento = JSON.parse(eventbody.body);
            	addPointToCanvas(new Point(evento["x"],evento["y"]));
            });
        });

    };
    
    

    return {

        init: function () {
            var canvas = document.getElementById("canvas");
            canvas.addEventListener("click",function(evento){
            	var punto = getMousePosition(evento);
            	app.publishPoint(punto.x,punto.y,$("#canvasID").val());
            	
            })
            //websocket connection
            //connectAndSubscribe();
        },

        publishPoint: function(px,py,canvasID){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);

            //publicar el evento
            stompClient.send("/topic/newpoint."+canvasID,{},JSON.stringify(pt));
        },
        
        connectAndSubscribe: function (canvasID) {
            console.info('Connecting to WS...');
            var socket = new SockJS('/stompendpoint');
            stompClient = Stomp.over(socket);
            
            //subscribe to /topic/TOPICXX when connections succeed
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/newpoint.'+canvasID, function (eventbody) {
                    var evento = JSON.parse(eventbody.body);
                	addPointToCanvas(new Point(evento["x"],evento["y"]));
                });
            });

        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();