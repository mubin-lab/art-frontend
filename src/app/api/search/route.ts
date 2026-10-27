import { NextResponse } from "next/server";
import paintings from "@/mocks/paintings.json";
import artists from "@/mocks/artists.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  if (!q) {
    return NextResponse.json({ paintings: [], artists: [] });
  }

  const pResults = paintings.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.artistName.toLowerCase().includes(q) ||
      p.movement.toLowerCase().includes(q)
  );

  const aResults = artists.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      (a.bio && a.bio.toLowerCase().includes(q))
  );

  return NextResponse.json({ paintings: pResults, artists: aResults });
}