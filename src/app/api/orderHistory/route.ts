import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1ページあたりの表示件数
const PAGE_SIZE = 5;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // 注文の総件数を取得
    const totalCount = await prisma.orderItems.count({
      where: { order: { userId: userIdNumber } },
    });

    // 注文アイテムを取得 (ページング対応)
    const orderItems = await prisma.orderItems.findMany({
      where: { order: { userId: userIdNumber } },
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { order: true },
    });

    // 商品情報の取得
    const productIds = orderItems.map((item) => item.productId);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // データ整形
    const result = await Promise.all(
      orderItems.map(async (item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;

        let kindName = "";
        if (product.categoryId === 1) {
          const type = await prisma.types.findUnique({ where: { id: item.kindId } });
          kindName = type?.name || "不明";
        } else if (product.categoryId === 2) {
          const rubberColor = await prisma.rubberColors.findUnique({ where: { id: item.kindId }, include: { color: true } });
          kindName = rubberColor?.color?.name || "不明";
        } else if (product.categoryId === 3) {
          const shoeSize = await prisma.shoesSizes.findUnique({ where: { id: item.kindId }, include: { size: true } });
          kindName = shoeSize?.size?.name || "不明";
        }

        return {
          id: item.id,
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          kind: kindName,
          createdAt: item.order.createdAt,
          status: item.status,
        };
      })
    );

    return NextResponse.json({ orders: result.filter(Boolean), totalCount });
  } catch (error) {
    console.error("注文履歴の取得エラー:", error);
    return NextResponse.json({ error: "Failed to fetch order history" }, { status: 500 });
  }
}
