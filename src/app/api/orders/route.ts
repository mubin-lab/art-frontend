import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import initialOrders from "@/mocks/orders.json";
import type { Order } from "@/types";

const DATA_FILE = path.join(process.cwd(), "src/mocks/orders.json");

async function getOrdersData(): Promise<Order[]> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return initialOrders as Order[];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let orders = await getOrdersData();
  if (status && status !== "All") {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orders = await getOrdersData();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      deliveryAddress: body.deliveryAddress,
      city: body.city || "Dhaka",
      paymentMethod: body.paymentMethod || "Cash on Delivery (COD)",
      items: body.items || [],
      subtotal: body.subtotal || 0,
      deliveryFee: body.deliveryFee || 0,
      totalAmount: body.totalAmount || 0,
      status: "Pending",
      createdAt: new Date().toISOString(),
      notes: body.notes || ""
    };

    orders.unshift(newOrder);
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
