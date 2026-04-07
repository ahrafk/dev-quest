import * as THREE from 'three';

export function createIsland(scene) {
  // ─── MAIN ISLAND BODY ───
  const islandGeo = new THREE.CylinderGeometry(28, 18, 5, 8, 3);
  const islandMat = new THREE.MeshStandardMaterial({
    color: 0x1a2a3a,
    roughness: 0.85,
    metalness: 0.15,
  });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = -3;
  island.receiveShadow = true;
  scene.add(island);

  // ─── TOP SURFACE ───
  const topGeo = new THREE.CylinderGeometry(28, 28, 0.5, 8);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x0d1f2d,
    roughness: 0.7,
    metalness: 0.3,
  });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = -0.5;
  scene.add(top);

  // ─── GLOWING GRID ON TOP ───
  const gridHelper = new THREE.GridHelper(56, 14, 0x1a3a5a, 0x0d2030);
  gridHelper.position.y = -0.2;
  scene.add(gridHelper);

  // ─── GLOWING EDGE RING ───
  const ringGeo = new THREE.TorusGeometry(28, 0.2, 8, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x7c6eed,
    emissive: 0x7c6eed,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.2;
  scene.add(ring);

  // ─── SECONDARY RING ───
  const ring2Geo = new THREE.TorusGeometry(14, 0.1, 8, 64);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0x1dd4a0,
    emissive: 0x1dd4a0,
    emissiveIntensity: 0.6,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = -0.15;
  scene.add(ring2);

  // ─── BOTTOM STALACTITES ───
  for (let i = 0; i < 12; i++) {
    const h = 2 + Math.random() * 8;
    const r = 0.3 + Math.random() * 1.2;
    const geo = new THREE.ConeGeometry(r, h, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.6, 0.3, 0.08 + Math.random() * 0.1),
      roughness: 0.9,
    });
    const cone = new THREE.Mesh(geo, mat);
    const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 4 + Math.random() * 20;
    cone.position.set(
      Math.cos(angle) * dist,
      -5 - h / 2,
      Math.sin(angle) * dist
    );
    cone.rotation.z = Math.PI;
    cone.rotation.y = Math.random() * Math.PI;
    scene.add(cone);
  }

  // ─── FLOATING PARTICLES ABOVE ISLAND ───
  const partCount = 300;
  const partGeo = new THREE.BufferGeometry();
  const partPos = new Float32Array(partCount * 3);
  const partColors = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 25;
    partPos[i * 3]     = Math.cos(angle) * r;
    partPos[i * 3 + 1] = Math.random() * 10;
    partPos[i * 3 + 2] = Math.sin(angle) * r;
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      partColors[i * 3] = 0.49; partColors[i * 3 + 1] = 0.43; partColors[i * 3 + 2] = 0.93;
    } else if (colorChoice < 0.66) {
      partColors[i * 3] = 0.11; partColors[i * 3 + 1] = 0.83; partColors[i * 3 + 2] = 0.63;
    } else {
      partColors[i * 3] = 0.94; partColors[i * 3 + 1] = 0.42; partColors[i * 3 + 2] = 0.25;
    }
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  partGeo.setAttribute('color', new THREE.BufferAttribute(partColors, 3));

  const partMat = new THREE.PointsMaterial({
    size: 0.2, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true
  });
  scene.add(new THREE.Points(partGeo, partMat));
}
