import * as THREE from 'three';

const EXPERIENCE = [
  {
    title: 'Data Engineer',
    company: 'CRE Matrix',
    period: 'Feb 2025 – Present',
    location: 'Mumbai, India',
    color: 0x1dd4a0,
    highlights: [
      'Built scalable web scrapers with Python, Playwright, Selenium',
      'Engineered anti-bot handling: proxies, CAPTCHA, OTP automation',
      'Designed ETL pipelines: clean, validate, transform to SQL/NoSQL',
      'Built OCR extraction using EasyOCR, spaCy, Tesseract',
      'Reverse-engineered hidden APIs and encrypted parameters',
    ]
  },
  {
    title: 'Software Developer',
    company: 'Azuro by Square Yards',
    period: 'Feb 2023 – Feb 2025',
    location: 'Mumbai, India',
    color: 0x7c6eed,
    highlights: [
      'Developed web scraping scripts using Django, Celery, PostgreSQL',
      'Designed new real-estate ETL pipeline architecture',
      'Implemented Docker, RabbitMQ, PostgreSQL and proxy systems',
      'Automated data transformation pipelines',
      'Dumped extracted documents into AWS S3',
    ]
  },
  {
    title: 'Associate Software Engineer',
    company: 'Cogoport',
    period: 'Sep 2022 – Jan 2023',
    location: 'Mumbai, India',
    color: 0x378ADD,
    highlights: [
      'Built web apps with ReactJS, NextJS, Ruby on Rails',
      'Worked with PostgreSQL database',
      'Built a ChatBot agent using TensorFlow',
    ]
  },
  {
    title: 'Data Engineer (Freelancer)',
    company: 'CropIn Technologies',
    period: 'May 2022 – Jul 2022',
    location: 'Bangalore, India',
    color: 0xf06a3f,
    highlights: [
      'Created ETL pipelines from public websites',
      'Transformed data using Tabula and Pandas',
      'Stored results in pickle files and Amazon S3',
    ]
  },
  {
    title: 'Junior Software Engineer',
    company: 'Passer Digital',
    period: 'May 2021 – Sep 2022',
    location: 'Hyderabad, India',
    color: 0xBA7517,
    highlights: [
      'Developed subsidy management app with ReactJS and NodeJS',
      'Used Firebase Firestore as database',
      'Built Option Samurai ETL pipeline to S3',
      'Migrated AWS Lambda Functions from Python to ExpressJS',
    ]
  },
];

export class ExperienceZone {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(30, 0, 0);
    this.clickables = [];
    this.nodes = [];
    this._build();
    scene.add(this.group);
  }

  _build() {
    this._makeLabel('EXPERIENCE', 0, 14, 0, '#378ADD', 1.8);

    const spacing = 5.5;
    const totalH = (EXPERIENCE.length - 1) * spacing;

    // Vertical connector line
    const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, totalH + 2, 8);
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x2244aa, emissive: 0x1133aa, emissiveIntensity: 0.4
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 3 + totalH / 2, 0);
    this.group.add(line);

    EXPERIENCE.forEach((exp, i) => {
      const y = 3 + (EXPERIENCE.length - 1 - i) * spacing;

      // Node orb
      const nodeGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: exp.color,
        emissive: exp.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.6,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(0, y, 0);
      node.userData.label = `${exp.title} @ ${exp.company}`;
      node.userData.data = this._expHTML(exp);
      node.userData.cameraTarget = new THREE.Vector3(30, y, 0);
      node.userData.cameraPos = new THREE.Vector3(50, y + 4, 14);
      this.group.add(node);
      this.clickables.push(node);
      this.nodes.push({ mesh: node, y });

      // Floating card panel
      const cardGroup = new THREE.Group();
      cardGroup.position.set(2, y, 0);
      this.group.add(cardGroup);

      const cardGeo = new THREE.BoxGeometry(7, 2.5, 0.05);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0x0a1a2a,
        emissive: new THREE.Color(exp.color).multiplyScalar(0.05),
        roughness: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      cardGroup.add(card);

      // Card border glow
      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: exp.color, transparent: true, opacity: 0.5 });
      cardGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

      // Text label on card
      const sprite = this._makeCardSprite(exp);
      sprite.position.set(0, 0, 0.1);
      cardGroup.add(sprite);

      cardGroup.userData.floatOffset = i * 1.2;
      this.nodes[i].cardGroup = cardGroup;
    });
  }

  _makeCardSprite(exp) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 180;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 180);

    const col = '#' + exp.color.toString(16).padStart(6, '0');
    ctx.font = 'bold 32px Segoe UI, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(exp.title, 20, 42);

    ctx.font = '24px Segoe UI, sans-serif';
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = 8;
    ctx.fillText(exp.company, 20, 82);

    ctx.font = '20px Segoe UI, sans-serif';
    ctx.fillStyle = '#8888aa';
    ctx.shadowBlur = 0;
    ctx.fillText(exp.period, 20, 118);
    ctx.fillText(exp.location, 20, 148);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(7, 1.8, 1);
    return sprite;
  }

  _expHTML(exp) {
    const highlights = exp.highlights.map(h => `<li>${h}</li>`).join('');
    return `
      <h2>${exp.title}</h2>
      <p class="company">${exp.company}</p>
      <p class="date">${exp.period} · ${exp.location}</p>
      <h3>Key Achievements</h3>
      <ul>${highlights}</ul>
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
    this.nodes.forEach(({ mesh, cardGroup }, i) => {
      mesh.rotation.y = t * 0.6;
      const pulse = 0.3 + Math.abs(Math.sin(t * 0.5 + i));
      mesh.material.emissiveIntensity = pulse * 0.6;
      if (cardGroup) {
        cardGroup.position.y = this.nodes[i].y + Math.sin(t * 0.4 + cardGroup.userData.floatOffset) * 0.15;
      }
    });
  }
}
