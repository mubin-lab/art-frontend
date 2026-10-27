import { NextResponse } from "next/server";
import data from "@/mocks/paintings.json";
import { parsePaintingParam } from "@/lib/utils/paintingUrl";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawParam } = await params;
  const { id, slug } = parsePaintingParam(rawParam);

  const painting = data.find((p) => {
    if (id && p.id.toLowerCase() === id.toLowerCase()) return true;
    if (slug && p.slug.toLowerCase() === slug.toLowerCase()) return true;
    return (
      p.id.toLowerCase() === rawParam.toLowerCase() ||
      p.slug.toLowerCase() === rawParam.toLowerCase()
    );
  });

  if (!painting) {
    return NextResponse.json({ error: "Painting not found" }, { status: 404 });
  }
  return NextResponse.json(painting);
}
