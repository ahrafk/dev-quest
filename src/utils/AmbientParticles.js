import * as THREE from 'three';

/**
 * AmbientParticles — slow-drifting motes across the whole scene
 */
export class AmbientParticles {
  constructor(scene, count = 500) {
    this.scene = scene;
    this.count = count;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      [0.49, 0.43, 0.93],  // purple
      [0.11, 0.83, 0.63],  // teal
      [0.94, 0.42, 0.25],  // orange
      [0.22, 0.54, 0.87],  // blue
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i * 3]     = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = Math.random() * 0.012 + 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.velocities = velocities;

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geo, mat);
    scene.add(this.mesh);
  }

  update() {
    const pos = this.mesh.geometry.attributes.position;
    const vel = this.velocities;
    for (let i = 0; i < this.count; i++) {
      let x = pos.getX(i) + vel[i * 3];
      let y = pos.getY(i) + vel[i * 3 + 1];
      let z = pos.getZ(i) + vel[i * 3 + 2];
      if (y > 22) y = 0;
      if (Math.abs(x) > 30) vel[i * 3] *= -1;
      if (Math.abs(z) > 30) vel[i * 3 + 2] *= -1;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}
