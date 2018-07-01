function TorusKnotShape(numberz){

	var material = new THREE.MeshPhongMaterial({color:0x0, specular:0x0, shading:THREE.FlatShading, side:THREE.DoubleSide});
  material.shininess = 100;
  material.shading = THREE.FlatShading;

	this.hue = numberz[1];
  this.specHue = numberz[2];
  this.sat = numberz[2];
  this.sat2 = numberz[3]


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

		material.color.setHSL(this.hue, 0.5 - numberz[10] * 0.5, 0.3)
		material.specular.setHSL(this.specHue, 0.5 - numberz[10] * 0.6, 0.5)
}
