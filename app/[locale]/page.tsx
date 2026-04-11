import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold gradient-text">{t("title1")} {t("titleHighlight")}</h1>
    </div>
  );
}
