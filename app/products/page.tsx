import BigCardProps from "@/components/BigCardProps";
import CardBasicProp from "@/components/CardBasicProp";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("products");
  const products = [
    { title: "Product 1", description: "Description 1" },
    { title: "Product 2", description: "Description 2" },
    { title: "Product 3", description: "Description 3" },
    { title: "Product 4", description: "Description 4" },
  ];

  return (
    <div>
      <BigCardProps title={t("title")} description={t("description")} imageUrl='https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg' />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 justify-center items-center">
        {products.map((product, index) => (
          <CardBasicProp
            key={product.title}
            title={product.title}
            description={product.description}
            color={index % 2 === 0 ? "primary" : "secondary"}
          />
        ))}
      </div>
    </div>
  );
}
