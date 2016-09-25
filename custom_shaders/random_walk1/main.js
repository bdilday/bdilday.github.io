
var time_start = Date.now();
var container;
var camera, scene, renderer;
var mesh;
var geometry;
var segments = 100000;
var timeResolution = 5; // changes per second
var positions, colors;
var idx = 0;

init();
animate();
function init() {
    container = document.getElementById( 'container' );
    //
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 12000 );
    camera.position.z = 120;
    scene = new THREE.Scene();

    controls = new THREE.OrbitControls(camera);

    geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    positions = new Float32Array( segments * 3 );
    colors = new Float32Array( segments * 3 );
    var r = 800;
    for ( var i = 0; i < segments; i ++ ) {
        var x = 0;//Math.random() * r - r / 2;
        var y = 0;//Math.random() * r - r / 2;
        var z = 0;//Math.random() * r - r / 2;
        // positions
        positions[ i * 3 ] = x;
        positions[ i * 3 + 1 ] = y;
        positions[ i * 3 + 2 ] = z;
        // colors
        colors[ i * 3 ] = ( x / r ) + 0.5;
        colors[ i * 3 + 1 ] = ( y / r ) + 0.5;
        colors[ i * 3 + 2 ] = ( z / r ) + 0.5;
    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    mesh = new THREE.Line( geometry, material );
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    //
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
    controls.update();
}

function render() {
    var time = (Date.now() - time_start) * 0.001;

    var p = geometry.attributes.position;
    if (idx<3) {
        console.log('p', p, geometry);
        console.log(idx % 100);
    }
    var perturb = 0.5;
    idx += 1;

    var k = idx % timeResolution;
    if (k == 0) {
        var j = parseInt(idx/timeResolution);

        var vx = perturb * (2 * Math.random() - 1);
        var vy = perturb * (2 * Math.random() - 1);
        var vz = perturb * (2 * Math.random() - 1);

        var v = new THREE.Vector3(vx, vy, vz);
        v.normalize();

        var p0 = new THREE.Vector3(positions[j], positions[j+1], positions[j+2]);
        for ( var i = 0; i < segments; i ++ ) {

            if (i>=j) {

                positions[i * 3] = p0.x + v.x;
                positions[i * 3 + 1] = p0.y + v.y;
                positions[i * 3 + 2] = p0.z + v.z;

                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 0;
            } else {
                colors[i * 3] = 0.1
                colors[i * 3 + 1] = 0.1;
                colors[i * 3 + 2] = 0.1;

            }

        }

    }

    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;


    //mesh.rotation.x = time * 0.25;
    //mesh.rotation.y = time * 0.5;
    renderer.render( scene, camera );
}
