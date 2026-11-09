"use client";
import { useEffect, useRef, useState } from "react";
import SceneCanvas from "@/components/SceneCanvas";
import type { Work } from "@/lib/works";

// Only allocate a WebGL context near the viewport. Ten simultaneous Canvas
// instances can exceed the context limit on phones and some laptops.
export default function LazyScene({ slug }: { slug: Work["slug"] }) {
  const node = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!node.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(node.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={node} style={{ width: "100%", height: "100%" }}>
    {visible && <SceneCanvas slug={slug} />}
  </div>;
}
