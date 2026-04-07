import * as THREE from 'three';

/**
 * CameraTrail — emits small glowing particles behind camera movement
 */
export class CameraTrail {
  constructor(scene) {
    this.scene = scene;
    this.maxPoints = 60;
    this.points = [];
    this.lastPos = new THREE.Vector3();

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxPoints * 3);
    const colors = new Float32Array(this.maxPoints * 3);
    const alphas = new Float32Array(this.maxPoints);

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geo, this.mat);
    scene.add(this.mesh);
  }

  update(camera) {
    const pos = camera.position;
    const moved = pos.distanceTo(this.lastPos);

    if (moved > 0.3) {
      this.points.unshift({
        x: pos.x + (Math.random() - 0.5) * 0.4,
        y: pos.y + (Math.random() - 0.5) * 0.4,
        z: pos.z + (Math.random() - 0.5) * 0.4,
        life: 1.0,
      });
      if (this.points.length > this.maxPoints) this.points.pop();
      this.lastPos.copy(pos);
    }

    // Fade all points
    this.points.forEach(p => { p.life -= 0.018; });
    this.points = this.points.filter(p => p.life > 0);

    // Update geometry
    const positions = this.mesh.geometry.attributes.position.array;
    const colorsArr = this.mesh.geometry.attributes.color.array;

    for (let i = 0; i < this.maxPoints; i++) {
      const p = this.points[i];
      if (p) {
        positions[i * 3]     = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        const t = p.life;
        // Gradient: purple → teal → fade
        colorsArr[i * 3]     = 0.49 * t;
        colorsArr[i * 3 + 1] = 0.83 * t;
        colorsArr[i * 3 + 2] = 0.93 * t;
      } else {
        positions[i * 3] = positions[i * 3 + 1] = positions[i * 3 + 2] = 0;
        colorsArr[i * 3] = colorsArr[i * 3 + 1] = colorsArr[i * 3 + 2] = 0;
      }
    }

    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.color.needsUpdate = true;
  }
}
