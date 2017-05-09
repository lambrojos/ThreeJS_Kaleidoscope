function TorusKnotShape(numberz){



	var material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
	// material.color.setHSL(1.0,0.5,0.5);
	// material.specular.setHSL(0.5,1.0,0.1);
	material.shininess = 30;

	// this.hue = Math.random();
	// this.specHue = Math.random();
	// this.sat = Math.random();
	// this.sat2 = Math.random();
	//
	console.log(numberz[0], 'HUEHUE');
	this.hue = numberz[0];
  this.specHue = numberz[1];
  this.sat = numberz[2];
  this.sat2 = numberz[3]

	var hueSpeed = (Math.random() * 10) / 10000;
	var specHueSpeed = (Math.random() * 10) / 10000;

	var torus = {radius:1, tubeSize:0.5, tubularSegments:50, radialSegments:30, p:4, q:16};
	var torusGeo = new THREE.TorusKnotGeometry( torus.radius, torus.tubeSize, torus.tubularSegments, torus.radialSegments, torus.p, torus.q );

	this.mesh = new THREE.Mesh(torusGeo, material);
	this.mesh.rotation.x = numberz[4] * Math.PI*2;
	this.mesh.rotation.y = numberz[5] * Math.PI*2;
	this.mesh.rotation.z = numberz[6] * Math.PI*2;

	var rotSpeedX = Math.random() / 400;
	var rotSpeedY = Math.random() / 400;
	var rotSpeedZ = Math.random() / 400;

	if (Math.random() > 0.5) {rotSpeedX = -rotSpeedX};
	if (Math.random() > 0.5) {rotSpeedY = -rotSpeedX};
	if (Math.random() > 0.5) {rotSpeedZ = -rotSpeedX};

	var oscX = numberz[10] * Math.PI*2;
	var oscY = numberz[11] * Math.PI*2;
	var oscZ = numberz[12] * Math.PI*2;
  //
	var oscXSpeed = numberz[13] * 0.003;
	var oscYSpeed = numberz[14] * 0.003;
	var oscZSpeed = numberz[15] * 0.003;

	this.update = function()
	{
		// this.updatePosition();
		// this.updateColor();
	}

	this.updatePosition = function(){

    console.log(this.mesh.rotation.x);
		// this.mesh.rotation.x += rotSpeedX * speed;
		// this.mesh.rotation.y += rotSpeedY * speed;
		// // this.mesh.rotation.z += rotSpeedZ * speed;
    //
		// oscX += oscXSpeed * speed;
		// oscY += oscYSpeed * speed;
		// oscZ += oscZSpeed * speed;
    //
		// this.mesh.position.x = Math.cos(oscX) * 1;
		// this.mesh.position.y = Math.sin(oscY) * 1;
		// this.mesh.position.z = Math.sin(oscZ) * 1;
	}

	this.updateColor = function()
	{

		material.color.setHSL(this.hue, 0.5 - numberz[10] * 0.5, 0.3)

		material.specular.setHSL(this.specHue, 0.5 - numberz[10] * 0.6, 0.5)
	}

  this.updateColor();
  this.updatePosition();

	// this.randomizeColor = function()
	// {
	// 	this.hue = Math.random();
	// 	this.specHue = Math.random();
	// 	this.sat = Math.random();
	// 	this.sat2 = Math.random();
  //
	// 	this.updateColor();
	// }
}
