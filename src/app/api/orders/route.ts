import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: 新しい注文を作成
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // リクエストボディを取得
    const { userId, amount } = body;

    if (!userId || !amount) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // 現在の最大 ID を取得
    const maxOrder = await prisma.orders.findFirst({
      orderBy: { id: "desc" },
    });

    const newOrderId = maxOrder ? maxOrder.id + 1 : 1; // 最大値 +1 を取得

    // 注文データを登録
    const newOrder = await prisma.orders.create({
      data: {
        id: newOrderId,
        userId,
        amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("注文データ登録エラー:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
