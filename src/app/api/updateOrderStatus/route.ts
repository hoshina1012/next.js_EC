import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // prismaのインスタンスをインポート

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // orderItemsテーブルのステータスを更新
    await prisma.orderItems.updateMany({
      where: { id: orderId, status: 0 }, // 未発送のものだけを更新
      data: { status: 1 }, // 発送済みに更新
    });

    return NextResponse.json({ message: "ステータスが更新されました" });
  } catch (error) {
    console.error("ステータス更新エラー:", error);
    return NextResponse.json({ error: "ステータス更新に失敗しました" }, { status: 500 });
  }
}
