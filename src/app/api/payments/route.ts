import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: 支払い情報を保存
export async function POST(req: NextRequest) {
  try {
    const { id, userId, name } = await req.json();

    if (!id || !userId || !name) {
      return NextResponse.json(
        { error: "id, userId, and name are required" },
        { status: 400 }
      );
    }

    // payments テーブルにデータを保存
    const payment = await prisma.payments.create({
      data: {
        id,
        userId,
        name,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("支払い処理エラー:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
