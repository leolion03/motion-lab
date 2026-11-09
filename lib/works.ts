export type Work = {
  slug: "particle-heart" | "christmas-tree" | "spiral-galaxy" | "particle-wave" | "jellyfish" | "blooming-flower" | "butterfly" | "saturn" | "fountain" | "birthday-cake";
  name: string;
  subtitle: string;
  category: string;
  hue: string;
  description: string;
  count: string;
};
export const works: Work[] = [
  {slug:"particle-heart",name:"Particle Heart",subtitle:"A thousand little feelings",category:"Particles",hue:"rose",description:"A rotating heart sculpted from thousands of delicate points.",count:"7.9K"},
  {slug:"christmas-tree",name:"Christmas Tree",subtitle:"An endless winter wish",category:"Seasonal",hue:"gold",description:"A layered Christmas tree with a gold ribbon and particle star.",count:"8.6K"},
  {slug:"spiral-galaxy",name:"Spiral Galaxy",subtitle:"Somewhere beyond the stars",category:"Space",hue:"violet",description:"Four colorful arms swirling around a luminous galactic center.",count:"10.4K"},
  {slug:"particle-wave",name:"Particle Wave",subtitle:"Rhythm made visible",category:"Abstract",hue:"cyan",description:"A field of particles flowing like an ocean.",count:"6.4K"},
  {slug:"jellyfish",name:"Moon Jellyfish",subtitle:"Dancing in deep water",category:"Nature",hue:"violet",description:"A drifting jellyfish built from fine dots and floating tentacles.",count:"8.7K"},
  {slug:"blooming-flower",name:"Twin Blossoms",subtitle:"Two flowers, one story",category:"Nature",hue:"rose",description:"Two interwoven blooms in rose and violet with stems and drifting petals.",count:"11.9K"},
  {slug:"butterfly",name:"Monarch Butterfly",subtitle:"An orange-winged migration",category:"Nature",hue:"gold",description:"A monarch-inspired butterfly with orange wings, dark veins, pale spots and gently beating wings.",count:"12.0K"},
  {slug:"saturn",name:"Saturn Rings",subtitle:"An orbit of golden dust",category:"Space",hue:"gold",description:"A golden ringed planet with fine orbiting particles.",count:"11.8K"},
  {slug:"fountain",name:"Particle Fountain",subtitle:"Water drawn with code",category:"Nature",hue:"cyan",description:"Streams of water particles rise, curve and fall into a circular pool.",count:"6.9K"},
  {slug:"birthday-cake",name:"Birthday Cake",subtitle:"Make a wish",category:"Seasonal",hue:"rose",description:"A two-tier particle cake with frosting, five candles and floating confetti.",count:"10.9K"}
];
export const getWork = (slug: string) => works.find((item) => item.slug === slug);
