import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import NewsShareButtons from "@/components/news/NewsShareButtons";
import { getNewsBySlugService, getPublicNewsService } from "@/apiPack/service/news.service";
import { buildPageMetadata } from "@/lib/seo";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { news } = await getPublicNewsService();
  return news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const [{ slug }, locale, t] = await Promise.all([params, getLocale(), getTranslations("seo")]);
  const article = await getNewsBySlugService(slug);

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

  const localizedTitle = locale === "en" && article.title_en ? article.title_en : article.title;
  const localizedExcerpt = locale === "en" && article.excerpt_en ? article.excerpt_en : article.excerpt;
  const localizedCategory = locale === "en" && article.category_en ? article.category_en : article.category;

  return buildPageMetadata({
    title: localizedTitle,
    description: localizedExcerpt,
    path: `/news/${article.slug}`,
    locale,
    image: article.imageUrl,
    type: "article",
    keywords: [localizedCategory, "GSAC", "novedades", "articulo"],
  });
}

function isHtmlContent(content: string): boolean {
  return /<\s*\w+[^>]*>/.test(content);
}

function ArticleContentBlock({ content }: { content: string }) {
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    return null;
  }

  if (isHtmlContent(normalizedContent)) {
    return (
      <div
        className="news-article-content"
        dangerouslySetInnerHTML={{ __html: normalizedContent }}
      />
    );
  }

  return <p className="text-base leading-relaxed text-base-content/85">{normalizedContent}</p>;
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const article = await getNewsBySlugService(slug);

  if (!article) {
    notFound();
  }

  const localizedTitle = locale === "en" && article.title_en ? article.title_en : article.title;
  const localizedExcerpt = locale === "en" && article.excerpt_en ? article.excerpt_en : article.excerpt;
  const localizedCategory = locale === "en" && article.category_en ? article.category_en : article.category;
  const localizedContent = locale === "en" && article.content_en?.length ? article.content_en : article.content;

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
          <span className="badge badge-outline">{localizedCategory}</span>
          <time>{article.date}</time>
        </div>

        <h1 className="text-3xl font-bold leading-tight text-base-content sm:text-4xl">{localizedTitle}</h1>
        <p className="text-base leading-relaxed text-base-content/75">{localizedExcerpt}</p>
        <NewsShareButtons title={localizedTitle} path={`/news/${article.slug}`} locale={locale === "en" ? "en" : "es"} />
      </header>

      {article.imageUrl ? (
        <img src={article.imageUrl} alt={localizedTitle} className="mb-8 h-72 w-full rounded-3xl object-cover" />
      ) : null}

      <div className="space-y-5">
        {localizedContent.map((paragraph, index) => (
          <ArticleContentBlock key={`${index}-${paragraph.slice(0, 24)}`} content={paragraph} />
        ))}
      </div>
    </article>
  );
}
