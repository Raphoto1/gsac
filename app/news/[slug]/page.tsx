import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import NewsShareButtons from "@/components/news/NewsShareButtons";
import { getNewsBySlug, sampleNews } from "@/components/news/newsData";
import { buildPageMetadata } from "@/lib/seo";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sampleNews.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const [{ slug }, locale, t] = await Promise.all([params, getLocale(), getTranslations("seo")]);
  const article = getNewsBySlug(slug);

  if (!article) {
    return {
      title: t("articleNotFoundTitle"),
      description: t("articleNotFoundDescription"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    locale,
    image: article.imageUrl,
    type: "article",
    keywords: [article.category, "GSAC", "novedades", "articulo"],
  });
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center text-sm font-medium text-primary transition-opacity hover:opacity-80"
      >
        Volver a novedades
      </Link>

      <header className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm text-base-content/70">
          <span className="badge badge-outline">{article.category}</span>
          <time>{article.date}</time>
        </div>

        <h1 className="text-3xl font-bold leading-tight text-base-content sm:text-4xl">{article.title}</h1>
        <p className="text-base leading-relaxed text-base-content/75">{article.excerpt}</p>
        <NewsShareButtons title={article.title} path={`/news/${article.slug}`} />
      </header>

      {article.imageUrl ? (
        <img src={article.imageUrl} alt={article.title} className="mb-8 h-72 w-full rounded-3xl object-cover" />
      ) : null}

      <div className="space-y-5">
        {article.content.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-base-content/85">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
