import Link from "next/link";
import NewsShareButtons from "@/components/news/NewsShareButtons";
import type { NewsItem } from "@/types/news";

type NewsLocale = "es" | "en";

function isHtmlContent(value: string): boolean {
  return /<\s*\w+[^>]*>/.test(value);
}

function truncateText(value: string, maxLength = 140): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getNewsSample(content: string[]): string | null {
  const firstContent = content[0];

  if (!firstContent) {
    return null;
  }

  if (isHtmlContent(firstContent)) {
    return firstContent;
  }

  const plainText = firstContent.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

  if (!plainText) {
    return null;
  }

  return truncateText(plainText);
}

function isHtmlSample(contentSample: string): boolean {
  return isHtmlContent(contentSample);
}

type NewsCardProps = {
  news: NewsItem;
  locale?: NewsLocale;
};

export default function NewsCard({ news, locale = "es" }: NewsCardProps) {
  const title = locale === "en" && news.title_en ? news.title_en : news.title;
  const category = locale === "en" && news.category_en ? news.category_en : news.category;
  const excerpt = locale === "en" && news.excerpt_en ? news.excerpt_en : news.excerpt;
  const content = locale === "en" && news.content_en?.length ? news.content_en : news.content;
  const articleCta = locale === "en" ? "Read article" : "Ver articulo";
  const contentSample = getNewsSample(content);

  return (
    <article className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {news.imageUrl ? (
        <img
          src={news.imageUrl}
          alt={title}
          className="mb-4 h-44 w-full rounded-2xl object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="badge badge-outline">{category}</span>
        <time className="text-xs text-base-content/60">{news.date}</time>
      </div>

      <h2 className="text-xl font-semibold leading-tight text-base-content">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-base-content/75">{excerpt}</p>
      {contentSample ? (
        isHtmlSample(contentSample) ? (
          <div className="news-card-rich-preview mt-2" dangerouslySetInnerHTML={{ __html: contentSample }} />
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-base-content/60">{contentSample}</p>
        )
      ) : null}

      <Link href={`/news/${news.slug}`} className="btn btn-primary btn-sm mt-5">
        {articleCta}
      </Link>

      <NewsShareButtons title={title} path={`/news/${news.slug}`} locale={locale} />
    </article>
  );
}
