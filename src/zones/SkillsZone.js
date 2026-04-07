import * as THREE from 'three';

const SKILLS = [
  { name: 'Python',       color: 0x3572A5, level: 95 },
  { name: 'Django',       color: 0x092E20, level: 85 },
  { name: 'AWS',          color: 0xFF9900, level: 80 },
  { name: 'PostgreSQL',   color: 0x336791, level: 85 },
  { name: 'MongoDB',      color: 0x4DB33D, level: 80 },
  { name: 'Docker',       color: 0x2496ED, level: 75 },
  { name: 'Selenium',     color: 0x43B02A, level: 90 },
  { name: 'Pandas',       color: 0x150458, level: 85 },
  { name: 'TensorFlow',   color: 0xFF6F00, level: 70 },
  { name: 'ETL',          color: 0x7c6eed, level: 92 },
  { name: 'React',        color: 0x61DAFB, level: 70 },
  { name: 'Celery',       color: 0x37814A, level: 80 },
];

export class SkillsZone {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(-30, 2, 0);
    this.clickables = [];
    this.orbs = [];
    this._build();
    scene.add(this.group);
  }

  _build() {
    // Title
    this._makeLabel('SKILLS', 0, 9, 0, '#7c6eed', 1.8);

    // Central hub
    const hubGeo = new THREE.OctahedronGeometry(1.5, 0);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x7c6eed, emissive: 0x7c6eed, emissiveIntensity: 0.5,
      wireframe: false, roughness: 0.3
    });
    this.hub = new THREE.Mesh(hubGeo, hubMat);
    this.hub.position.y = 4;
    this.group.add(this.hub);

    // Orbit rings
    [5, 8, 11].forEach((r, i) => {
      const rGeo = new THREE.TorusGeometry(r, 0.05, 8, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x7c6eed, transparent: true, opacity: 0.15
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 4;
      this.group.add(ring);
    });

    // Place orbs on 3 orbit rings
    const radii = [5, 8, 11];
    SKILLS.forEach((skill, i) => {
      const ring = Math.floor(i / 4);
      const r = radii[ring] || 8;
      const angle = (i % 4) * (Math.PI / 2) + ring * 0.3;
      const orb = this._makeOrb(skill, r, angle, ring);
      this.orbs.push({ mesh: orb, skill, ring, startAngle: angle, r });
      this.clickables.push(orb);
    });
  }

  _makeOrb(skill, r, angle, ring) {
    const size = 0.5 + (skill.level / 100) * 0.5;
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: skill.color,
      emissive: skill.color,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.5,
    });
    const orb = new THREE.Mesh(geo, mat);
    orb.position.set(Math.cos(angle) * r, 4, Math.sin(angle) * r);
    orb.userData.label = `${skill.name} — ${skill.level}%`;
    orb.userData.data = `
      <h2>${skill.name}</h2>
      <h3>Proficiency</h3>
      <div style="background:rgba(255,255,255,0.05);border-radius:4px;height:6px;margin:8px 0 16px;">
        <div style="height:100%;width:${skill.level}%;background:linear-gradient(90deg,#7c6eed,#1dd4a0);border-radius:4px;"></div>
      </div>
      <p style="color:#1dd4a0;font-size:20px;font-weight:700;">${skill.level}%</p>
    `;
    orb.userData.cameraTarget = new THREE.Vector3(-30 + Math.cos(angle) * r, 4, Math.sin(angle) * r);
    orb.userData.cameraPos = new THREE.Vector3(-30 + Math.cos(angle) * r, 8, Math.sin(angle) * r + 10);

    // Label sprite above orb
    const label = this._makeSmallLabel(skill.name, skill.color);
    label.position.set(Math.cos(angle) * r, 5.2 + size, Math.sin(angle) * r);
    this.group.add(label);
    orb.userData.labelSprite = label;

    this.group.add(orb);
    return orb;
  }

  _makeSmallLabel(text, color) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 64);
    ctx.font = 'bold 28px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#' + color.toString(16).padStart(6, '0');
    ctx.shadowBlur = 12;
    ctx.fillText(text, 128, 32);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3, 0.8, 1);
    return sprite;
  }

  _makeLabel(text, x, y, z, color, size) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = `bold 72px Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillText(text, 256, 64);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(size * 5, size * 1.2, 1);
    this.group.add(sprite);
  }

  update(t) {
    if (this.hub) {
      this.hub.rotation.y = t * 0.5;
      this.hub.rotation.x = t * 0.3;
      this.hub.position.y = 4 + Math.sin(t * 0.7) * 0.2;
    }
    this.orbs.forEach(({ mesh, ring, startAngle, r }, i) => {
      const speed = [0.3, 0.2, 0.15][ring] || 0.2;
      const angle = startAngle + t * speed;
      mesh.position.x = Math.cos(angle) * r;
      mesh.position.z = Math.sin(angle) * r;
      mesh.position.y = 4 + Math.sin(t * 0.5 + i) * 0.3;
      mesh.rotation.y = t * 0.5;
      if (mesh.userData.labelSprite) {
        mesh.userData.labelSprite.position.copy(mesh.position);
        mesh.userData.labelSprite.position.y += 1.2;
      }
    });
  }
}
