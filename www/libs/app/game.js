/* jshint
 esnext: true
 */

(function () {
  "use strict";

  const THREE = window.THREE,
    webvrui = window.webvrui,
    uiOptions = {
      color: 'black',
      background: 'white',
      corners: 'square'
    };

  let vrDisplay,
    vrButton,
    scene,
    camera,
    controls,
    effect,
    cube;

  function populate(scene) {
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10),
      cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x5555ff
      }),
      ambLight = new THREE.AmbientLight(0xffffff, 0.25),
      ptLight = new THREE.PointLight(0xffffff, 1),
      planeGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100),
      planeMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xff0000
      }),
      plane = new THREE.Mesh(planeGeometry, planeMaterial);

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, controls.userHeight, -25);

    plane.rotation.x = -90 * Math.PI / 180;
    plane.position.y = -100;

    scene.add(ambLight);
    scene.add(ptLight);
    scene.add(plane);
    scene.add(cube);
  }

  function setupUi(parentEl) {
    vrButton = new webvrui.EnterVRButton(parentEl, uiOptions);
    vrButton.on('exit', function () {
      camera.quaternion.set(0, 0, 0, 1);
      camera.position.set(0, controls.userHeight, 0);
    });
    vrButton.on('hide', function () {
      document.getElementById('ui').style.display = 'none';
    });
    vrButton.on('show', function () {
      document.getElementById('ui').style.display = 'inherit';
    });
    document.getElementById('vr-button').appendChild(vrButton.domElement);
    document.getElementById('magic-window').addEventListener('click', function () {
      vrButton.requestEnterFullscreen();
    });
  }

  function render() {
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    if (vrButton.isPresenting()) {
      controls.update();
    }
    effect.render(scene, camera);
    vrDisplay.requestAnimationFrame(render);
  }

  function initialise() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true
      }),
      aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
    // Apply VR stereo rendering to renderer.
    effect = new THREE.VREffect(renderer);
    scene = new THREE.Scene();
    controls = new THREE.VRControls(camera);
    controls.standing = true;
    camera.position.y = controls.userHeight;
    effect.setSize(window.innerWidth / window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    populate(scene);

    document.body.appendChild(renderer.domElement);

    function onResize() {
      effect.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    setupUi(renderer.domElement);

    navigator.getVRDisplays().then(function (displays) {
      if (displays.length > 0) {
        vrDisplay = displays[0];
        vrDisplay.requestAnimationFrame(render);
      } else {
        window.console.log("Error: no usable displays found.");
      }
    });

    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);
  }

  window.addEventListener("load", initialise);

}());
