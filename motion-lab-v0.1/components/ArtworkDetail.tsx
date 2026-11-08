"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Code2, Copy, ExternalLink, Maximize2, X } from "lucide-react";
import { getWork, works } from "@/lib/works";
import SceneCanvas from "@/components/SceneCanvas";

const files: Record<string,string> = {
 "particle-heart":"ParticleHeart.tsx", "christmas-tree":"ChristmasTree.tsx", "spiral-galaxy":"SpiralGalaxy.tsx", "particle-wave":"ParticleWave.tsx"
};
export default function ArtworkDetail({slug}:{slug:string}) {
 const work=getWork(slug);
 const [source,setSource]=useState("");
 const [copied,setCopied]=useState(false);
 const [full,setFull]=useState(false);
 const [showCode,setShowCode]=useState(false);
 useEffect(()=>{
   if(!work)return;
   let canceled=false;
   fetch(`/source/${files[work.slug]}`).then(r=>{if(!r.ok)throw Error("Source unavailable");return r.text()}).then(s=>{if(!canceled)setSource(s)}).catch(()=>{if(!canceled)setSource("Source unavailable")});
   return ()=>{canceled=true};
 },[work?.slug]);
 useEffect(()=>{
   if(!full)return;
   const handler=(e:KeyboardEvent)=>{if(e.key==="Escape")setFull(false)};
   window.addEventListener("keydown",handler);return ()=>window.removeEventListener("keydown",handler);
 },[full]);
 if(!work)return <div className="not-found"><h1>Artwork not found</h1><Link href="/">← Back to gallery</Link></div>;
 return <main className="detail container">
   <div className="detail-top"><Link href="/" className="back"><ArrowLeft size={16}/> Back to gallery</Link><span>MOTION LAB / ARTWORK {String(works.indexOf(work)+1).padStart(2,"0")}</span></div>
   <div className="detail-heading"><div><div className="eyebrow small">INTERACTIVE ARTWORK · {work.category.toUpperCase()}</div><h1>{work.name}<span className="purple-dot">.</span></h1><p>{work.description}</p></div><span className="detail-type">THREE.JS / WEBGL</span></div>
   <div className={full?"detail-canvas fullscreen":"detail-canvas"}><SceneCanvas key={work.slug} slug={work.slug} large/>
     <span className="live-indicator"><span className="dot"/> LIVE RENDER</span>
     <button className="fullscreen-button" title={full?"Exit fullscreen":"Fullscreen"} aria-label={full?"Exit fullscreen":"Fullscreen"} onClick={()=>setFull(v=>!v)}>{full?<X size={19}/>:<Maximize2 size={19}/>}</button>
   </div>
   <div className="detail-actions"><div><strong>{work.count}</strong><small>PARTICLES</small></div><div><strong>60 FPS*</strong><small>REAL-TIME RENDER</small></div><div><strong>01</strong><small>ORIGINAL STUDY</small></div><button onClick={()=>setShowCode(v=>!v)} className="source-toggle"><Code2 size={17}/>{showCode?"Hide source":"View source"}<ArrowUpRight size={16}/></button></div>
   {showCode && <section className="source-panel"><div className="source-head"><div><Code2 size={17}/> {files[work.slug]}</div><button onClick={async()=>{try{await navigator.clipboard.writeText(source);setCopied(true);setTimeout(()=>setCopied(false),1600)}catch{setCopied(false)}}}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Copied":"Copy code"}</button></div><pre><code>{source||"Loading source..."}</code></pre><p className="source-note">This is the artwork component. See the README for the complete app setup and canvas wrapper.</p></section>}
   <div className="detail-next"><Link href="/">← All artworks</Link><Link href={`/animation/${works[(works.indexOf(work)+1)%works.length].slug}`}>Next artwork <ArrowUpRight size={16}/></Link></div>
   <footer className="footer"><span>© 2026 Motion Lab · v0.1</span><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13}/></a></footer>
 </main>;
}
