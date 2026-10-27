import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import initialOrders from "@/mocks/orders.json";
import type { Order } from "@/types";

const DATA_FILE = path.join(process.cwd(), "src/mocks/orders.json");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const content = await fs.readFile(DATA_FILE, "utf-8");
    const orders: Order[] = JSON.parse(content);

    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    orders[index] = {
      ...orders[index],
      ...body
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return NextResponse.json(orders[index]);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
