import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSky } from './src/world/Sky.js';
import { createIsland } from './src/world/Island.js';
import { setupLighting } from './src/world/Lighting.js';
import { HeroZone } from './src/zones/HeroZone.js';
import { SkillsZone } from './src/zones/SkillsZone.js';
import { ExperienceZone } from './src/zones/ExperienceZone.js';
import { ProjectsZone } from './src/zones/ProjectsZone.js';
import { ContactZone } from './src/zones/ContactZone.js';
import { Minimap } from './src/ui/Minimap.js';
import { ZoneDetector } from './src/ui/ZoneDetector.js';
import { CameraTrail } from './src/utils/CameraTrail.js';
import { AmbientParticles } from './src/utils/AmbientParticles.js';
import { RockAnimator } from './src/utils/RockAnimator.js';

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000008);
scene.fog = new THREE.FogExp2(0x000010, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 12, 40);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 15;
controls.maxDistance = 120;
controls.maxPolarAngle = Math.PI * 0.75;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.target.set(0, 0, 0);

setupLighting(scene);
createSky(scene);
createIsland(scene);

const heroZone       = new HeroZone(scene);
const skillsZone     = new SkillsZone(scene);
const experienceZone = new ExperienceZone(scene);
const projectsZone   = new ProjectsZone(scene);
const contactZone    = new ContactZone(scene);
const zones = [heroZone, skillsZone, experienceZone, projectsZone, contactZone];

const minimap      = new Minimap();
const zoneDetector = new ZoneDetector();
const cameraTrail  = new CameraTrail(scene);
const ambientParts = new AmbientParticles(scene, 500);
const rockAnimator = new RockAnimator(scene);

const raycaster  = new THREE.Raycaster();
const mouse      = new THREE.Vector2();
const clickables = [];
zones.forEach(z => { if (z.clickables) clickables.push(...z.clickables); });

const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);

// Loading
let loadPct = 0;
const loadBar   = document.getElementById('loading-bar');
const loadPctEl = document.getElementById('loading-percent');
const loadSub   = document.getElementById('loading-sub');
const loadMsgs  = [
  'Building the island...',
  'Spawning skill orbs...',
  'Laying the timeline...',
  'Projecting holograms...',
  'Booting terminal...',
  'Activating the portal...',
];
let msgIdx = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 16 + 4;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loadInterval); setTimeout(finishLoading, 300); }
  loadBar.style.width = loadPct + '%';
  loadPctEl.textContent = Math.floor(loadPct) + '%';
  if (msgIdx < loadMsgs.length) loadSub.textContent = loadMsgs[msgIdx++];
}, 340);

function finishLoading() {
  const screen = document.getElementById('loading-screen');
  screen.classList.add('hidden');
  document.getElementById('hud').classList.add('visible');
  setTimeout(() => screen.remove(), 900);
}

function flyTo(target, pos) {
  controls.autoRotate = false;
  gsap.to(camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: 1.8, ease: 'power3.inOut' });
  gsap.to(controls.target, {
    x: target.x, y: target.y, z: target.z,
    duration: 1.8, ease: 'power3.inOut',
    onUpdate: () => controls.update(),
  });
  setTimeout(() => { controls.autoRotate = true; }, 3500);
}

function showInfoPanel(data) {
  document.getElementById('info-content').innerHTML = data;
  document.getElementById('info-panel').classList.add('open');
}
document.getElementById('info-close').addEventListener('click', () => {
  document.getElementById('info-panel').classList.remove('open');
});

window.addEventListener('mousemove', e => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickables, true);
  if (hits.length) {
    const obj   = hits[0].object;
    const label = obj.userData.label || obj.parent?.userData?.label;
    if (label) {
      tooltip.style.display = 'block';
      tooltip.style.left    = e.clientX + 14 + 'px';
      tooltip.style.top     = e.clientY - 10 + 'px';
      tooltip.textContent   = label;
      document.body.style.cursor = 'pointer';
      return;
    }
  }
  tooltip.style.display = 'none';
  document.body.style.cursor = 'default';
});

window.addEventListener('click', e => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickables, true);
  if (!hits.length) return;
  const obj  = hits[0].object;
  const data = obj.userData.data || obj.parent?.userData?.data;
  if (data) showInfoPanel(data);
  const ct = obj.userData.cameraTarget || obj.parent?.userData?.cameraTarget;
  const cp = obj.userData.cameraPos    || obj.parent?.userData?.cameraPos;
  if (ct && cp) flyTo(ct, cp);
});

const CAM = {
  hero:       { pos: new THREE.Vector3(  0, 12,  40), target: new THREE.Vector3(  0, 2,  0) },
  skills:     { pos: new THREE.Vector3(-45, 10,  12), target: new THREE.Vector3(-30, 2,  0) },
  experience: { pos: new THREE.Vector3( 48, 10,  12), target: new THREE.Vector3( 30, 4,  0) },
  projects:   { pos: new THREE.Vector3(  0, 10, -38), target: new THREE.Vector3(  0, 2,-22) },
  contact:    { pos: new THREE.Vector3(  0, 14,  52), target: new THREE.Vector3(  0, 4, 22) },
};

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const zone = btn.dataset.zone;
    if (CAM[zone]) flyTo(CAM[zone].target, CAM[zone].pos);
    document.getElementById('current-zone-label').textContent = zone.toUpperCase() + ' ZONE';
  });
});

const KEY_MAP = { '1': 'hero', '2': 'skills', '3': 'experience', '4': 'projects', '5': 'contact' };
window.addEventListener('keydown', e => {
  const zone = KEY_MAP[e.key];
  if (zone) document.querySelector(`.nav-btn[data-zone="${zone}"]`)?.click();
  if (e.key === 'Escape') document.getElementById('info-panel').classList.remove('open');
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  controls.update();
  rockAnimator.update(t);
  ambientParts.update();
  cameraTrail.update(camera);
  zones.forEach(z => z.update?.(t));
  minimap.update(camera);
  zoneDetector.update(camera);
  renderer.render(scene, camera);
}
animate();
