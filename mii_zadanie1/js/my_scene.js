var container;
var camera, scene, renderer, loader;
var width, height;
var sphere;
var bounds = new Array(3);
var videoTexture;
var roomBounds = {
	floorY:0,
	wall1X:-10,
	wall2X:10
}
var gravityForce = 0.005;
var bounceDumping = 0.95;


//Tworzenie sceny

function init(){
    container = document.getElementById("div_webgl");
	width = container.offsetWidth;
	height = container.offsetHeight;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, width / height, 1, 1000 );
	camera.position.z = 18;
	camera.position.y = 10;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);
	loader = new THREE.TextureLoader();
    
	//...
	// Tu nale�y skonstruowa� obiekty i doda� je do sceny 
	//...
	var light = new THREE.PointLight(0xffffff, 1, 100);
	light.position.set(50, 50, 50);
	scene.add(light);

	

	
	loader.load("name.jpg", function(texture){
		var geo = new THREE.SphereGeometry(1,32,32);
		sphere = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({map:texture}));		
		scene.add(sphere);

		sphere.rotation_speed = 0.5;
		sphere.velocityScale = 0.005;
		sphere.velocity = {x:-1,y:0,z:0};
		sphere.position.y = 5;
		sphere.frameTime = Date.now();
		
	},undefined,function(err){console.log("loader error")});


	var geo = new THREE.BoxGeometry(0.1, 20, 10);
	bounds[0] = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xAAFFAA}));
	bounds[0].position.x = roomBounds.wall1X;
	bounds[0].position.y = 10;
	bounds[1] = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xAAFFAA}));
	bounds[1].position.x = roomBounds.wall2X;
	bounds[1].position.y = 10;
	geo = new THREE.BoxGeometry(20,0.1,10);
	bounds[2] = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xAAAAFF}));
	bounds[2].position.y = roomBounds.floorY;
	console.log(bounds);
	for(var i = 0; i < 3; i++){
		scene.add(bounds[i]);
	}
	
	
	window.addEventListener("resize",onWindowResize);
	physics();	
}



//Rysowanie
function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(physics);
}

function physics() {
	if(sphere != undefined){
		sphere.rotation.x = Date.now()/1000*sphere.rotation_speed;
		sphere.rotation.y = Date.now()/1000*sphere.rotation_speed;
		sphere.position.x += sphere.velocity.x*(Date.now()-sphere.frameTime)*sphere.velocityScale;
		sphere.position.y += sphere.velocity.y*(Date.now()-sphere.frameTime)*sphere.velocityScale;
		sphere.position.z += sphere.velocity.z*(Date.now()-sphere.frameTime)*sphere.velocityScale;
		if(sphere.position.x-1 < roomBounds.wall1X || sphere.position.x+1 > roomBounds.wall2X) {
			sphere.velocity.x *= -bounceDumping;
			sphere.position.x += sphere.velocity.x*(Date.now()-sphere.frameTime)*sphere.velocityScale; //bonus translation to avoid getting stuck in a wall
		}
		if(sphere.position.y-1 < roomBounds.floorY) {
			sphere.position.y = roomBounds.floorY+1;
			sphere.velocity.y *= -bounceDumping;
			sphere.position.y += sphere.velocity.y*(Date.now()-sphere.frameTime)*sphere.velocityScale;
		}
	
		sphere.velocity.y -= (Date.now()-sphere.frameTime) * gravityForce; 
	
		
		sphere.frameTime=Date.now();
		}
	render();
}

//Zmiana rozmiaru
function onWindowResize() {
    width = document.getElementById("div_webgl").offsetWidth;
    height = document.getElementById("div_webgl").offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
