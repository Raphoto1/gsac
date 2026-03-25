import CardBasicProp from "@/components/CardBasicProp";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";

export type ProductItem = {
  title: string;
  description: string;
  icon?: "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";
  expandTitle?: string;
  expandText?: string;
  expandImagage?: string;
};

type ProductsListProps = {
  products: ProductItem[];
};

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="relative w-full max-w-screen overflow-hidden justify-center items-center bg-base-200 px-4 py-10">
      {/* <GeometricLinesBackground /> */}
      <div className="flex justify-center">
        <div className="relative z-20 flex w-full max-w-2xl flex-col gap-4 p-8">
          {products.map((product, index) => (
            <div key={product.title} className={`flex w-full ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <CardBasicProp
                title={product.title}
                description={product.description}
                icon={product.icon}
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
    </div>
  );
}
