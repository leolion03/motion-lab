import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Motion Lab — Art, written in motion",
 description: "An experimental gallery of real-time generative particle art built with Three.js."
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
