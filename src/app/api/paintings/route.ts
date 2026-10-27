import { NextResponse } from "next/server";
import data from "@/mocks/paintings.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let list = [...data];

  if (searchParams.get("bestseller") === "true") {
    list = list.filter((p) => p.bestseller);
  }
  if (searchParams.get("top100") === "true") {
    list = list.filter((p) => p.top100Rank !== undefined).sort((a, b) => (a.top100Rank || 999) - (b.top100Rank || 999));
  }
  const artist = searchParams.get("artistSlug");
  if (artist) {
    list = list.filter((p) => p.artistSlug === artist);
  }
  const movement = searchParams.get("movement");
  if (movement) {
    list = list.filter((p) => p.movement.toLowerCase() === movement.toLowerCase());
  }
  const limit = searchParams.get("limit");
  if (limit) {
    list = list.slice(0, parseInt(limit, 10));
  }

  return NextResponse.json(list);
}