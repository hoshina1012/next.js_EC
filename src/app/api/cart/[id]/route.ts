import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: 指定したユーザーのカートアイテムを取得
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // userId を数値に変換
  const numericUserId = parseInt(id, 10);
  if (isNaN(numericUserId)) {
    return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
  }

  try {
    const cartItems = await prisma.carts.findMany({
      where: { userId: numericUserId }, // 数値型で渡す
      include: { product: true },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("カートデータ取得エラー:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
