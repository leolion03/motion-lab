export type Work = {
  slug: "particle-heart" | "christmas-tree" | "spiral-galaxy" | "particle-wave";
  name: string;
  subtitle: string;
  category: string;
  hue: string;
  description: string;
  count: string;
};
export const works: Work[] = [
  { slug: "particle-heart", name: "Particle Heart", subtitle: "A thousand little feelings", category: "Particles", hue: "rose", description: "A glowing heart sculpted from thousands of points, slowly spinning in the dark.", count: "4.2K" },
  { slug: "christmas-tree", name: "Christmas Tree", subtitle: "An endless winter wish", category: "Seasonal", hue: "gold", description: "A luminous Christmas tree traced by glittering stars and a winding ribbon.", count: "4.5K" },
  { slug: "spiral-galaxy", name: "Spiral Galaxy", subtitle: "Somewhere beyond the stars", category: "Space", hue: "violet", description: "A shimmering galaxy with arms that drift slowly around a bright center.", count: "6K" },
  { slug: "particle-wave", name: "Particle Wave", subtitle: "Rhythm made visible", category: "Abstract", hue: "cyan", description: "A flowing field of points that ripples like an ocean of light.", count: "3.6K" },
];
export const getWork = (slug: string) => works.find((item) => item.slug === slug);
