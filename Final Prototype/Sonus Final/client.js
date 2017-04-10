/*
SONUS CLIENT.JS
--- Programmed by Gabriel St-Amant, for Creative Computation II class, Concordia University.
*/

// -- Class variables
var server;
var controller;
var visuals;
var audio;

function setup() {
// -- Create classes
	server = new Server('http://stamga.com/sonus/server/server.php', Math.round(random(10000000000))); // Connects to server, picks random client ID
	controller = new Controller(); // Begins detecting keypresses or touches
	var type = Math.round(random(0, 3)); // Picks a client instrument type
	visuals = new Visuals(random(100), random(100), random(255), random(255), random(255), type); // Picks a canvas position, color and sends instrument type 
	audio = new Audio(type); // Begins audio generation based on instrument type

	// -- Initiate classes
	server.init();
	controller.init();
	audio.init();

	// -- Create canvas and resize if window resizes
	createCanvas(windowWidth, windowHeight);
	$(window).resize(function () { createCanvas(windowWidth, windowHeight) });
	$('body').addClass('loaded'); // Add loaded class when loaded, to trigger CSS animation
}

function draw() {
	// -- Draw visuals and overlay transparent rectangle to make faded animation
	visuals.display();
	noStroke();
	fill(255, 255, 255, 5);
	rect(0, 0, windowWidth, windowHeight);
}

/*
VISUALS CLASS
--- Manages and launches color bursts.
*/
function Visuals(posX, posY, valR, valG, valB, type) {
	this.posX = posX;
	this.posY = posY;
	this.valR = valR;
	this.valG = valG;
	this.valB = valB;
	this.type = type;
	this.size = 30;
	this.particles = [];

	// -- Generate visuals - Create new paricles and push to array, with sent parameters. If none, use current clients values.
	this.generate = function(keycode, posX = this.posX, posY = this.posY, valR = this.valR, valG = this.valG, valB = this.valB, type = this.type) {
		this.particles.push(new Particle(posX/100*(windowWidth-100)+(50-keycode)+50, posY/100*(windowHeight-100)+(50-keycode)+50, valR, valG, valB, this.size*(50-keycode)/25, (360-keycode*7), type));
	}

	// -- Display visuals - Triggers the display function of each particle and destroys when dead.
	this.display = function() {
		for(var i = this.particles.length-1; i > 0; i--) {
			this.particles[i].display();
			if(!this.particles[i].isAlive) {
				this.particles.splice(i, 1);
			}
		}
	}
}

/*
PARTICLES CLASS
--- Displays one single particle.
*/
function Particle(posX, posY, valR, valG, valB, size, angle, type) {
	this.brightness = random(-20,20); // Brightness adds slight color variation to each particle
	this.valR = valR+this.brightness;
	this.valG = valG+this.brightness;
	this.valB = valB+this.brightness;
	this.size = size;
	this.type = type;
	this.currentSize = size;
	this.mass = size;
	this.angle = angle;
	this.lifespan = 100;
	this.isAlive = true;
	this.velocity = createVector(0, 0);
	this.acceleration = createVector(0, 0);
	this.position = createVector(posX, posY);

	this.display = function() {

		// -- Attract particle to two specific points, creating a unified circular gravity movement.
		this.attract(createVector(windowWidth/8, windowHeight));
		this.attract(createVector(windowWidth, windowHeight/8));
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0.7);

		// -- Change size and mass according to reducing lifespan
		this.currentSize = this.size*this.lifespan/100;
		this.mass = this.currentSize/2;
		this.lifespan -= 1;

		// -- Set to predefined color
		noStroke();
		fill(this.valR, this.valG, this.valB, this.lifespan*2.5);

		// -- Change ellipse drawing method according to instrument type
		if(type == 0)  {
			// Fade out & shrink smoothly
			ellipse(this.position.x, this.position.y, this.currentSize, this.currentSize);
		}else if(type == 1) {
			// Fade out & shrink with random jitter effect
			ellipse(this.position.x, this.position.y, this.currentSize*random(0.3,1), this.currentSize*random(0.3,1));
		}else if(type ==2) {
			// Fade out & grow smoothly
			this.currentSize = 70-(100-this.size)*this.lifespan/100;
			ellipse(this.position.x, this.position.y, this.currentSize, this.currentSize);
		}else {
			// Fade out & grow with random jitter effect
			this.currentSize = 70-(100-this.size)*this.lifespan/100;
			ellipse(this.position.x, this.position.y, this.currentSize*random(0.3,1), this.currentSize*random(0.3,1));
		}

		// -- Not alive when lifespan is below 0
		if(this.lifespan <= 0) {
			this.isAlive = false;
		}
	}

	// -- Apply Force - Apply desired force to vector
	this.applyForce = function(force) {
		var f = force.div(this.mass);
		this.acceleration.add(f);
	}

	// -- Atttract - Attract particle to specific point
	this.attract = function(dest) {
		var force = dest.sub(this.position);
		var d = force.mag();
		if (d > 150) {
			d = constrain(d, 15.0, 60.0);
			force.normalize();
			var strength = (50 * this.mass) / (d * d);
			force.mult(strength);
			this.applyForce(force);
		}
	}

	// -- Apply random force on particle spawn
	this.applyForce(createVector(random(-30,30), random(-30,30)));
}


/*
AUDIO CLASS
--- Manages and plays sounds.
*/
function Audio(type) {
	this.type = type;

	// -- Variables for oscillators and sound environments
	this.oscList = [];
	this.envList = [];
	this.counter = 0;
	this.oscNb = 7;

	this.instruments = [{
		// XYLOPHONE instrument properties
		oscType : 'triangle',
		attackLevel : 0.5,
		releaseLevel : 0,
		attackTime : 0.001,
		decayTime : 0.2,
		susPercent : 0.2,
		releaseTime : 0.5
	},{
		// ORGAN instrument properties
		oscType : 'sawtooth',
		attackLevel : 0.2,
		releaseLevel : 0,
		attackTime : 0.15,
		decayTime : 0.1,
		susPercent : 0.5,
		releaseTime : 1
	},{
		// FLUTE instrument properties
		oscType : 'sine',
		attackLevel : 0.7,
		releaseLevel : 0,
		attackTime : 0.1,
		decayTime : 0.1,
		susPercent : 0.2,
		releaseTime : 0.3
	},{
		// PERCS instrument properties
		oscType : 'square',
		attackLevel : 0.1,
		releaseLevel : 0,
		attackTime : 0.001,
		decayTime : 0.2,
		susPercent : 2,
		releaseTime : 0.001
	}];

	// Midi note to frequency values - https://www.midikits.net/midi_analyser/midi_note_frequency.htm
	// C Major Scale - A, B, C, D, E, F, G
	// 55.00 = The musical fundamental note frequency
	this.scale = [55.0000000000, 61.7354126570, 65.4063913251, 73.4161919794, 82.4068892282, 87.3070578583, 97.9988589954];

	// -- Initialize - Create a list of environments and oscillators to allow to generate multiple sounds at a time
	this.init = function() {
		for(var i = 0; i < this.oscNb; i++) {
			this.envList[i] = new p5.Env();
			this.envList[i].setRange(0.5, 0);
			this.oscList[i] = new p5.Oscillator();
			this.oscList[i].amp(this.envList[i]);
			this.oscList[i].start();
		}
	}

	// -- Play - Cycles through the environments and oscillators, setting the parameters according to the instruments object
	this.play = function(keycode, type = this.type) {
		var self = this;
		if(this.counter >= this.oscNb-1) {
			this.counter = 0;
		}

		// Set frequency based on the scales array, cycling between the fundamental notes
		// Formula source: Digital Sound I class theory, Computation Arts
		var freq = this.scale[keycode%7]*Math.pow(2,Math.floor(keycode/7));
		this.oscList[this.counter].freq(freq);
		this.oscList[this.counter].setType(this.instruments[type].oscType);

		// Set the environment settings and play note
		this.envList[this.counter].setADSR(this.instruments[type].attackTime, this.instruments[type].decayTime, this.instruments[type].susPercent, this.instruments[type].releaseTime);
		this.envList[this.counter].setRange(this.instruments[type].attackLevel, this.instruments[type].releaseLevel);
		this.envList[this.counter].play();

		this.counter++;
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
	this.buffer = [];

	// -- Initialize by starting connecting to server
	this.init = function() {
		this.connect();
		console.log("%cYOU ARE CLIENT " + this.clientID, "background-color:black; color:#fff;");
	}

	// -- Connect to server and send all notes stored in buffer array, with timestamp
	this.connect = function() {
		var self = this;
		var queryString = {
			'lastTimeStamp': this.lastTimeStamp,
			'currentData': this.buffer
		};
		this.buffer = [];
		$.ajax({
			type: 'GET',
			url: this.url,
			data: queryString,
			async: true,
			success: function(receivedData){
				if(receivedData) {
					self.receiveData(receivedData);
				}
			},
			error: function (request, status, error) {
				console.log("%cSERVER ERROR " + error + "background-color:red; color:#fff;");
			}
		}
		);
	};

	// -- Add notes data to the buffer array, to be sent to server
	this.addData = function(keycode) {
		this.buffer.push({
			'id': this.clientID,
			'type': audio.type,
			'posX': visuals.posX,
			'posY': visuals.posY,
			'valR': visuals.valR,
			'valG': visuals.valG,
			'valB': visuals.valB,
			'keycode': keycode
		});
	}

	// -- Parse the received data and generate visuals and audio accordingly by calling their respective class
	this.receiveData = function(receivedData) {
		var self = this;
		var row = jQuery.parseJSON(receivedData);
		if(row !=null) {
				// Go through different notes received
				for(i = 0; i < row.length; i++){
					var obj = row[i];
					if(this.lastTimeStamp != obj.timestamp) {
						this.lastTimeStamp = obj.timestamp;
						if(parseInt(obj.id) != this.clientID) {
							console.log("%cGOT " + obj.keycode + " FROM CLIENT " + obj.id, "background-color:rgb("+obj.valR+","+obj.valG+","+obj.valB+"); color:#fff;");
							audio.play(obj.keycode, obj.type);
							visuals.generate(parseInt(obj.keycode), parseInt(obj.posX), parseInt(obj.posY), parseInt(obj.valR), parseInt(obj.valG), parseInt(obj.valB), obj.type);
						}
					}
				}
			}

		// -- Clear the timeout if it was still running and call the server again in 100 milliseconds, to send anything contained in buffer during this delay
		clearTimeout(this.connectionTimer);
		this.connectionTimer = setTimeout(function(){
			self.connect();
		}, 100)
	}
};

/*
CONTROLLER CLASS
--- Takes keyboard input and triggers events accordingly while passing keycodes.
*/
function Controller() {
	this.lastKeyPress = null;
	this.isFirstKey = true;

	// Object containing keycodes, manually mapped from QWERTY to their physical order
	this.keyMap = {
		90:0,
		88:1,
		67:2,
		86:3,
		66:4,
		78:5,
		77:6,
		188:7,
		190:8,
		191:9,
		65:10,
		83:11,
		68:12,
		70:13,
		71:14,
		72:15,
		74:16,
		75:17,
		76:18,
		186:19,
		222:20,
		81:21,
		87:22,
		69:23,
		82:24,
		84:25,
		89:26,
		85:27,
		73:28,
		79:29,
		80:30,
		219:31,
		221:32,
		220:33,
		49:34,
		50:35,
		51:36,
		52:37,
		53:38,
		54:39,
		55:40,
		56:41,
		57:42,
		48:43,
		189:44,
		187:45
	}

	// -- Add event listeners to detect keyup, keydown and touches, triggering other functions
	this.init = function() {
		var self = this;
		$(document).keydown(function(e) {self.keyDown(e.which)});
		$(document).keyup(function(e) {self.keyUp(e.which)});
		document.addEventListener('touchstart', function(e) {
			for (var i=0; i < e.changedTouches.length; i++) {
				var touch = e.changedTouches[i];
				self.touch(touch.pageX, touch.pageY);
			}
		});
	}

	// -- When keydown, send key value according to the mapped keys and generate audio, visuals, while sending to server
	this.keyDown = function(keycode) {
		if(this.keyMap[keycode] != null && keycode != this.lastKeyPress) {
			var keyValue = this.keyMap[keycode];
			this.lastKeyPress = keycode;
			server.addData(keyValue);
			audio.play(keyValue);
			visuals.generate(keyValue);
			if(this.isFirstKey) {
				$('body').addClass('started');
				this.isFirstKey = false;
			}
		}
	}

		// -- Prevent spam by not allowing to send keys by holding key down, until key is raised
		this.keyUp = function(keycode) {
			this.lastKeyPress = null;
		}

	// -- When touch, send key value according to the y position on window and generate audio, visuals, while sending to server
	this.touch = function(x, y) {
		var keyValue = 45-Math.floor(map(y, 0, windowHeight, 0, 45));
		this.lastKeyPress = keyValue;
		server.addData(keyValue);
		audio.play(keyValue);
		visuals.generate(keyValue);
		if(this.isFirstKey) {
			$('body').addClass('started');
			this.isFirstKey = false;
		}
	}
}
