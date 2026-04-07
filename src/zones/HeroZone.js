import * as THREE from 'three';

export class HeroZone {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.clickables = [];
    this.time = 0;
    this._build();
    scene.add(this.group);
  }

  _build() {
    // ─── CENTRAL GLOWING SPHERE ───
    const coreGeo = new THREE.SphereGeometry(3, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7c6eed,
      emissive: 0x7c6eed,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    this.core.position.set(0, 4, 0);
    this.group.add(this.core);

    // Inner wireframe
    const wireGeo = new THREE.IcosahedronGeometry(3.1, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x7c6eed, wireframe: true, transparent: true, opacity: 0.3 });
    this.wire = new THREE.Mesh(wireGeo, wireMat);
    this.wire.position.copy(this.core.position);
    this.group.add(this.wire);

    // ─── ORBIT RINGS ───
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(4.5 + i * 1.2, 0.04, 8, 80);
      const rMat = new THREE.MeshStandardMaterial({
        color: [0x7c6eed, 0x1dd4a0, 0xf06a3f][i],
        emissive: [0x7c6eed, 0x1dd4a0, 0xf06a3f][i],
        emissiveIntensity: 0.5,
      });
      const orbitRing = new THREE.Mesh(rGeo, rMat);
      orbitRing.position.copy(this.core.position);
      orbitRing.rotation.x = Math.PI / 2 + i * 0.4;
      orbitRing.rotation.y = i * 0.6;
      orbitRing.userData.orbitSpeed = 0.4 + i * 0.2;
      orbitRing.userData.orbitAxis = ['y', 'x', 'z'][i];
      this.group.add(orbitRing);
      this.orbitRings = this.orbitRings || [];
      this.orbitRings.push(orbitRing);

      // Small dot on each ring
      const dotGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const dotMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.userData.ring = orbitRing;
      dot.userData.radius = 4.5 + i * 1.2;
      this.group.add(dot);
      this.orbitDots = this.orbitDots || [];
      this.orbitDots.push(dot);
    }

    // ─── FLOATING TITLE SPRITE ───
    this._makeTextSprite('AHRAF KHATRI', 0, 9, 0, 2.2, '#ffffff');
    this._makeTextSprite('Data Engineer · Software Developer', 0, 7.2, 0, 1.1, '#1dd4a0');
    this._makeTextSprite('Mumbai, India · 5+ Years Experience', 0, 5.8, 0, 0.9, '#8888aa');

    // ─── CLICKABLE INFO BALL ───
    const infoBall = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1dd4a0, emissive: 0x1dd4a0, emissiveIntensity: 0.4, roughness: 0.3 })
    );
    infoBall.position.set(0, 1, 0);
    infoBall.userData.label = 'View Profile';
    infoBall.userData.data = this._profileHTML();
    infoBall.userData.cameraTarget = new THREE.Vector3(0, 4, 0);
    infoBall.userData.cameraPos = new THREE.Vector3(0, 12, 30);
    this.group.add(infoBall);
    this.clickables.push(infoBall);
    this.infoBall = infoBall;
  }

  _makeTextSprite(text, x, y, z, scale, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 128);
    const fontSize = scale > 1.5 ? 80 : scale > 1 ? 60 : 48;
    ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillText(text, 512, 64);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(scale * 10, scale * 1.5, 1);
    this.group.add(sprite);
  }

  _profileHTML() {
    return `
      <h2>Ahraf Khatri</h2>
      <p>Goal-oriented Software Developer & Data Engineer with 5+ years of experience based in Mumbai, India.</p>
      <h3>Contact</h3>
      <p>📧 ahraf.khatri7@gmail.com</p>
      <p>📱 84520 72382</p>
      <p>📍 Mumbai, Maharashtra</p>
      <h3>Education</h3>
      <p class="company">B.Tech Computer Science</p>
      <p class="date">2017 – 2021</p>
      <p>MIT ADT University, Pune</p>
      <h3>Specializations</h3>
      <div>
        <span class="tag">Web Scraping</span><span class="tag">ETL Pipelines</span>
        <span class="tag">Data Engineering</span><span class="tag">AWS</span>
        <span class="tag">Python</span><span class="tag">Django</span>
      </div>
    `;
  }

  update(t) {
    this.time = t;
    if (this.core) {
      this.core.rotation.y = t * 0.3;
      this.wire.rotation.y = -t * 0.2;
      this.wire.rotation.x = t * 0.1;
      this.core.position.y = 4 + Math.sin(t * 0.8) * 0.3;
      this.wire.position.y = this.core.position.y;
    }
    if (this.orbitRings) {
      this.orbitRings.forEach((ring, i) => {
        ring.rotation[ring.userData.orbitAxis] = t * ring.userData.orbitSpeed;
      });
    }
    if (this.orbitDots) {
      this.orbitDots.forEach((dot, i) => {
        const ring = dot.userData.ring;
        const r = dot.userData.radius;
        const speed = ring.userData.orbitSpeed;
        dot.position.x = this.core.position.x + Math.cos(t * speed + i * 2) * r;
        dot.position.z = this.core.position.z + Math.sin(t * speed + i * 2) * r;
        dot.position.y = this.core.position.y + Math.sin(t * speed * 0.5 + i) * 2;
      });
    }
    if (this.infoBall) {
      this.infoBall.position.y = 1 + Math.sin(t * 1.2) * 0.3;
      this.infoBall.rotation.y = t * 0.5;
    }
  }
}
