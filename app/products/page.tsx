import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import BigCardProps from "@/components/BigCardProps";
import ProductsList from "@/components/products/ProductsList";
import Cases from "@/components/home/Cases";
import type { ProductItem } from "@/components/products/ProductsList";
import { buildPageMetadata } from "@/lib/seo";
import { getHomeProductsService } from "@/apiPack/service/products.service";
import {
  DEFAULT_HOME_PRODUCTS,
  DEFAULT_HOME_PRODUCTS_HEADER,
  type HomeProductItem,
  type HomeProductsHeader,
} from "@/types/home-products";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("productsTitle"),
    description: t("productsDescription"),
    path: "/products",
    locale,
    keywords: ["productos GSAC", "soluciones empresariales", "catalogo de soluciones", "consultoria"],
  });
}

function resolveLocalized(value: { es: string; en: string }, locale: "es" | "en") {
  return locale === "en" ? value.en : value.es;
}

function mapProductsForLocale(products: HomeProductItem[], locale: "es" | "en"): ProductItem[] {
  return products.map((product) => ({
    title: resolveLocalized(product.title, locale),
    description: resolveLocalized(product.description, locale),
    icon: product.icon,
    expandTitle: resolveLocalized(product.expandTitle, locale),
    expandText: resolveLocalized(product.expandText, locale),
    expandImage: product.expandImage,
  }));
}

export default async function Page() {
  const locale = await getLocale();
  const safeLocale: "es" | "en" = locale === "en" ? "en" : "es";

  let header: HomeProductsHeader = DEFAULT_HOME_PRODUCTS_HEADER;
  let products: HomeProductItem[] = [];

  try {
    const response = await getHomeProductsService();
    header = response.header;
    products = response.products;
  } catch {
    // Keep defaults if the API/service is unavailable.
  }

  const productsForRender = mapProductsForLocale(
    products.length ? products : DEFAULT_HOME_PRODUCTS,
    safeLocale,
  );

  const productsSectionTexts = safeLocale === "en"
    ? {
      label: "Products",
      title: "Connected solutions",
      description: "A network of services and products designed to operate together, with the same visual language as the company ecosystem.",
    }
    : {
      label: "Productos",
      title: "Soluciones conectadas",
      description: "Una red de servicios y productos pensada para operar en conjunto, con el mismo lenguaje visual del ecosistema de empresas.",
    };

  return (
    <div className="flex flex-col justify-center items-center min-w-full">
      <BigCardProps
        title={resolveLocalized(header.title, safeLocale)}
        description={resolveLocalized(header.description, safeLocale)}
        secondaryDescription={resolveLocalized(header.secondaryDescription, safeLocale)}
        imageUrl={header.imageUrl}
      />
      <ProductsList
        products={productsForRender}
        sectionLabel={productsSectionTexts.label}
        sectionTitle={productsSectionTexts.title}
        sectionDescription={productsSectionTexts.description}
      />
      <Cases />
    </div>
  );
}
