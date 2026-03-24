import Contact from "@/components/home/Contact";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("contact");

  return (
<div className="min-h-screen flex items-center justify-center">
      <Contact />
</div>
  );
}
