import { NextResponse } from "next/server";
import data from "@/mocks/articles.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const article = data.find((a) => a.slug === fullSlug);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}