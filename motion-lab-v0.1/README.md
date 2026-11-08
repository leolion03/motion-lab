# Motion Lab v0.1 — Gallery Foundation

A real-time creative coding gallery built with Next.js App Router, React 19, React Three Fiber, Three.js, and TypeScript. **No screenshots or recorded video are used for the four artworks** — they render live in your browser.

## Requirements
- Node.js 20.9+ (current LTS recommended)
- npm and a WebGL-capable modern browser

## Run locally
```powershell
cd "C:\coding file\personal_web"
# Extract motion-lab-v0.1.zip here and rename extracted folder to motion-lab if desired
cd .\motion-lab-v0.1
npm install
npm run dev
```
Open http://localhost:3000

## Production build
```powershell
npm run build
npm run start
```

## Deploy
Push this folder to a *new* GitHub repository (e.g. `motion-lab`), then import that repo into Vercel; framework preset Next.js. Do not add it to `leo-portfolio` unless you deliberately want a monorepo.

## Add another artwork
1. Add `scenes/MyNewScene.tsx` with a default-exported React Three Fiber scene.
2. Add its `slug`, metadata, and slug type to `lib/works.ts`.
3. Register a dynamic import and rendering branch inside `components/SceneCanvas.tsx`.
4. Copy the `.tsx` file to `public/source/` and register its filename in `components/ArtworkDetail.tsx` so View Source works.

## Notes
- All particle scenes are procedural; their initial placement differs on reload.
- Four live WebGL canvases are rendered on the gallery, which may stress older phones. Future versions can add pause-when-offscreen behavior.
- The UI displays "60 FPS*" as an aspirational rendering mode, not a measured performance figure; actual frame rate depends on device/browser.
- The GitHub buttons point to github.com as placeholders: replace with your repository URL.
- No server/database or login is needed for v0.1.
- Version: `v0.1.0 — Gallery Foundation`.
