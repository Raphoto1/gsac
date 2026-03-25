import BigCardProps from "@/components/BigCardProps";
import CardBasicProp from "@/components/CardBasicProp";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("products");
  const products = [
    { title: "Product 1", description: "Description Basic1", expandTitle: "Expand Product 1", expandText: "Detailed description of Product 1"  },
    { title: "Product 2", description: "Description Basic2", expandTitle: "Expand Product 2", expandText: "Detailed description of Product 2" , expandImagage: "https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg" },
    { title: "Product 3", description: "Description Basic3" },
    { title: "Product 4", description: "Description Basic4" },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <BigCardProps title={t("title")} description={t("description")} imageUrl='https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg' />
      <div className="flex flex-col gap-4 p-8 w-full max-w-2xl">
        {products.map((product, index) => (
          <div key={product.title} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <CardBasicProp
              title={product.title}
              description={product.description}
              color={index % 2 === 0 ? "primary" : "secondary"}
              side={index % 2 === 0 ? "left" : "right"}
              delayIndex={index}
              expandText={product.expandText}
              expandTitle={product.expandTitle}
              expandImage={product.expandImagage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
