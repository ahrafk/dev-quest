import * as THREE from 'three';

export class ContactZone {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 22);
    this.clickables = [];
    this._build();
    scene.add(this.group);
  }

  _build() {
    this._makeLabel('CONTACT', 0, 10, 0, '#1dd4a0', 1.8);

    // Terminal frame
    const termGeo = new THREE.BoxGeometry(14, 9, 0.15);
    const termMat = new THREE.MeshStandardMaterial({
      color: 0x040e18,
      emissive: 0x061520,
      roughness: 0.8,
      transparent: true,
      opacity: 0.92,
    });
    this.terminal = new THREE.Mesh(termGeo, termMat);
    this.terminal.position.set(0, 4, 0);
    this.group.add(this.terminal);

    // Border glow
    const edgeGeo = new THREE.EdgesGeometry(termGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x1dd4a0, transparent: true, opacity: 0.7 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.copy(this.terminal.position);
    this.group.add(edges);

    // Terminal screen text sprite
    const sprite = this._makeTerminalSprite();
    sprite.position.set(0, 4, 0.12);
    this.group.add(sprite);

    // Clickable - opens contact form
    this.terminal.userData.label = 'Open Contact Form';
    this.terminal.userData.data = this._contactFormHTML();
    this.terminal.userData.cameraTarget = new THREE.Vector3(0, 4, 22);
    this.terminal.userData.cameraPos = new THREE.Vector3(0, 10, 42);
    this.clickables.push(this.terminal);

    // Floating particles around terminal
    const partCount = 80;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      partPos[i * 3]     = (Math.random() - 0.5) * 20;
      partPos[i * 3 + 1] = Math.random() * 12;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({ color: 0x1dd4a0, size: 0.12, transparent: true, opacity: 0.6 });
    this.particles = new THREE.Points(partGeo, partMat);
    this.group.add(this.particles);

    // Social links as small orbs
    const socials = [
      { label: 'Email', color: 0x7c6eed, x: -5 },
      { label: 'GitHub', color: 0xffffff, x: 0 },
      { label: 'LinkedIn', color: 0x378ADD, x: 5 },
    ];
    socials.forEach(s => {
      const orbGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: s.color, emissive: s.color, emissiveIntensity: 0.5, roughness: 0.2
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(s.x, 0, 0);
      orb.userData.label = s.label;
      this.group.add(orb);
      this.clickables.push(orb);
    });
  }

  _makeTerminalSprite() {
    const c = document.createElement('canvas');
    c.width = 700; c.height = 450;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(4,14,24,0)';
    ctx.fillRect(0, 0, 700, 450);

    // Terminal header bar
    ctx.fillStyle = '#0d2030';
    ctx.fillRect(0, 0, 700, 50);
    ctx.fillStyle = '#1dd4a0';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('▶  ahraf@devquest:~$', 20, 33);

    // Traffic lights
    [0xe74c3c, 0xe67e22, 0x2ecc71].forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(620 + i * 22, 24, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#' + col.toString(16);
      ctx.fill();
    });

    // Terminal lines
    const lines = [
      ['#1dd4a0', 'ahraf@devquest:~$ whoami'],
      ['#ffffff', '  Ahraf Khatri — Data Engineer'],
      ['#1dd4a0', 'ahraf@devquest:~$ cat contact.txt'],
      ['#8888aa', '  📧  ahraf.khatri7@gmail.com'],
      ['#8888aa', '  📱  +91 84520 72382'],
      ['#8888aa', '  📍  Mumbai, Maharashtra, India'],
      ['#1dd4a0', 'ahraf@devquest:~$ echo $status'],
      ['#2ecc71', '  ✔  Open to opportunities'],
      ['#1dd4a0', 'ahraf@devquest:~$ _'],
    ];

    lines.forEach(([color, text], i) => {
      ctx.font = i % 2 === 0 ? 'bold 20px monospace' : '20px monospace';
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = color === '#1dd4a0' ? 6 : 0;
      ctx.fillText(text, 20, 80 + i * 40);
    });

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(14, 9, 1);
    return sprite;
  }

  _contactFormHTML() {
    return `
      <h2>Get In Touch</h2>
      <p>I'm open to new opportunities, collaborations, or just a chat!</p>
      <h3>Direct Contact</h3>
      <p>📧 ahraf.khatri7@gmail.com</p>
      <p>📱 +91 84520 72382</p>
      <p>📍 Mumbai, Maharashtra, India</p>
      <h3>Send a Message</h3>
      <div class="contact-form">
        <input type="text" placeholder="Your name" />
        <input type="email" placeholder="Your email" />
        <textarea rows="4" placeholder="Your message..."></textarea>
        <button onclick="this.textContent='Message sent! ✓'; this.style.background='#1dd4a0';">
          Send Message
        </button>
      </div>
    `;
  }

  _makeLabel(text, x, y, z, color, size) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 72px Segoe UI, sans-serif';
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
    if (this.terminal) {
      this.terminal.position.y = 4 + Math.sin(t * 0.5) * 0.15;
    }
    if (this.particles) {
      this.particles.rotation.y = t * 0.05;
      const pos = this.particles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        pos.setY(i, ((pos.getY(i) + 0.02) % 12));
      }
      pos.needsUpdate = true;
    }
  }
}
