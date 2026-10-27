import { NextResponse } from "next/server";
import data from "@/mocks/reviews.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let list = [...data];
  if (searchParams.get("featured") === "true") {
    list = list.slice(0, 5);
  }
  return NextResponse.json(list);
}