import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// OrderItemRequest 型の定義
type OrderItemRequest = {
  userId: number;
  orderId: number;
  productId: number;
  kindId: number;
  quantity: number;
  status: number;
};

// POST: 注文アイテムの登録
export async function POST(req: NextRequest) {
  try {
    const body: OrderItemRequest = await req.json(); // 型を指定
    
    // リクエストボディをログで確認
    console.log("Received body:", body);

    // `userId` を取得
    const { userId, orderId, productId, kindId, quantity } = body;

    // 現在の最大 ID を取得
    const maxOrderItem = await prisma.orderItems.findFirst({
      orderBy: { id: "desc" },
    });

    let newOrderItemId = maxOrderItem ? maxOrderItem.id + 1 : 1;

    // 商品ごとに `orderItems` テーブルへ登録
    const orderItemData = [body].map((item) => ({
      id: newOrderItemId++,
      orderId: item.orderId,
      productId: item.productId,
      kindId: item.kindId,
      quantity: item.quantity,
      status: 0, // 初期状態
    }));

    // `orderItems` にデータを一括登録
    await prisma.orderItems.createMany({
      data: orderItemData,
    });

    // カートから削除
    await prisma.carts.deleteMany({
      where: {
        userId,
        productId,
        kindId,
      },
    });

    return NextResponse.json({ message: "注文アイテム登録 & カート削除完了" }, { status: 201 });
  } catch (error) {
    console.error("注文アイテム登録エラー:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
