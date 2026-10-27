import { NextResponse } from "next/server";
import data from "@/mocks/articles.json";

export async function GET() {
  return NextResponse.json(data);
}