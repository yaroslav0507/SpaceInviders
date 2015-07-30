(function(){

    /* Canvas properties*/
    var canvas = {
        height: 768,
        width: 1280,
        getContext: getContext,
        node: Object
    };

    var cursor = {
        angle: Number,
        width: 0
    }

    canvas.node = document.getElementById('canvas');
    var ctx = canvas.getContext();

    function getContext() {
        return canvas.node.getContext('2d');
    };

    var coord = {
        x: Number,
        y: Number,


        drawGrid: function(step) {
            for (var x = .5; x <= canvas.width; x += step) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);

            };

            for (var y = .5; y <= canvas.height; y += step) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            };

            var x = 0
            if(x <= canvas.width){
                ctx.strokeStyle = "#eee";
                ctx.stroke();
            }
            x+= step;
        },


        drawCoordinates: function(){
            ctx.beginPath();
            ctx.moveTo(0, 40);
            ctx.lineTo(240, 40);
            ctx.moveTo(260, 40);
            ctx.lineTo(500, 40);
            ctx.moveTo(495, 35);
            ctx.lineTo(500, 40);
            ctx.lineTo(495, 45);

            ctx.moveTo(60, 0);
            ctx.lineTo(60, 153);
            ctx.moveTo(60, 173);
            ctx.lineTo(60, 375);
            ctx.moveTo(65, 370);
            ctx.lineTo(60, 375);
            ctx.lineTo(55, 370);

            ctx.strokeStyle = "#000";
            ctx.stroke();
        },

        refreshCanvas: function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            coord.drawGrid(10);
            coord.drawCoordinates();
        },


        getCoords: function(event){
            this.x = event.clientX;
            this.y = event.clientY;
        },


        show: function(event){
            this.getCoords(event);
            var coor = "X: " + this.x + ", Y: " + this.y;
            document.getElementById('coords').innerHTML = coor;
        },


        clear: function(event){
            document.getElementById('coords').innerHTML = '';
            coord.refreshCanvas();
        }

    };

    function showCursor(){
        coord.refreshCanvas();

        var pointer = ctx;
        pointer.rect(coord.x - cursor.width , coord.y - cursor.width, cursor.width, cursor.width);

        pointer.fillStyle = "red";
        pointer.fill();

    };


    function drawLine(smoothness){
        ctx.beginPath();
        ctx.moveTo(coord.x, coord.y);

        return setInterval(function(){
            ctx.lineTo(coord.x, coord.y);
            ctx.strokeStyle = "red";
            ctx.stroke();
        }, smoothness);
    };


    var Ball = function(x, y, r) {
        this.x = 150;
        this.y = 150;
        this.r = 15;
        this.shape = Math.PI*2;

        this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, this.shape, true);
            ctx.fillStyle = "blue";
            ctx.fill();
        }

        this.fall = function(){

        }
    }

    function init() {
        var drawLineInt = null;

        canvas.node.width = canvas.width;
        canvas.node.height = canvas.height;

        canvas.node.addEventListener("mousemove", function(){
            coord.show(event);
            //showCursor();
        });
        canvas.node.addEventListener("mouseleave", function(){
            //coord.clear(event);
        });

        canvas.node.addEventListener("mousedown", function () {
            drawLineInt = drawLine(1);
        });

        canvas.node.addEventListener("mouseup", function(){
            clearInterval(drawLineInt);
        });


        showCursor();

        var round = new Ball();

        round.x = 200;
        round.y = 150;
        round.r = 50;

        round.draw();
    }


    window.onload = init();
})();
