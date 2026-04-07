/**
 * ZoneDetector — detects which zone the camera is nearest to
 * and updates the HUD zone label + nav button highlights.
 */
const ZONE_POSITIONS = [
  { id: 'hero',       x: 0,   z: 0,   radius: 20 },
  { id: 'skills',     x: -30, z: 0,   radius: 18 },
  { id: 'experience', x: 30,  z: 0,   radius: 18 },
  { id: 'projects',   x: 0,   z: -22, radius: 18 },
  { id: 'contact',    x: 0,   z: 22,  radius: 18 },
];

export class ZoneDetector {
  constructor() {
    this.currentZone = 'hero';
    this.label = document.getElementById('current-zone-label');
    this.navBtns = document.querySelectorAll('.nav-btn');
    this.flash = document.getElementById('zone-flash');
  }

  update(camera) {
    let nearest = null;
    let minDist = Infinity;

    ZONE_POSITIONS.forEach(zone => {
      const dx = camera.position.x - zone.x;
      const dz = camera.position.z - zone.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = zone;
      }
    });

    if (nearest && nearest.id !== this.currentZone) {
      this.currentZone = nearest.id;
      if (this.label) {
        this.label.textContent = nearest.id.toUpperCase() + ' ZONE';
      }
      this.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.zone === nearest.id);
      });
      // Flash effect
      if (this.flash) {
        this.flash.classList.add('flash');
        setTimeout(() => this.flash.classList.remove('flash'), 400);
      }
    }
  }
}
