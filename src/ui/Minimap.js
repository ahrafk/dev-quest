/**
 * Minimap — canvas-based radar showing camera position + all zones
 */
export class Minimap {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 150;
    this.canvas.height = 150;
    this.canvas.id = 'minimap';
    Object.assign(this.canvas.style, {
      position: 'fixed',
      bottom: '60px',
      right: '20px',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      border: '1px solid rgba(124,110,237,0.5)',
      background: 'rgba(4,10,24,0.85)',
      zIndex: '11',
      backdropFilter: 'blur(10px)',
      pointerEvents: 'none',
    });
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Zone markers in world space (x, z) — mapped to minimap
    this.zones = [
      { label: 'H', x: 0,   z: 0,   color: '#7c6eed' },
      { label: 'S', x: -30, z: 0,   color: '#1dd4a0' },
      { label: 'E', x: 30,  z: 0,   color: '#378ADD' },
      { label: 'P', x: 0,   z: -22, color: '#f06a3f' },
      { label: 'C', x: 0,   z: 22,  color: '#e84393' },
    ];
    this.WORLD_RANGE = 80; // world units mapped to minimap radius
  }

  _worldToMap(wx, wz) {
    const cx = 75, cy = 75, r = 60;
    return {
      x: cx + (wx / this.WORLD_RANGE) * r,
      y: cy + (wz / this.WORLD_RANGE) * r,
    };
  }

  update(camera) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 150, 150);

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(75, 75, 73, 0, Math.PI * 2);
    ctx.clip();

    // Faint grid
    ctx.strokeStyle = 'rgba(124,110,237,0.08)';
    ctx.lineWidth = 1;
    for (let g = 1; g <= 3; g++) {
      ctx.beginPath();
      ctx.arc(75, 75, g * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Crosshair
    ctx.strokeStyle = 'rgba(124,110,237,0.12)';
    ctx.beginPath(); ctx.moveTo(75, 10); ctx.lineTo(75, 140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 75); ctx.lineTo(140, 75); ctx.stroke();

    // Zone dots
    this.zones.forEach(z => {
      const p = this._worldToMap(z.x, z.z);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = z.color + '33';
      ctx.fill();
      ctx.strokeStyle = z.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = z.color;
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.label, p.x, p.y);
    });

    // Camera position
    const cp = this._worldToMap(camera.position.x, camera.position.z);
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Outer ring
    ctx.beginPath();
    ctx.arc(75, 75, 73, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(124,110,237,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.fillStyle = 'rgba(124,110,237,0.7)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RADAR', 75, 143);
  }
}
