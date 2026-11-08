# Motion Lab v0.2 — Interactive Gallery

A standalone Next.js + Three.js live generative art gallery.

## Requirements
- Node.js 20.9+ (Node.js 22 LTS recommended)

## Install
```powershell
npm.cmd install
npm.cmd run dev
```
Open http://localhost:3000.

## Update from v0.1
1. Stop the running server with Ctrl+C.
2. Back up your existing `motion-lab` folder (or commit your work).
3. Copy the **contents** of this `motion-lab-v0.2` folder directly into your existing `motion-lab` folder, replacing matching files. **Do not delete** your `.git` folder.
4. In `motion-lab`, run `npm.cmd install`, then `npm.cmd run dev`.
5. Open any artwork to drag to rotate the camera, scroll to zoom, pause/play, reset view, adjust speed, or toggle fullscreen.

## Controls
- Gallery previews are intentionally noninteractive, so clicking a card opens the artwork.
- Detail view: drag to orbit the camera, scroll/pinch to zoom, pause/play motion, reset camera, change animation speed (0.25–2.5x), reset all settings, and full-viewport mode with Esc to exit.
- `View source` loads the corresponding file from `public/source/` and enables copying.

## Code structure
- `scenes/` — the four individual particle art components.
- `components/SceneCanvas.tsx` — Three.js renderer and interactive camera.
- `components/Gallery.tsx` — gallery homepage.
- `components/ArtworkDetail.tsx` — detail page and controls.
- `lib/works.ts` — catalogue metadata.
- `public/source/` — publicly viewable source copies (synchronized with `scenes/`).

## Check a production build
```powershell
npm.cmd run build
```

## Deploy
Push your project to GitHub and import that repository in Vercel.

## v0.2 changelog
- Added orbit camera controls on artwork detail pages (via @react-three/drei).
- Added play/pause, speed slider, reset camera/settings, and full-viewport button.
- Refreshed gallery visual design, hover states, and responsive layouts.
- Kept existing four particle artworks and source viewer.
- Pausing freezes time-driven wave animation as well as rotation.
- Gallery cards remain clickable without WebGL pointer capture.
