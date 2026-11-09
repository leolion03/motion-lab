"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Check, Code2, Copy, ExternalLink,
  Maximize2, Minimize2, Pause, Play, RotateCcw, SlidersHorizontal,
} from "lucide-react";
import { getWork, works } from "@/lib/works";
import SceneCanvas from "@/components/SceneCanvas";

const files: Record<string, string> = {
  "primogem": "Primogem.tsx",
  "particle-heart": "ParticleHeart.tsx",
  "christmas-tree": "ChristmasTree.tsx",
  "spiral-galaxy": "SpiralGalaxy.tsx",
  "particle-wave": "ParticleWave.tsx",
  "jellyfish": "Jellyfish.tsx",
  "blooming-flower": "BloomingFlower.tsx",
  "butterfly": "Butterfly.tsx",
  "fountain": "Fountain.tsx",
  "birthday-cake": "BirthdayCake.tsx",
  "saturn": "Saturn.tsx",
  "four-leaf-clover": "FourLeafClover.tsx",
};

export default function ArtworkDetail({ slug }: { slug: string }) {
  const work = getWork(slug);
  const [source, setSource] = useState("");
  const [sourceError, setSourceError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [full, setFull] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [brightness, setBrightness] = useState(0.8);
  const [glowEnabled, setGlowEnabled] = useState(false);
  const [glow, setGlow] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!work) return;
    const controller = new AbortController();
    setSource("");
    setSourceError(false);
    fetch(`/source/${files[work.slug]}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("Source unavailable"); return r.text(); })
      .then(setSource)
      .catch(e => { if (e.name !== "AbortError") setSourceError(true); });
    return () => controller.abort();
  }, [work]);

  useEffect(() => {
    if (!full) return;
    function onKeyDown(e: KeyboardEvent) { if (e.key === "Escape") setFull(false); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [full]);

  useEffect(() => () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); }, []);

  async function copySource() {
    if (!source) return;
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  }

  if (!work) return <div className="not-found"><h1>Artwork not found</h1><Link href="/">← Back to gallery</Link></div>;
  const next = works[(works.indexOf(work) + 1) % works.length];

  return <main className="detail container">
    <div className="detail-top">
      <Link href="/" className="back"><ArrowLeft size={16} /> Back to gallery</Link>
      <span>MOTION LAB / ARTWORK {String(works.indexOf(work) + 1).padStart(2, "0")}</span>
    </div>
    <div className="detail-heading">
      <div>
        <div className="eyebrow small">INTERACTIVE ARTWORK · {work.category.toUpperCase()}</div>
        <h1>{work.name}<span className="purple-dot">.</span></h1>
        <p>{work.description}</p>
      </div>
      <span className="detail-type">THREE.JS / WEBGL</span>
    </div>

    <div ref={stageRef} className={full ? "detail-canvas fullscreen" : "detail-canvas"}>
      <SceneCanvas key={work.slug} slug={work.slug} large interactive paused={paused} speed={speed} brightness={brightness} glowEnabled={glowEnabled} glow={glow} resetSignal={resetSignal} />
      <span className="live-indicator"><span className={`dot ${paused ? "dot-paused" : ""}`} /> {paused ? "PAUSED" : "LIVE RENDER"}</span>
      <div className="canvas-hint">DRAG TO ORBIT <span>·</span> SCROLL TO ZOOM</div>
      <div className="canvas-tools">
        <button title={paused ? "Play" : "Pause"} aria-label={paused ? "Play animation" : "Pause animation"} onClick={() => setPaused(p => !p)}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        <button title="Reset camera" aria-label="Reset camera" onClick={() => setResetSignal(n => n + 1)}><RotateCcw size={17} /></button>
        <button title={full ? "Exit fullscreen" : "Fullscreen"} aria-label={full ? "Exit fullscreen" : "Fullscreen"} onClick={() => setFull(v => !v)}>{full ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
      </div>
    </div>

    <section className="playback-panel" aria-label="Animation controls">
      <div className="playback-label"><SlidersHorizontal size={17} /><div><strong>Playback settings</strong><small>Fine-tune your viewing experience</small></div></div>
      <div className="speed-control">
        <label htmlFor="speed">Rotation / motion speed</label>
        <input id="speed" type="range" min="0.25" max="2.5" step="0.25" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        <output htmlFor="speed">{speed.toFixed(2)}×</output>
      </div>
      <div className="speed-control appearance-control">
        <label htmlFor="brightness">Brightness</label>
        <input id="brightness" type="range" min="0.5" max="2" step="0.1" value={brightness} onChange={e => setBrightness(Number(e.target.value))} />
        <output htmlFor="brightness">{brightness.toFixed(1)}×</output>
      </div>
      <label className="glow-switch" htmlFor="glowEnabled">
        <input id="glowEnabled" type="checkbox" role="switch" checked={glowEnabled} onChange={e => setGlowEnabled(e.target.checked)} />
        <span className="switch-track" aria-hidden="true"><span /></span>
        <span>Glow effect <small>{glowEnabled ? "On" : "Off (default)"}</small></span>
      </label>
      {glowEnabled && <div className="speed-control appearance-control">
        <label htmlFor="glow">Glow intensity</label>
        <input id="glow" type="range" min="0.3" max="2" step="0.1" value={glow} onChange={e => setGlow(Number(e.target.value))} />
        <output htmlFor="glow">{glow.toFixed(1)}×</output>
      </div>}
      <button className="reset-speed" onClick={() => { setSpeed(1); setBrightness(0.8); setGlowEnabled(false); setGlow(1); setPaused(false); setResetSignal(n => n + 1); }}><RotateCcw size={14} /> Reset all</button>
      <p className="appearance-note">Glow is off by default. Turn it on whenever you want softer, brighter particles. Gallery previews always use the glow-off default.</p>
    </section>

    <div className="detail-actions">
      <div><strong>{work.count}</strong><small>PARTICLES</small></div>
      <div><strong>WEBGL</strong><small>REAL-TIME RENDER</small></div>
      <div><strong>v0.5.1</strong><small>INTERACTIVE STUDY</small></div>
      <button onClick={() => setShowCode(v => !v)} className="source-toggle" aria-expanded={showCode}><Code2 size={17} />{showCode ? "Hide source" : "View source"}<ArrowUpRight size={16} /></button>
    </div>

    {showCode && <section className="source-panel">
      <div className="source-head"><div><Code2 size={17} /> {files[work.slug]}</div><button disabled={!source} onClick={copySource}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy code"}</button></div>
      <pre><code>{sourceError ? "Unable to load source file." : source || "Loading source..."}</code></pre>
      <p className="source-note">Scene component only. Each artwork also imports ParticleCloud.tsx; open /source/ParticleCloud.tsx or see README for the shared particle shader.</p>
    </section>}
    <div className="detail-next"><Link href="/">← All artworks</Link><Link href={`/animation/${next.slug}`}>Next: {next.name} <ArrowUpRight size={16} /></Link></div>
    <footer className="footer"><span>© 2026 Motion Lab · v0.5.1</span><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a></footer>
  </main>;
}
