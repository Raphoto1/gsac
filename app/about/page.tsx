import { useTranslations } from "next-intl";
import BigCardProps from "@/components/BigCardProps";

export default function Page() {
  const t = useTranslations("about");

  return (
    <div>
      <BigCardProps
        title={t("title")}
        description={t("description")}
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
      />
    </div>
  );
}
