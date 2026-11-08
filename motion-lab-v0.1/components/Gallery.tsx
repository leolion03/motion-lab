"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { works } from "@/lib/works";
import SceneCanvas from "@/components/SceneCanvas";

const filters=["All works","Particles","Seasonal","Space","Abstract"];
export default function Gallery() {
  const [filter,setFilter]=useState("All works");
  const [query,setQuery]=useState("");
  const visible=useMemo(()=>works.filter(w=>(filter==="All works"||w.category===filter) && `${w.name} ${w.description}`.toLowerCase().includes(query.toLowerCase())),[filter,query]);
  return <>
    <header className="topbar container">
      <Link className="brand" href="/"><span className="brand-mark"><Sparkles size={19}/></span><span>MOTION<span className="brand-light">LAB</span></span><span className="brand-version">/ 0.1</span></Link>
      <nav><a href="#gallery">Gallery</a><a href="#about">About</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>
    <main>
      <section className="hero container"><div className="eyebrow"><span className="dot"/> AN EXPERIMENTAL DIGITAL GALLERY <span className="eyebrow-line"/></div>
        <h1>Art, written<br/>in <em>motion.</em></h1>
        <p>A little corner of the internet where code becomes light, particles become feelings, and every frame tells a story.</p>
        <a href="#gallery" className="primary-link">Explore the collection <ArrowUpRight size={18}/></a>
        <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
      </section>
      <section id="gallery" className="gallery container">
        <div className="section-head"><div><div className="eyebrow small">01 / THE COLLECTION</div><h2>Selected explorations<span className="purple-dot">.</span></h2></div><span className="work-count">{String(visible.length).padStart(2,"0")} pieces</span></div>
        <div className="filters"><div className="filter-list">{filters.map(f=><button key={f} className={filter===f?"filter active":"filter"} onClick={()=>setFilter(f)}>{f}</button>)}</div>
          <label className="search"><Search size={16}/><input aria-label="Search works" value={query} placeholder="Search artworks" onChange={e=>setQuery(e.target.value)}/></label></div>
        <div className="art-grid">{visible.map((w,i)=><Link key={w.slug} href={`/animation/${w.slug}`} className="art-card"><div className={`art-preview ${w.hue}`}><SceneCanvas slug={w.slug}/><span className="preview-chip">LIVE ARTWORK</span><span className="card-open"><ArrowUpRight size={19}/></span></div><div className="card-bottom"><div><span className="card-index">{String(works.indexOf(w)+1).padStart(2,"0")} / {w.category.toUpperCase()}</span><h3>{w.name}</h3><p>{w.subtitle}</p></div><span className="card-arrow">↗</span></div></Link>)}</div>
        {visible.length===0 && <p className="empty">No artwork matches this search. Try another keyword.</p>}
      </section>
      <section className="about container" id="about"><div><div className="eyebrow small">02 / THE IDEA</div><h2>Made of math.<br/><em>Made to feel.</em></h2></div><p>Motion Lab is a growing collection of small experiments in generative art. Every piece is rendered live in your browser, with its source code open for curious minds to explore.</p></section>
    </main>
    <footer className="footer container"><span>© 2026 Motion Lab · v0.1</span><span>Built with Next.js + Three.js</span></footer>
  </>;
}
