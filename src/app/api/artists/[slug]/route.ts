import { NextResponse } from "next/server";
import data from "@/mocks/artists.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artist = data.find((a) => a.slug === slug);
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
  return NextResponse.json(artist);
}