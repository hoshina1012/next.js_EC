import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 5; // 1ページあたり5件表示

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;

    // 商品情報を取得
    const products = await prisma.products.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        userId: true,
        categoryId: true,
        category: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    // 販売累計を取得
    const productData = await Promise.all(
      products.map(async (product) => {
        const salesTotal = await prisma.orderItems.aggregate({
          where: { productId: product.id },
          _sum: { quantity: true },
        });

        return {
          id: product.id,
          category: product.category?.name || "不明",
          name: product.name,
          price: product.price,
          stock: product.stock,
          salesTotal: salesTotal._sum.quantity || 0,
          seller: product.user?.name || "不明",
        };
      })
    );

    // 総件数を取得してページ数を計算
    const totalCount = await prisma.products.count();
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return NextResponse.json({ products: productData, totalPages });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
