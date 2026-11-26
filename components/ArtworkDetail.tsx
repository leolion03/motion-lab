"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Check, Code2, Copy, ExternalLink,
  Maximize2, Minimize2, Pause, Play, RotateCcw, SlidersHorizontal,
} from "lucide-react";
import { getWork, works } from "@/lib/works";
import LanguageLink from "@/components/LanguageLink";
import { localizedPath, localizedWork, type Locale } from "@/lib/i18n";
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
  "mobius-loop": "MobiusLoop.tsx",
};

export default function ArtworkDetail({ slug, locale }: { slug: string; locale: Locale }) {
  const work = getWork(slug);
  const t = (en: string, zh: string) => locale === "zh" ? zh : en;
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

  if (!work) return <div className="not-found"><h1>{t("Artwork not found", "找不到作品")}</h1><Link href={localizedPath(locale)}>← {t("Back to gallery", "返回画廊")}</Link></div>;
  const isMobiusLoop = work.slug === "mobius-loop";
  const display = localizedWork(work, locale);
  const next = localizedWork(works[(works.indexOf(work) + 1) % works.length], locale);

  return <main className="detail container">
    <div className="detail-top">
      <Link href={localizedPath(locale)} className="back"><ArrowLeft size={16} /> {t("Back to gallery", "返回画廊")}</Link>
      <span>MOTION LAB / {t("ARTWORK", "作品")} {String(works.indexOf(work) + 1).padStart(2, "0")}</span>
      <LanguageLink locale={locale} path={`/animation/${work.slug}`} />
    </div>
    <div className="detail-heading">
      <div>
        <div className="eyebrow small">{t("INTERACTIVE ARTWORK", "互动作品")} · {display.category.toUpperCase()}</div>
        <h1>{display.name}<span className="purple-dot">.</span></h1>
        <p>{display.description}</p>
      </div>
      <span className="detail-type">THREE.JS / WEBGL</span>
    </div>

    <div ref={stageRef} className={full ? "detail-canvas fullscreen" : "detail-canvas"}>
      <SceneCanvas key={work.slug} slug={work.slug} label={display.name} large interactive paused={paused} speed={speed} brightness={brightness} glowEnabled={glowEnabled} glow={glow} resetSignal={resetSignal} />
      <span className="live-indicator"><span className={`dot ${paused ? "dot-paused" : ""}`} /> {paused ? t("PAUSED", "已暂停") : t("LIVE RENDER", "实时渲染")}</span>
      <div className="canvas-hint">{isMobiusLoop ? t("DRAG HORIZONTALLY TO TILT", "横向拖动可倾斜") : <>{t("DRAG TO ORBIT", "拖动旋转")} <span>·</span> {t("SCROLL TO ZOOM", "滚动缩放")}</>}</div>
      <div className="canvas-tools">
        <button title={paused ? t("Play", "播放") : t("Pause", "暂停")} aria-label={paused ? t("Play animation", "播放动画") : t("Pause animation", "暂停动画")} onClick={() => setPaused(p => !p)}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        {!isMobiusLoop && <button title={t("Reset camera", "重置视角")} aria-label={t("Reset camera", "重置视角")} onClick={() => setResetSignal(n => n + 1)}><RotateCcw size={17} /></button>}
        <button title={full ? t("Exit fullscreen", "退出全屏") : t("Fullscreen", "全屏")} aria-label={full ? t("Exit fullscreen", "退出全屏") : t("Fullscreen", "全屏")} onClick={() => setFull(v => !v)}>{full ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
      </div>
    </div>

    <section className="playback-panel" aria-label={t("Animation controls", "动画控件")}>
      <div className="playback-label"><SlidersHorizontal size={17} /><div><strong>{t("Playback settings", "播放设置")}</strong><small>{t("Fine-tune your viewing experience", "调整动画与粒子效果")}</small></div></div>
      <div className="speed-control">
        <label htmlFor="speed">{t("Rotation / motion speed", "旋转 / 动画速度")}</label>
        <input id="speed" type="range" min="0.25" max="2.5" step="0.25" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        <output htmlFor="speed">{speed.toFixed(2)}×</output>
      </div>
      <div className="speed-control appearance-control">
        <label htmlFor="brightness">{t("Brightness", "亮度")}</label>
        <input id="brightness" type="range" min="0.5" max="2" step="0.1" value={brightness} onChange={e => setBrightness(Number(e.target.value))} />
        <output htmlFor="brightness">{brightness.toFixed(1)}×</output>
      </div>
      <label className="glow-switch" htmlFor="glowEnabled">
        <input id="glowEnabled" type="checkbox" role="switch" checked={glowEnabled} onChange={e => setGlowEnabled(e.target.checked)} />
        <span className="switch-track" aria-hidden="true"><span /></span>
        <span>{t("Glow effect", "发光效果")} <small>{glowEnabled ? t("On", "开启") : t("Off (default)", "关闭（默认）")}</small></span>
      </label>
      {glowEnabled && <div className="speed-control appearance-control">
        <label htmlFor="glow">{t("Glow intensity", "发光强度")}</label>
        <input id="glow" type="range" min="0.3" max="2" step="0.1" value={glow} onChange={e => setGlow(Number(e.target.value))} />
        <output htmlFor="glow">{glow.toFixed(1)}×</output>
      </div>}
      <button className="reset-speed" onClick={() => { setSpeed(1); setBrightness(0.8); setGlowEnabled(false); setGlow(1); setPaused(false); setResetSignal(n => n + 1); }}><RotateCcw size={14} /> {t("Reset all", "全部重置")}</button>
      <p className="appearance-note">{t("Glow is off by default. Turn it on whenever you want softer, brighter particles. Gallery previews always use the glow-off default.", "发光默认关闭。开启后，粒子边缘会更柔和、更明亮。画廊预览默认关闭发光。")}</p>
    </section>

    <div className="detail-actions">
      <div><strong>{work.count}</strong><small>{t("PARTICLES", "粒子")}</small></div>
      <div><strong>WEBGL</strong><small>{t("REAL-TIME RENDER", "实时渲染")}</small></div>
      <div><strong>v0.5.1</strong><small>{t("INTERACTIVE STUDY", "互动实验")}</small></div>
      <button onClick={() => setShowCode(v => !v)} className="source-toggle" aria-expanded={showCode}><Code2 size={17} />{showCode ? t("Hide source", "隐藏源码") : t("View source", "查看源码")}<ArrowUpRight size={16} /></button>
    </div>

    {showCode && <section className="source-panel">
      <div className="source-head"><div><Code2 size={17} /> {files[work.slug]}</div><button disabled={!source} onClick={copySource}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? t("Copied!", "已复制") : t("Copy code", "复制代码")}</button></div>
      <pre><code>{sourceError ? t("Unable to load source file.", "无法加载源码。") : source || t("Loading source...", "正在加载源码…")}</code></pre>
      <p className="source-note">{t("Scene component only. Each artwork also imports ParticleCloud.tsx; open /source/ParticleCloud.tsx or see README for the shared particle shader.", "这里显示的是场景组件。共享粒子着色器见 /source/ParticleCloud.tsx 或 README。")}</p>
    </section>}
    <div className="detail-next"><Link href={localizedPath(locale)}>← {t("All artworks", "全部作品")}</Link><Link href={localizedPath(locale, `/animation/${next.slug}`)}>{t("Next:", "下一件作品：")} {next.name} <ArrowUpRight size={16} /></Link></div>
    <footer className="footer"><span>© 2026 Motion Lab · v0.5.1</span><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a></footer>
  </main>;
}
