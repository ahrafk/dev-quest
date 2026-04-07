import * as THREE from 'three';

export function createSky(scene) {
  // ─── STARS ───
  const starCount = 3000;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const r = 200 + Math.random() * 300;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    colors[i * 3]     = 0.7 + t * 0.3;
    colors[i * 3 + 1] = 0.7 + t * 0.1;
    colors[i * 3 + 2] = 0.9 + t * 0.1;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  scene.add(new THREE.Points(starGeo, starMat));

  // ─── LARGE GLOWING STARS ───
  const bigStarGeo = new THREE.BufferGeometry();
  const bigPos = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i++) {
    bigPos[i * 3]     = (Math.random() - 0.5) * 600;
    bigPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
    bigPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
  }
  bigStarGeo.setAttribute('position', new THREE.BufferAttribute(bigPos, 3));
  const bigStarMat = new THREE.PointsMaterial({
    size: 1.5, color: 0xaaaaff, transparent: true, opacity: 0.7, sizeAttenuation: true
  });
  scene.add(new THREE.Points(bigStarGeo, bigStarMat));

  // ─── FLOATING ROCKS ───
  for (let i = 0; i < 18; i++) {
    const size = 0.5 + Math.random() * 2;
    const geo = new THREE.DodecahedronGeometry(size, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.3, 0.15),
      roughness: 0.9, metalness: 0.1,
    });
    const rock = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const dist = 45 + Math.random() * 40;
    rock.position.set(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 20 + 5,
      Math.sin(angle) * dist
    );
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.userData.floatSpeed = 0.2 + Math.random() * 0.4;
    rock.userData.floatOffset = Math.random() * Math.PI * 2;
    rock.userData.rotSpeed = (Math.random() - 0.5) * 0.01;
    scene.add(rock);
    scene.userData.rocks = scene.userData.rocks || [];
    scene.userData.rocks.push(rock);
  }
}
