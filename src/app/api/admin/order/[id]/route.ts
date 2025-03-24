import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number(params.id);

    // 注文情報取得
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { name: true },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                categoryId: true, // カテゴリ情報を取得
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "注文が見つかりません" }, { status: 404 });
    }

    // 注文アイテムデータを整理
    const orderItems = await Promise.all(
      order.orderItems.map(async (item) => {
        let kindName = "";

        if (item.product.categoryId === 1) {
          // ラケットの場合 (types テーブルから取得)
          const type = await prisma.racketTypes.findFirst({
            where: { id: item.kindId },
            select: { type: { select: { name: true } } },
          });
          kindName = type?.type.name || "";
        } else if (item.product.categoryId === 2) {
          // ラバーの場合 (colors テーブルから取得)
          const color = await prisma.rubberColors.findFirst({
            where: { id: item.kindId },
            select: { color: { select: { name: true } } },
          });
          kindName = color?.color.name || "";
        } else if (item.product.categoryId === 3) {
          // シューズの場合 (sizes テーブルから取得)
          const size = await prisma.shoesSizes.findFirst({
            where: { id: item.kindId },
            select: { size: { select: { name: true } } },
          });
          kindName = size?.size.name || "";
        }

        return {
          id: item.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          seller: item.product.user.name,
          status: item.status === 0 ? "未発送" : "発送済",
          productId: item.product.id,
          kind: kindName, // 取得した種類を追加
        };
      })
    );

    return NextResponse.json({
      id: order.id,
      userName: order.user.name,
      amount: order.amount,
      items: orderItems,
    });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
