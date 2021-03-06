var canvas,
	c,
	devicePixelRatio,
	container;

var points = [];

function draw() {
	var radiusX, radiusY, rotationAngle;
	/* hack to work around lack of orientationchange/resize event */
	if(canvas.height != window.innerHeight * devicePixelRatio) {
		resetCanvas();
	} else {
		c.clearRect(0,0,canvas.width, canvas.height);
	}
	c.strokeStyle = "#ccc";
	c.lineWidth = "1";

	for (var i = 0, l = points.length; i<l; i++) {
		rotationAngle = points[i].rotationAngle || 0;
		radiusX = points[i].radiusX || 40;
		radiusY = points[i].radiusY || 40;

		// add some pixels for better visibility
		radiusX += 1; //20->1
		radiusY += 1; //20->1

		/* draw all circles */
		c.beginPath();
		c.ellipse(points[i].clientX, points[i].clientY, radiusX, radiusY, rotationAngle * Math.PI/180, 0, Math.PI*2, true);
		c.stroke();

		// HUD (hacky)
		var hud_props = ['touch']; //, 'clientX: '+points[i].clientX+' clientY: '+points[i].clientY];
		if (points[i].radiusX && points[i].radiusY) {
		//	hud_props.push('radiusX: '+points[i].radiusX+' radiusY: '+points[i].radiusY);
		}
		if (points[i].rotationAngle) {
		//	hud_props.push('rotationAngle: '+points[i].rotationAngle);
		}
		if(points[i].radiusX > points[i].radiusY){
			hud_props.push('RIGHT finger');
		}else if(points[i].radiusX < points[i].radiusY){
			hud_props.push('LEFT finger');
		}

		//c.font = "30px Arial";
		//c.fillStyle = "#fff";
		// c.fillText(hud_props[0], points[i].clientX + radiusX + 20, points[i].clientY);
		c.fillStyle = "#fff";
		c.font = "30px Arial";
		for (var h_i = 1, h_j = hud_props.length; h_i<h_j; h_i++) {
			c.fillText(hud_props[h_i], points[i].clientX + radiusX + 20, points[i].clientY + (h_i + 1) * 12);
		}
	}
}

function positionHandler(e) {
	// stop scrolling etc
	e.preventDefault();

	points = [];
	// add in all entries from the array-like targetTouches
	for (var i = 0, l = e.targetTouches.length; i<l; i++) {
		points.push(e.targetTouches[i]);
	}
	window.requestAnimationFrame(draw);
}

function init() {
	canvas = document.createElement( 'canvas' );
	c = canvas.getContext( '2d' );
	container = document.createElement( 'div' );
	container.className = "container";
	resetCanvas();
	container.appendChild(canvas);
	document.body.appendChild( container );
	var events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
	for (var i=0, l=events.length; i<l; i++) {
		canvas.addEventListener(events[i],  positionHandler, false );
	}
	// suppress context menu
	canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); }, false)
}

function resetCanvas() {
    // HiDPI canvas adapted from http://www.html5rocks.com/en/tutorials/canvas/hidpi/
	devicePixelRatio = window.devicePixelRatio || 1;
	canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    c.scale(devicePixelRatio, devicePixelRatio);
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(init,100);
},false);