import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
 title: "Motion Lab 动态艺术馆",
 description: "使用 Three.js 实时渲染的生成式粒子艺术画廊。"
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>}
