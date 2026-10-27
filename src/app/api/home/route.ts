import { NextResponse } from "next/server";
import data from "@/mocks/home.json";

export async function GET() {
  return NextResponse.json(data);
}