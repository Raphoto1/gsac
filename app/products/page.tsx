import BigCardProps from "@/components/BigCardProps";
import ProductsList from "@/components/products/ProductsList";
import Cases from "@/components/home/Cases";
import type { ProductItem } from "@/components/products/ProductsList";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("products");
  const products: ProductItem[] = [
    {
      title: "Product 1",
      description: "Description Basic1",
      icon: "business",
      expandTitle: "Expand Product 1",
      expandText: "Detailed description of Product 1",
    },
    {
      title: "Product 2",
      description: "Description Basic2",
      icon: "rocket",
      expandTitle: "Expand Product 2",
      expandText: "Detailed description of Product 2",
      expandImagage: "https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg",
    },
    {
      title: "Product 3",
      description: "Description Basic3",
      icon: "globe",
      expandTitle: "Expand Product 3",
      expandText: "Detailed description of Product 3",
    },
    {
      title: "Product 4",
      description: "Description Basic4",
      icon: "settings",
      expandTitle: "Expand Product 4",
      expandText: "Detailed description of Product 4",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center min-w-full">
      <BigCardProps title={t("title")} description={t("description")} imageUrl='https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg' />
      <ProductsList products={products} />
      <Cases />
    </div>
  );
}
