var server;
var controller;
var visuals;
var audio;

function setup() {
    server = new Server('http://stamga.com/sonus/server/server.php', Math.round(random(10000000000)));
    controller = new Controller();
    visuals = new Visuals(random(100), random(100), random(255), random(255), random(255));
    audio = new Audio(1);

    server.init();
    controller.init();
    audio.init();

    createCanvas(windowWidth, windowHeight);
    $(window).resize(function () { createCanvas(windowWidth, windowHeight) });
}

function draw() {
    background(255, 10);
}

/*
VISUALS CLASS
--- Manages and launches color bursts.
*/
function Visuals(posX, posY, valR, valG, valB) {
    this.posX = posX;
    this.posY = posY;
    this.valR = valR;
    this.valG = valG;
    this.valB = valB;
    this.size = 100;

    this.showMe = function(keycode) {
        noStroke();
        fill(this.valR, this.valG, this.valB);
        ellipse(this.posX/200*windowWidth+keycode+100, this.posY/200*windowHeight-keycode*2+100, this.size*keycode/100, this.size*keycode/100);
    }

    this.showOther = function(posX, posY, valR, valG, valB, keycode) {
        noStroke();
        fill(valR, valG, valB);
        ellipse(posX/200*windowWidth+keycode+100, posY/200*windowHeight-keycode*2+100, this.size*keycode/100, this.size*keycode/100);
    }
}

/*
AUDIO CLASS
--- Manages and plays sounds.
*/
function Audio(type) {
    this.type = type;
    this.osc = new p5.Oscillator();
    this.reverb = new p5.Reverb();
    this.env = new p5.Env();

    this.init = function() {
        if(this.type == 1) {
            var attackLevel = 1.0;
            var releaseLevel = 0;

            var attackTime = 0.001
            var decayTime = 0.2;
            var susPercent = 0.2;
            var releaseTime = 0.5;
            this.env.setADSR(attackTime, decayTime, susPercent, releaseTime);
            this.env.setRange(attackLevel, releaseLevel);
            this.osc.setType('triangle');
        }
        this.osc.freq(240);
        this.osc.amp(this.env);
        this.osc.start();
    }

    this.play = function(keycode) {
        this.osc.freq(keycode*3);
        this.env.play();
    }
}

/*
SERVER CLASS
--- Maintains connection with database and contains functions for sending and receiving data.
*/
function Server(url, clientID) {
    this.lastTimeStamp = null;
    this.connectionTimer;
    this.url = url;
    this.clientID = clientID;

    this.init = function() {
        this.connect({ 'lastTimeStamp': this.lastTimeStamp });
        console.log("%cYOU ARE CLIENT " + this.clientID, "background-color:green; color:#fff;");
    }

    this.connect = function(queryString) {
        var self = this;
        $.ajax({
                type: 'GET',
                url: this.url,
                data: queryString,
                async: true,
                success: function(receivedData){
                    if(receivedData) {
                        self.receiveData(receivedData);
                    }
                }
            }
        );
    };

    this.sendData = function(keycode) {
        clearTimeout(this.connectionTimer);
        currentData = {
            'id': this.clientID,
            'type': audio.type,
            'posX': visuals.posX,
            'posY': visuals.posY,
            'valR': visuals.valR,
            'valG': visuals.valG,
            'valB': visuals.valB,
            'keycode': keycode
        }
        var queryString = {
            'lastTimeStamp': this.lastTimeStamp,
            'currentData': currentData
        };
        this.connect(queryString)
    }

    this.receiveData = function(receivedData) {
        var self = this;
        var row = jQuery.parseJSON(receivedData);
        if(row !=null) {
            for(i = 0; i < row.length; i++){
                var obj = row[i];
                if(this.lastTimeStamp != obj.timestamp) {
                    this.lastTimeStamp = obj.timestamp;
                    if(parseInt(obj.id) != this.clientID) {
                        console.log("%cGOT " + obj.keycode + " FROM CLIENT " + obj.id, "background-color:red; color:#fff;");
                        audio.play(obj.keycode);
                        visuals.showOther(parseInt(obj.posX), parseInt(obj.posY), parseInt(obj.valR), parseInt(obj.valG), parseInt(obj.valB), parseInt(obj.keycode));
                    }
                }
            }
        }
        clearTimeout(this.connectionTimer);
        this.connectionTimer = setTimeout(function(){
            self.connect({ 'lastTimeStamp': self.lastTimeStamp });
        }, 100)
    }
};

/*
CONTROLLER CLASS
--- Takes keyboard input and triggers events accordingly while passing keycodes.
*/
function Controller() {
    this.lastKeyPress;

    this.init = function() {
        var self = this;
        $(document).keydown(function(e) {self.keyDown(e.which)});
        $(document).keyup(function(e) {self.keyUp(e.which)});
    }

    this.keyDown = function(keycode) {
        if(keycode != this.lastKeyPress) {
            this.lastKeyPress = keycode;
            server.sendData(keycode);
            audio.play(keycode);
            visuals.showMe(keycode);
        }
    }

    this.keyUp = function(keycode) {
        this.lastKeyPress = '';
    }
}