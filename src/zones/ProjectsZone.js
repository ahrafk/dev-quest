import * as THREE from 'three';

const PROJECTS = [
  {
    title: 'Fabric Defect Detection',
    tech: ['Python', 'YOLO v3', 'DarkNet', 'Django', 'Computer Vision'],
    desc: 'AI API that detects defects in fabric during manufacturing using neural networks, noise removal, filtering, and segmentation. Published research paper in IRJET.',
    color: 0x7c6eed,
  },
  {
    title: 'Dream Ception',
    tech: ['InceptionV3', 'Deep Dream', 'Google AI', 'Django'],
    desc: 'AI application using InceptionV3 to create hallucinating patterns. Helps AI beginners understand neural network layers and artists create imaginary paintings.',
    color: 0x1dd4a0,
  },
  {
    title: 'PropheSir – Loan Predictor',
    tech: ['Machine Learning', 'Logistic Regression', 'CIBIL Score', 'Pandas'],
    desc: 'ML tool that checks loan eligibility by comparing CIBIL score and amount required. Achieved 83% accuracy using Logistic Regression.',
    color: 0x378ADD,
  },
  {
    title: 'Option Samurai Scraper',
    tech: ['Python', 'ETL', 'AWS S3', 'Selenium'],
    desc: 'ETL pipeline to extract and store data from the Option Samurai stock analysis platform, with final data stored in AWS S3.',
    color: 0xf06a3f,
  },
  {
    title: 'Dolphin – Subsidy App',
    tech: ['ReactJS', 'NodeJS', 'Firebase', 'Selenium', 'JEST'],
    desc: 'Web-based subsidy management application with automated UI testing via Selenium and API testing using JEST framework.',
    color: 0xBA7517,
  },
];

export class ProjectsZone {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, -22);
    this.clickables = [];
    this.cards = [];
    this._build();
    scene.add(this.group);
  }

  _build() {
    this._makeLabel('PROJECTS', 0, 12, 0, '#f06a3f', 1.8);

    const cols = [[-12, 0, 2], [0, 0, -2], [12, 0, 2], [-6, 0, -5], [6, 0, -5]];

    PROJECTS.forEach((proj, i) => {
      const [cx, cy, cz] = cols[i] || [i * 6 - 12, 0, 0];
      const cardGroup = new THREE.Group();
      cardGroup.position.set(cx, cy + 3, cz);
      this.group.add(cardGroup);

      // Holographic panel
      const geo = new THREE.BoxGeometry(6.5, 4.5, 0.08);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(proj.color).multiplyScalar(0.15),
        emissive: new THREE.Color(proj.color).multiplyScalar(0.08),
        roughness: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      const card = new THREE.Mesh(geo, mat);
      cardGroup.add(card);

      // Glowing border
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: proj.color, transparent: true, opacity: 0.8 });
      cardGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

      // Corner accents
      [[-3.25, 2.25], [3.25, 2.25], [-3.25, -2.25], [3.25, -2.25]].forEach(([cx2, cy2]) => {
        const cornerGeo = new THREE.BoxGeometry(0.5, 0.08, 0.15);
        const cornerMat = new THREE.MeshStandardMaterial({ color: proj.color, emissive: proj.color, emissiveIntensity: 0.8 });
        const h = new THREE.Mesh(cornerGeo, cornerMat);
        h.position.set(cx2, cy2, 0.05);
        cardGroup.add(h);
        const v = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.5, 0.15),
          cornerMat.clone()
        );
        v.position.set(cx2, cy2, 0.05);
        cardGroup.add(v);
      });

      // Text content sprite
      const sprite = this._makeProjectSprite(proj);
      sprite.position.set(0, 0, 0.12);
      cardGroup.add(sprite);

      // Clickable
      card.userData.label = proj.title;
      card.userData.data = this._projectHTML(proj);
      card.userData.cameraTarget = new THREE.Vector3(cx, cy + 3, cz - 22);
      card.userData.cameraPos = new THREE.Vector3(cx, cy + 6, cz - 10);
      this.clickables.push(card);

      cardGroup.userData.floatOffset = i * 1.3;
      cardGroup.userData.baseY = cy + 3;
      this.cards.push(cardGroup);
    });
  }

  _makeProjectSprite(proj) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 360;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 360);

    const col = '#' + proj.color.toString(16).padStart(6, '0');
    ctx.font = 'bold 32px Segoe UI, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = col;
    ctx.shadowBlur = 10;
    ctx.fillText(proj.title, 20, 44);

    ctx.font = '20px Segoe UI, sans-serif';
    ctx.fillStyle = '#aaaacc';
    ctx.shadowBlur = 0;
    const lines = this._wrapText(ctx, proj.desc, 20, 88, 470, 28);

    ctx.font = 'bold 18px Segoe UI, sans-serif';
    const tagY = 88 + lines * 30 + 16;
    let tagX = 20;
    proj.tech.forEach(t => {
      const w = ctx.measureText(t).width + 20;
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      ctx.fillText(t, tagX, tagY);
      tagX += w + 8;
    });

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(6.5, 4.5, 1);
    return sprite;
  }

  _wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '', lines = 0;
    for (let w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, y + lines * lineH);
        line = w + ' ';
        lines++;
        if (lines > 3) break;
      } else { line = test; }
    }
    if (lines <= 3) { ctx.fillText(line.trim(), x, y + lines * lineH); lines++; }
    return lines;
  }

  _projectHTML(proj) {
    const techs = proj.tech.map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <h2>${proj.title}</h2>
      <p>${proj.desc}</p>
      <h3>Tech Stack</h3>
      <div>${techs}</div>
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
    this.cards.forEach((card, i) => {
      card.position.y = card.userData.baseY + Math.sin(t * 0.5 + card.userData.floatOffset) * 0.3;
      card.rotation.y = Math.sin(t * 0.2 + i * 0.5) * 0.08;
    });
  }
}
