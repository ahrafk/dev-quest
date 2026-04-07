# 🎮 Dev Quest — Ahraf Khatri's 3D Portfolio

An interactive 3D game-like portfolio built with Three.js, deployed on GitHub Pages.

## 🚀 Live Demo
After deployment: `https://ahrafkhatri.github.io/ahraf-portfolio/`

## ✨ Features
- **3D floating island** in a starfield with nebula and asteroid rocks
- **Interactive zones** — click to explore each section
- **Hero Zone** — animated core sphere with orbital rings
- **Skills Zone** — 12 tech skills as orbiting 3D spheres on 3 orbital rings
- **Experience Zone** — vertical 3D timeline with floating holographic cards
- **Projects Zone** — 5 holographic project panels with glowing borders
- **Contact Zone** — green terminal display, clickable for contact form
- **Game HUD** — player card, nav buttons, zone label, controls hint
- **Info Panel** — slides in with full detail on click

## 🕹 Controls
| Action | Control |
|--------|---------|
| Orbit camera | Click + Drag |
| Zoom | Scroll wheel |
| Fly to zone | Click nav buttons |
| See details | Click any object |
| Close detail | X button |
| Auto-rotate | On by default |

## 📁 Structure
```
ahraf-portfolio/
├── index.html              ← Entry point
├── style.css               ← Game HUD, loading screen, info panel
├── main.js                 ← Three.js scene + orchestration
├── src/
│   ├── world/
│   │   ├── Island.js       ← Floating island + grid + particles
│   │   ├── Sky.js          ← Starfield + asteroids
│   │   └── Lighting.js     ← Dynamic colored lights
│   ├── zones/
│   │   ├── HeroZone.js     ← Name + core sphere + orbit rings
│   │   ├── SkillsZone.js   ← Skill orbs on 3 orbital tracks
│   │   ├── ExperienceZone.js ← Vertical timeline with cards
│   │   ├── ProjectsZone.js ← Holographic project panels
│   │   └── ContactZone.js  ← Terminal + contact form
│   └── ui/
│       └── HUD.js          ← UI helpers
└── .github/workflows/
    └── deploy.yml          ← Auto-deploy to GitHub Pages
```

## 🛠 Deploy to GitHub Pages (Free)

### Step 1 — Create repo
```bash
git init
git add .
git commit -m "🎮 Initial commit — Dev Quest portfolio"
git branch -M main
git remote add origin https://github.com/ahrafkhatri/ahraf-portfolio.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will auto-run and deploy!

### Step 3 — Done! 
Your site is live at:
`https://YOUR_USERNAME.github.io/ahraf-portfolio/`

## 🔧 Local Development
No build tools needed! Just run any static server:

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .

# VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open `http://localhost:3000`

## 🎨 Customization
- Colors: Edit CSS variables in `style.css`
- Content: Edit arrays in each `src/zones/*.js` file
- Add zones: Create new zone class, import in `main.js`
