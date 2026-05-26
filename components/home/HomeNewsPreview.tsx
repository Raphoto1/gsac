import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import { getNewsSectionVisibilityService, getPublicNewsService } from "@/apiPack/service/news.service";
import { getLocale } from "next-intl/server";

export default async function HomeNewsPreview() {
  const locale = await getLocale();
  const { newsEnabled } = await getNewsSectionVisibilityService();
  if (!newsEnabled) {
    return null;
  }

  const { news } = await getPublicNewsService();
  const latestNews = news.slice(0, 3);
  const hasMoreNews = news.length > latestNews.length;

  return (
    <section className="bg-base-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Novedades</p>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">Ultimas noticias</h2>
          <p className="mt-2 text-sm text-base-content/70">
            Las tres actualizaciones mas recientes de GSAC.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} locale={locale === "en" ? "en" : "es"} />
          ))}
        </div>

        {hasMoreNews ? (
          <div className="mt-8 flex justify-center">
            <Link href="/news" className="btn btn-primary">
              Ver todas las novedades
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
