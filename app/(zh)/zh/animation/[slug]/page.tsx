import ArtworkDetail from "@/components/ArtworkDetail";
import { works } from "@/lib/works";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return works.map(({ slug }) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!works.some(work => work.slug === slug)) notFound();
  return <ArtworkDetail slug={slug} locale="zh" />;
}
