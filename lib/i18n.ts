import type { Work } from "@/lib/works";

export type Locale = "en" | "zh";

export function localizedPath(locale: Locale, path = "/") {
  return locale === "zh" ? (path === "/" ? "/zh" : "/zh" + path) : path;
}

const categories: Record<string, string> = {
  "All works": "全部作品", Game: "游戏", Particles: "粒子", Seasonal: "节日",
  Space: "太空", Abstract: "抽象", Nature: "自然",
};

const artworks: Record<Work["slug"], [name: string, subtitle: string, description: string]> = {
  "primogem": ["纠缠之缘", "两种颜色交织的心愿", "灵感来自纠缠之缘。粉色与蓝色的星形交叠，粒子丝带环绕其间。"],
  "particle-heart": ["粒子之心", "细小粒子汇成心意", "数千颗细小粒子组成一颗缓缓旋转的心。"],
  "christmas-tree": ["圣诞树", "绵延的冬日祝愿", "层叠的圣诞树缠着金色丝带，树顶是一颗粒子星。"],
  "spiral-galaxy": ["旋涡星系", "群星之外", "四道彩色旋臂绕着明亮的星系中心旋转。"],
  "particle-wave": ["粒子波浪", "看得见的节奏", "一片粒子像海浪一样起伏流动。"],
  "jellyfish": ["月亮水母", "深海之舞", "细小光点勾勒出漂浮的水母与柔软的触须。"],
  "blooming-flower": ["双花绽放", "两朵花，一个故事", "玫红与紫色的花朵相互交织，花瓣随风飘动。"],
  "butterfly": ["帝王蝶", "橙色翅膀的迁徙", "橙色翅膀轻轻扇动，深色翅脉间点缀着浅色斑点。"],
  "saturn": ["土星环", "金色微尘的轨道", "细小的金色粒子环绕着一颗带光环的行星。"],
  "fountain": ["粒子喷泉", "用代码绘出的流水", "粒子水流向上喷涌，划出弧线后落入圆形水池。"],
  "birthday-cake": ["生日蛋糕", "许个愿吧", "双层粒子蛋糕上有糖霜和五根蜡烛，彩纸在空中飘落。"],
  "four-leaf-clover": ["四叶草", "用代码编织的好运", "带着弯曲叶茎的四叶草轻轻摇摆，周围闪烁着细小光点。"],
  "mobius-loop": ["莫比乌斯环", "扭转半圈的丝带", "青色与淡紫色的粒子沿着扭转的丝带流动。横向拖动可倾斜丝带。"],
};

export function categoryLabel(category: string, locale: Locale) {
  return locale === "zh" ? categories[category] ?? category : category;
}

export function localizedWork(work: Work, locale: Locale): Work {
  if (locale === "en") return work;
  const [name, subtitle, description] = artworks[work.slug];
  return { ...work, name, subtitle, description, category: categoryLabel(work.category, locale) };
}
