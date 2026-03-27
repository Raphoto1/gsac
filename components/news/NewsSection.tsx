import NewsCard from "@/components/news/NewsCard";
import { sampleNews } from "@/components/news/newsData";

export default function NewsSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Novedades</p>
        <h1 className="mt-3 text-3xl font-bold text-base-content sm:text-4xl">Noticias y actualizaciones</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-base-content/75">
          Un espacio con novedades relevantes de la empresa, lanzamientos y actividades recientes.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sampleNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </section>
  );
}
