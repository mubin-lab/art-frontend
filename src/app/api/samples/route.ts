import { NextResponse } from "next/server";
import data from "@/mocks/samples.json";

export async function GET() {
  return NextResponse.json(data);
}