import ArtworkDetail from "@/components/ArtworkDetail";
import { works } from "@/lib/works";
export function generateStaticParams(){return works.map(w=>({slug:w.slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ArtworkDetail slug={slug}/>;}
