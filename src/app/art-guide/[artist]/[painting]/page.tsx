import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getPaintingBySlug } from "@/lib/api";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleTabs } from "@/components/article/ArticleTabs";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleTOC } from "@/components/article/ArticleTOC";
import { InlineBuyCard } from "@/components/article/InlineBuyCard";
import { AuthorCard } from "@/components/article/AuthorCard";
import { SeriesList } from "@/components/article/SeriesList";

interface ArticlePageProps {
  params: Promise<{
    artist: string;
    painting: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { artist, painting } = await params;
  const slug = `${artist}/${painting}`;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | YourMuseum" };
  }

  return {
    title: `${article.title} | YourMuseum Art Guide`,
    description: `Comprehensive analysis, symbolism, and history of ${article.title} by ${article.artist}. Recreated in museum-quality oil on canvas.`,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { artist, painting } = await params;
  const slug = `${artist}/${painting}`;

  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const relatedPainting = await getPaintingBySlug(article.paintingSlug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    datePublished: "2024-01-01",
    description: `${article.title} by ${article.artist} analysis and curatorial guide.`,
  };

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-12">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-muted)] font-sans mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/art-guide" className="hover:text-black">
            Painting Analysis
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-semibold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 4-Tab Strip */}
        <ArticleTabs article={article} />

        {/* Header Region */}
        <ArticleHeader article={article} />

        {/* Meta Facts Grid */}
        <ArticleMeta article={article} />

        {/* 2-Column Body (Left Article ~680-720px, Right Sticky Sidebar ~280-320px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4">
          {/* Main Article Column */}
          <div className="lg:col-span-8 max-w-[720px]">
            <ArticleBody blocks={article.blocks} />

            {/* Author Card */}
            <AuthorCard author={article.author} />
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* In This Article TOC */}
              <ArticleTOC toc={article.toc} />

              {/* Inline Buy Card */}
              {relatedPainting && <InlineBuyCard painting={relatedPainting} />}

              {/* Series List */}
              <SeriesList series={article.series} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}