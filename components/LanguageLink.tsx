import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

export default function LanguageLink({ locale, path }: { locale: Locale; path?: string }) {
  const target = locale === "en" ? "zh" : "en";
  return (
    <Link href={localizedPath(target, path)} hrefLang={target === "zh" ? "zh-CN" : "en"} lang={target === "zh" ? "zh-CN" : "en"}>
      {target === "zh" ? "中文" : "English"}
    </Link>
  );
}
