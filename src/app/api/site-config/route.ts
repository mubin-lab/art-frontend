import { NextResponse } from "next/server";
import data from "@/mocks/site-config.json";

export async function GET() {
  return NextResponse.json(data);
}