import Link from "next/link";
import NewsShareButtons from "@/components/news/NewsShareButtons";
import type { NewsItem } from "@/components/news/types";

type NewsCardProps = {
  news: NewsItem;
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {news.imageUrl ? (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="mb-4 h-44 w-full rounded-2xl object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="badge badge-outline">{news.category}</span>
        <time className="text-xs text-base-content/60">{news.date}</time>
      </div>

      <h2 className="text-xl font-semibold leading-tight text-base-content">{news.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-base-content/75">{news.excerpt}</p>

      <Link href={`/news/${news.slug}`} className="btn btn-primary btn-sm mt-5">
        Ver articulo
      </Link>

      <NewsShareButtons title={news.title} path={`/news/${news.slug}`} />
    </article>
  );
}
