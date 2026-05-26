import { prisma } from "@/lib/prisma";
import type { HomeProductItem, HomeProductsHeader } from "@/types/home-products";

export type HomeProductsRecord = {
  header: HomeProductsHeader | null;
  products: HomeProductItem[];
};

type HomeProductHeaderRow = {
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  secondaryDescriptionEs: string;
  secondaryDescriptionEn: string;
  imageUrl: string | null;
};

type HomeProductEntryRow = {
  position: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string;
  expandTitleEs: string;
  expandTitleEn: string;
  expandTextEs: string;
  expandTextEn: string;
  expandImageUrl: string | null;
};

const HOME_PRODUCTS_HEADER_ID = "home_products_header";

function mapHeaderRowToData(row: HomeProductHeaderRow): HomeProductsHeader {
  return {
    title: { es: row.titleEs, en: row.titleEn },
    description: { es: row.descriptionEs, en: row.descriptionEn },
    secondaryDescription: { es: row.secondaryDescriptionEs, en: row.secondaryDescriptionEn },
    imageUrl: row.imageUrl ?? "",
  };
}

function mapHeaderDataToRow(header: HomeProductsHeader) {
  return {
    titleEs: header.title.es,
    titleEn: header.title.en,
    descriptionEs: header.description.es,
    descriptionEn: header.description.en,
    secondaryDescriptionEs: header.secondaryDescription.es,
    secondaryDescriptionEn: header.secondaryDescription.en,
    imageUrl: header.imageUrl || null,
  };
}

function mapProductRowToData(row: HomeProductEntryRow): HomeProductItem {
  return {
    id: row.position,
    title: { es: row.titleEs, en: row.titleEn },
    description: { es: row.descriptionEs, en: row.descriptionEn },
    icon: row.icon as HomeProductItem["icon"],
    expandTitle: { es: row.expandTitleEs, en: row.expandTitleEn },
    expandText: { es: row.expandTextEs, en: row.expandTextEn },
    expandImage: row.expandImageUrl ?? "",
  };
}

function mapProductDataToRow(product: HomeProductItem, index: number) {
  return {
    position: index + 1,
    titleEs: product.title.es,
    titleEn: product.title.en,
    descriptionEs: product.description.es,
    descriptionEn: product.description.en,
    icon: product.icon,
    expandTitleEs: product.expandTitle.es,
    expandTitleEn: product.expandTitle.en,
    expandTextEs: product.expandText.es,
    expandTextEn: product.expandText.en,
    expandImageUrl: product.expandImage || null,
  };
}

export async function getHomeProductsFromDb(): Promise<HomeProductsRecord> {
  const [header, products] = await prisma.$transaction([
    prisma.homeProductsHeader.findUnique({
      where: { id: HOME_PRODUCTS_HEADER_ID },
      select: {
        titleEs: true,
        titleEn: true,
        descriptionEs: true,
        descriptionEn: true,
        secondaryDescriptionEs: true,
        secondaryDescriptionEn: true,
        imageUrl: true,
      },
    }),
    prisma.homeProductEntry.findMany({
      orderBy: { position: "asc" },
      select: {
        position: true,
        titleEs: true,
        titleEn: true,
        descriptionEs: true,
        descriptionEn: true,
        icon: true,
        expandTitleEs: true,
        expandTitleEn: true,
        expandTextEs: true,
        expandTextEn: true,
        expandImageUrl: true,
      },
    }),
  ]);

  return {
    header: header ? mapHeaderRowToData(header) : null,
    products: products.map(mapProductRowToData),
  };
}

export async function upsertHomeProductsInDb(data: {
  header: HomeProductsHeader;
  products: HomeProductItem[];
}): Promise<HomeProductsRecord> {
  await prisma.$transaction([
    prisma.homeProductsHeader.upsert({
      where: { id: HOME_PRODUCTS_HEADER_ID },
      create: {
        id: HOME_PRODUCTS_HEADER_ID,
        ...mapHeaderDataToRow(data.header),
      },
      update: mapHeaderDataToRow(data.header),
    }),
    prisma.homeProductEntry.deleteMany({}),
    ...(data.products.length
      ? [
          prisma.homeProductEntry.createMany({
            data: data.products.map(mapProductDataToRow),
          }),
        ]
      : []),
  ]);

  return {
    header: data.header,
    products: data.products,
  };
}
