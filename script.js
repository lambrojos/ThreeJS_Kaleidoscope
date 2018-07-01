var bufferSize = 1024
var bufferWidth = bufferSize
var bufferHeight = bufferSize
var gui = new dat.GUI()
var showTexture = false
var speed = 0.5
var saturation = 1.
var lightness = 1.0
var shapeZoom = 2.2
var renderer = null


function webgl_support() {
  try{
    var canvas = document.createElement( 'canvas' );
    return !! window.WebGLRenderingContext && (
         canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
  } catch( e ) { return false; }
};


if(! webgl_support()){
    alert('No webgl support')
}

new Fingerprint2().get(initScene)

function takeScreenshot() {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = renderer.domElement.toDataURL();
  a.download = 'fingerprint.png'
  a.click();
}

// the hash is a murmur hash in hex format
function initScene(hash){
  const brandTag = document.getElementById("brandTag")
  brandTag.onclick = takeScreenshot
  brandTag.innerHTML = hash;

  // so we can have 16 255 bytes values to play with!
  var numberz = hash
    .match(/.{1,2}/g)
    .map(function(val){ return parseInt(val, 16) / 255 })

  var scene = new THREE.Scene()
	var bufferCamera = new THREE.PerspectiveCamera(75, bufferWidth / bufferHeight, 0.1, 1000)
  bufferCamera.position.z = shapeZoom

	var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 )
  camera.position.z = 5
	camera.zoom = 0.2
  gui.add(camera, 'zoom', 0.2, 0.9).onFinishChange(render);
	camera.updateProjectionMatrix()

	renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

  var bufferScene = new THREE.Scene()
  var bufferTexture = new THREE.WebGLRenderTarget( bufferWidth, bufferHeight, { minFilter: THREE.LinearMipMapLinearFilter, magFilter: THREE.LinearFilter, antialias: true})
  var axes = [4, 6, 8, 12, 16, 18, 20, 24, 28, 30, 32, 36]

  numAxes = axes[3]

  var allShapes = []
  var numShapes = 10

  var complexity = Math.ceil(numberz[9] * 5) || 1

  function createShapes() {
    for (var i=0; i<numShapes; i++)
    {
      var shape = new TorusKnotShape(numberz)
      bufferScene.add(shape.mesh)
      allShapes[i] = shape

      if (i < complexity) {
        shape.mesh.visible = true
      } else {
        shape.mesh.visible = false
      }
    }
  }
  createShapes()


  var ambientLight = new THREE.AmbientLight(0x808080)
  bufferScene.add(ambientLight)

  var pointLight = new THREE.DirectionalLight(0xaaaaaa)
  pointLight.position.set(0,50,100)
  bufferScene.add(pointLight)

  var pointLight = new THREE.DirectionalLight(0x404040)
  pointLight.position.set(0,50,-100)
  bufferScene.add(pointLight)

  var ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // main object
  var tileHolder
  var tileMat = new THREE.MeshBasicMaterial({map:bufferTexture, side:THREE.DoubleSide})


  function updateGridGeometry()
  {
    scene.remove(tileHolder)
    tileHolder = new THREE.Object3D()

    var theta = 0
    var numSteps = numAxes
    var step = 2*Math.PI / numSteps
    var radius = 1

    var tileGeometry = new THREE.Geometry()
    tileGeometry.vertices.push(new THREE.Vector3(0,0,0))

    var snapStep // number of steps between simplified shape vertices
    var stepAngle
    var rotOffset

    // compute tile width
    var p1 = new THREE.Vector2(radius*Math.cos(0), radius*Math.sin(0))
    var p2 = new THREE.Vector2(radius*Math.cos(stepAngle), radius*Math.sin(stepAngle))
    var dist = p1.distanceTo(p2)
    var a = dist / 2
    var c = radius
    var b = Math.sqrt(c*c - a*a)
    var tileWidth
    var tileHeight
    var tileRowOffset


    // find out if numAxes is factor of 4 or 6
    if ( !(numAxes % 6) )
    {
      // factor of 6
      snapStep = numAxes/6
      stepAngle = (2*Math.PI) / 6
      rotOffset = stepAngle / 2

      tileWidth = b*2
      tileHeight = c + a
      tileRowOffset = b
    }
    else
    {
      // factor of 4
      snapStep = numAxes/4
      stepAngle = (2*Math.PI) / 4
      rotOffset = 0

      tileWidth = c * 2
      tileHeight = c
      tileRowOffset = c
    }


    // add vertices
    for (var i=0; i<numSteps; i++)
    {
      var mod = i % snapStep
      var ratio = mod / snapStep
      var position = Math.floor(i/snapStep)
      var angle1 = stepAngle * position
      var angle2 = stepAngle * (position+1)
      var x, y

      if (mod == 0)
      {
        // standard vertex position
        x = radius * Math.cos(theta)
        y = radius * Math.sin(theta)
      }
      else
      {
        // interpolate between angle1 and angle2
          var x1 = radius * Math.cos(angle1)
          var y1 = radius * Math.sin(angle1)

          var x2 = radius * Math.cos(angle2)
          var y2 = radius * Math.sin(angle2)

          x = x1 + ( (x2-x1) * ratio )
          y = y1 + ( (y2-y1) * ratio )
			}

			tileGeometry.vertices.push(new THREE.Vector3(x ,y ,0))
			theta += step
		}

		// add faces
		for (var i=0; i<numSteps; i++)
		{
			var v1 = i+1
			var v2 = i+2
			if (v2 > numSteps) v2 = 1
			tileGeometry.faces.push( new THREE.Face3( 0, v1, v2 ) )
		}


		tileGeometry.computeBoundingSphere()
		tileGeometry.computeBoundingBox()


		// set UV mapping
		tileGeometry.faceVertexUvs[0] = []

		var mapWidth = 1/snapStep
		var diff = 1 - mapWidth
		var mapLeft = diff/2
		var mapRight = 1 - diff/2

		for (i = 0; i < tileGeometry.faces.length;  i++)
		{
			if (i%2)
			{
				tileGeometry.faceVertexUvs[0].push([
					new THREE.Vector2( 0.5,  0),
					new THREE.Vector2( mapLeft, 1),
					new THREE.Vector2(  mapRight, 1)
				])
			}
			else
			{
				tileGeometry.faceVertexUvs[0].push([
					new THREE.Vector2( 0.5,  0),
					new THREE.Vector2( mapRight, 1),
					new THREE.Vector2(  mapLeft, 1)
				])
			}
		}

		tileGeometry.uvsNeedUpdate = true


		var tileRow = new THREE.Object3D()
		tileHolder.add(tileRow)

		var scale = bufferSize/3

		var tileMesh = new THREE.Mesh(tileGeometry, tileMat)
		tileMesh.scale.set( scale, scale, 1 )
		tileMesh.rotation.z = rotOffset
		tileRow.add(tileMesh)

		var tileCountX = 15
		for (var i=0; i<tileCountX; i++)
		{
			var tileMeshLeft = tileMesh.clone()
			tileMeshLeft.position.x -= (tileWidth * scale) * (i+1)
			tileRow.add(tileMeshLeft)

			var tileMeshRight = tileMesh.clone()
			tileMeshRight.position.x += (tileWidth * scale) * (i+1)
			tileRow.add(tileMeshRight)
		}

		var tileCountY = 10
		for (var i=0; i<tileCountY; i++)
		{
			var tileRowTop = tileRow.clone()
			tileRowTop.position.y += tileHeight * scale * (i+1)
			if (!(i%2)) tileRowTop.position.x += tileRowOffset * scale
			tileHolder.add(tileRowTop)

			var tileRowBottom = tileRow.clone()
			tileRowBottom.position.y -= tileHeight * scale * (i+1)
			if (!(i%2)) tileRowBottom.position.x += tileRowOffset * scale
			tileHolder.add(tileRowBottom)
		}

		scene.add(tileHolder)
	}

	updateGridGeometry()

	var planeMat = new THREE.MeshBasicMaterial({map:bufferTexture, side:THREE.DoubleSide})
	var planeGeo = new THREE.PlaneGeometry(bufferWidth/2, bufferHeight/2)
	var planeObj = new THREE.Mesh(planeGeo, planeMat)
	scene.add(planeObj)
	planeObj.visible = false

  function render () {
    camera.updateProjectionMatrix()
    renderer.render(bufferScene, bufferCamera, bufferTexture)
    renderer.render(scene, camera)
  }
  render()
}
