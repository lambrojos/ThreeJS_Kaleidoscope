function TorusKnotShape(numberz){

	var material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
	material.shininess = 30;

	this.hue = numberz[1];
  this.specHue = numberz[2];
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
	}

	this.updatePosition = function(){

    console.log(this.mesh.rotation.x);
	}

	this.updateColor = function()
	{

		material.color.setHSL(this.hue, 0.5 - numberz[10] * 0.5, 0.3)

		material.specular.setHSL(this.specHue, 0.5 - numberz[10] * 0.6, 0.5)
	}

  this.updateColor();
  this.updatePosition();
}
