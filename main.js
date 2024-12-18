import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const gui = new GUI({
  width: 300,
  title: "Nice debug UI",
  closeFolders: true,
});
gui.close();
const debugObject = {};
debugObject.color = "#3aa65b";

// Canvas
const canvas = document.querySelector("#c");

// Scene
const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onProgress = () => {
  console.log("loading progressing");
};
loadingManager.onError = () => {
  console.log("loading error");
};

const colorTexture = textureLoader.load("static/textures/door/color.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.minFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;
colorTexture.magFilter = THREE.NearestFilter;
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("textures/matcaps/6.png");
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// Text Loader
const fontLoader = new FontLoader();
fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Cailyn is dumb", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.center();
  scene.add(text);
});

for (let i = 0; i < 100; i++) {
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  scene.add(donut);
}

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Object
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// // const geometry = new THREE.SphereGeometry(1, 32, 32);
// // const material = new THREE.MeshBasicMaterial({
// //   color: debugObject.color,
// //   wireframe: true,
// // });
// const material = new THREE.MeshBasicMaterial({ map: colorTexture });
// const mesh = new THREE.Mesh(geometry, material);
// const material = new THREE.MeshBasicMaterial({ map: colorTexture });
// material.color = new THREE.Color("#ff0000");
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

// Clearcoat
material.clearcoat = 1;
material.clearcoatRoughness = 0;

gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// Iridescence
material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];

gui.add(material, "iridescence").min(0).max(1).step(0.0001);
gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001);
gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

// Transmission
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
// sphere.position.x = -1.5;

// const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 16, 32),
//   material
// );
// torus.position.x = 1.5;

// scene.add(sphere, box, torus);

// scene.add(mesh);
// const cubeTweaks = gui.addFolder("Awesome cube");
// // cubeTweaks.close();
// cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
// cubeTweaks.add(mesh, "visible");
// cubeTweaks.add(material, "wireframe");
// cubeTweaks.addColor(debugObject, "color").onChange((value) => {
//   material.color.set(debugObject.color);
// });
// debugObject.spin = () => {
//   gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
// };
// cubeTweaks.add(debugObject, "spin");
// debugObject.subdivision = 2;
// cubeTweaks
//   .add(debugObject, "subdivision")
//   .min(1)
//   .max(20)
//   .step(1)
//   .onFinishChange(() => {
//     mesh.geometry.dispose();
//     mesh.geometry = new THREE.BoxGeometry(
//       1,
//       1,
//       1,
//       debugObject.subdivision,
//       debugObject.subdivision,
//       debugObject.subdivision
//     );
//   });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
/**
 * Renderer and animate
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);

  console.log(cursor.x, cursor.y);
});

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   mesh.position.x = Math.cos(elapsedTime);
  //   mesh.position.y = Math.sin(elapsedTime);
  //   camera.lookAt(mesh.position);
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  //   camera.position.y = cursor.y * 3;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
