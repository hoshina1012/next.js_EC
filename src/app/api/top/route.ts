import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        stock: true,
        user: {
          select: {
            id: true,   // ユーザーのID
            name: true, // ユーザーの名前
          }
        },
        category: {
          select: {
            id: true,   // カテゴリのID
            name: true, // カテゴリの名前
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("商品取得エラー:", error);
    return NextResponse.json({ error: "商品取得に失敗しました" }, { status: 500 });
  }
}
