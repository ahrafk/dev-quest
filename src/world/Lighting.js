import * as THREE from 'three';

export function setupLighting(scene) {
  const ambient = new THREE.AmbientLight(0x111122, 1.5);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 60, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 200;
  sun.shadow.camera.left = -60;
  sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60;
  sun.shadow.camera.bottom = -60;
  scene.add(sun);

  // Purple glow from below
  const purpleLight = new THREE.PointLight(0x7c6eed, 3, 80);
  purpleLight.position.set(0, -10, 0);
  scene.add(purpleLight);

  // Teal accent from front
  const tealLight = new THREE.PointLight(0x1dd4a0, 2, 60);
  tealLight.position.set(0, 15, 30);
  scene.add(tealLight);

  // Orange warm light from side
  const warmLight = new THREE.PointLight(0xf06a3f, 1.5, 50);
  warmLight.position.set(-30, 10, -10);
  scene.add(warmLight);

  // Hemisphere
  const hemi = new THREE.HemisphereLight(0x0a0a2a, 0x050510, 1.0);
  scene.add(hemi);
}
