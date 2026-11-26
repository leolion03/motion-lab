"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Search, Sparkles } from "lucide-react";
import { works } from "@/lib/works";
import LanguageLink from "@/components/LanguageLink";
import { categoryLabel, localizedPath, localizedWork, type Locale } from "@/lib/i18n";
import LazyScene from "@/components/LazyScene";

const filters = ["All works", "Game", "Particles", "Seasonal", "Space", "Abstract", "Nature"];
export default function Gallery({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [filter, setFilter] = useState("All works");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => works.filter(w =>
    (filter === "All works" || w.category === filter) &&
    [w, localizedWork(w, locale)].some(({ name, description, subtitle }) =>
      `${name} ${description} ${subtitle}`.toLowerCase().includes(query.trim().toLowerCase())
    )
  ), [filter, query, locale]);

  return <>
    <header className="topbar container">
      <Link className="brand" href={localizedPath(locale)}><span className="brand-mark"><Sparkles size={19} /></span><span>MOTION<span className="brand-light">LAB</span></span><span className="brand-version">/ 0.5.1</span></Link>
      <nav aria-label={zh ? "主导航" : "Main navigation"}><a href="#gallery">{zh ? "画廊" : "Gallery"}</a><a href="#about">{zh ? "关于" : "About"}</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a><LanguageLink locale={locale} /></nav>
    </header>
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot" /> {zh ? "实验数字艺术画廊" : "AN EXPERIMENTAL DIGITAL GALLERY"} <span className="eyebrow-line" /></div>
          <h1>{zh ? <>用代码写下<br /><em>流动的艺术。</em></> : <>Art, written<br />in <em>motion.</em></>}</h1>
          <p>{zh ? "在这里，代码化作光，粒子随时间流动，每一帧都有自己的故事。" : "A little corner of the internet where code becomes light, particles become feelings, and every frame tells a story."}</p>
          <a href="#gallery" className="primary-link">{zh ? "探索作品" : "Explore the collection"} <ArrowUpRight size={18} /></a>
          <div className="hero-meta"><span>{zh ? `${works.length} 件原创作品` : `${works.length} ORIGINAL EXPERIMENTS`}</span><span>{zh ? "浏览器实时渲染" : "LIVE IN YOUR BROWSER"}</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-art-ring ring-a" /><div className="hero-art-ring ring-b" /><div className="hero-art-center" /><div className="hero-art-dot dot-a" /><div className="hero-art-dot dot-b" /><div className="hero-art-dot dot-c" /></div>
        <a href="#gallery" className="scroll-cue">{zh ? "向下滚动探索" : "SCROLL TO EXPLORE"} <ArrowDown size={14}/></a>
      </section>
      <section id="gallery" className="gallery container">
        <div className="section-head"><div><div className="eyebrow small">{zh ? "01 / 作品集" : "01 / THE COLLECTION"}</div><h2>{zh ? "精选作品" : "Selected explorations"}<span className="purple-dot">.</span></h2></div><span className="work-count">{zh ? `${visible.length} 件作品` : `${String(visible.length).padStart(2, "0")} pieces`}</span></div>
        <div className="filters"><div className="filter-list" role="group" aria-label={zh ? "按分类筛选作品" : "Filter artworks"}>{filters.map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? "filter active" : "filter"} onClick={() => setFilter(f)}>{categoryLabel(f, locale)}</button>)}</div>
          <label className="search"><Search size={16} /><input aria-label={zh ? "搜索作品" : "Search works"} value={query} placeholder={zh ? "搜索作品" : "Search artworks"} onChange={e => setQuery(e.target.value)} /></label></div>
        <div className="art-grid">{visible.map(work => { const w = localizedWork(work, locale); return <Link key={w.slug} href={localizedPath(locale, `/animation/${w.slug}`)} className="art-card"><div className={`art-preview ${w.hue}`}><LazyScene slug={w.slug} label={w.name} /><span className="preview-chip"><span className="dot" /> {zh ? "实时作品" : "LIVE ARTWORK"}</span><span className="card-open"><ArrowUpRight size={19} /></span></div><div className="card-bottom"><div><span className="card-index">{String(works.indexOf(work) + 1).padStart(2, "0")} / {w.category.toUpperCase()}</span><h3>{w.name}</h3><p>{w.subtitle}</p></div><span className="card-arrow">↗</span></div></Link>; })}</div>
        {visible.length === 0 && <div className="empty">{zh ? "没有找到符合条件的作品。" : "No artwork matches your search."}<button onClick={() => {setFilter("All works"); setQuery("");}}>{zh ? "清除筛选" : "Clear filters"}</button></div>}
      </section>
      <section className="about container" id="about"><div><div className="eyebrow small">{zh ? "02 / 创作理念" : "02 / THE IDEA"}</div><h2>{zh ? <>用数学构成，<br /><em>用感受理解。</em></> : <>Made of math.<br /><em>Made to feel.</em></>}</h2></div><p>{zh ? "Motion Lab 收录了一系列持续更新的生成艺术实验。每件作品都在浏览器中实时渲染，并公开源码，供你探索。" : "Motion Lab is a growing collection of small experiments in generative art. Every piece is rendered live in your browser, with its source code open for curious minds to explore."}</p></section>
    </main>
    <footer className="footer container"><span>© 2026 Motion Lab · v0.5.1</span><span>{zh ? "使用 Next.js 和 Three.js 构建" : "Built with Next.js + Three.js"}</span></footer>
  </>;
}
