import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("about");

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg">{t("description")}</p>
    </div>
  );
}
